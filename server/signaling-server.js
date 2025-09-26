const express = require('express')
const WebSocket = require('ws')
const http = require('http')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const rooms = new Map()
const clients = new Map()

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`)
  const roomId = url.searchParams.get('room')
  const clientId = generateId()

  console.log(`Client ${clientId} connected to room ${roomId}`)

  clients.set(ws, { id: clientId, room: roomId })

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set())
  }
  rooms.get(roomId).add(ws)

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString())
      handleMessage(ws, data)
    } catch (error) {
      console.error('Error parsing message:', error)
    }
  })

  ws.on('close', () => {
    const client = clients.get(ws)
    if (client) {
      console.log(`Client ${client.id} disconnected from room ${client.room}`)

      const room = rooms.get(client.room)
      if (room) {
        room.delete(ws)

        broadcast(client.room, {
          type: 'peer-left',
          peerId: client.id,
        }, ws)

        if (room.size === 0) {
          rooms.delete(client.room)
        }
      }

      clients.delete(ws)
    }
  })

  ws.on('error', (error) => {
    console.error('WebSocket error:', error)
  })

  notifyPeersOfNewConnection(ws, clientId, roomId)
})

function handleMessage(ws, message) {
  const client = clients.get(ws)
  if (!client) return

  switch (message.type) {
    case 'create-room':
    case 'join-room':
      console.log(`${message.type}: Room ${message.room}`)
      break

    case 'offer':
    case 'answer':
    case 'ice-candidate':
      const targetWs = findClientById(message.to)
      if (targetWs) {
        targetWs.send(JSON.stringify({
          ...message,
          from: client.id,
        }))
      }
      break

    default:
      broadcast(client.room, {
        ...message,
        from: client.id,
      }, ws)
  }
}

function notifyPeersOfNewConnection(newWs, newClientId, roomId) {
  const room = rooms.get(roomId)
  if (!room) return

  room.forEach((ws) => {
    if (ws !== newWs && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'peer-joined',
        peerId: newClientId,
      }))
    }
  })
}

function broadcast(roomId, message, excludeWs = null) {
  const room = rooms.get(roomId)
  if (!room) return

  const messageStr = JSON.stringify(message)
  room.forEach((ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(messageStr)
    }
  })
}

function findClientById(clientId) {
  for (const [ws, client] of clients.entries()) {
    if (client.id === clientId) {
      return ws
    }
  }
  return null
}

function generateId() {
  return Math.random().toString(36).substring(2, 15)
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    rooms: rooms.size,
    clients: clients.size,
  })
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => {
  console.log(`Signaling server running on port ${PORT}`)
})