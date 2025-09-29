'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface Peer {
  id: string
  name?: string
  type?: 'mobile' | 'desktop' | 'web'
  connected: boolean
  connection?: RTCPeerConnection
  dataChannel?: RTCDataChannel
}

interface SyncMessage {
  type: 'play' | 'pause' | 'seek' | 'volume' | 'track' | 'sync'
  data: any
  timestamp: number
}

export function useWebRTC() {
  const [isConnected, setIsConnected] = useState(false)
  const [peers, setPeers] = useState<Peer[]>([])
  const [isMaster, setIsMaster] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)
  const peersRef = useRef<Map<string, Peer>>(new Map())

  const createPeerConnection = useCallback((peerId: string, isInitiator: boolean) => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    }

    const pc = new RTCPeerConnection(configuration)
    let dataChannel: RTCDataChannel | null = null

    if (isInitiator) {
      dataChannel = pc.createDataChannel('sync')
      setupDataChannel(dataChannel, peerId)
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          candidate: event.candidate,
          to: peerId,
        }))
      }
    }

    pc.ondatachannel = (event) => {
      if (!isInitiator) {
        dataChannel = event.channel
        setupDataChannel(dataChannel, peerId)
      }
    }

    pc.onconnectionstatechange = () => {
      const peer = peersRef.current.get(peerId)
      if (peer) {
        peer.connected = pc.connectionState === 'connected'
        setPeers(Array.from(peersRef.current.values()))
      }
    }

    const peer: Peer = {
      id: peerId,
      connected: false,
      connection: pc,
      dataChannel: dataChannel || undefined,
    }

    peersRef.current.set(peerId, peer)
    setPeers(Array.from(peersRef.current.values()))

    return pc
  }, [])

  const setupDataChannel = (channel: RTCDataChannel, peerId: string) => {
    channel.onopen = () => {
      console.log(`Data channel opened with ${peerId}`)
      const peer = peersRef.current.get(peerId)
      if (peer) {
        peer.dataChannel = channel
        peer.connected = true
        setPeers(Array.from(peersRef.current.values()))
      }
    }

    channel.onmessage = (event) => {
      try {
        const message: SyncMessage = JSON.parse(event.data)
        handleSyncMessage(message, peerId)
      } catch (error) {
        console.error('Failed to parse message:', error)
      }
    }

    channel.onclose = () => {
      console.log(`Data channel closed with ${peerId}`)
      const peer = peersRef.current.get(peerId)
      if (peer) {
        peer.connected = false
        setPeers(Array.from(peersRef.current.values()))
      }
    }
  }

  const handleSyncMessage = (message: SyncMessage, fromPeer: string) => {
    console.log(`Received ${message.type} from ${fromPeer}:`, message.data)

    if (!isMaster) {
      window.dispatchEvent(new CustomEvent('sync-message', { detail: message }))
    } else {
      broadcastToOthers(message, fromPeer)
    }
  }

  const broadcastToOthers = (message: SyncMessage, excludePeer?: string) => {
    peersRef.current.forEach((peer, peerId) => {
      if (peerId !== excludePeer && peer.dataChannel?.readyState === 'open') {
        peer.dataChannel.send(JSON.stringify(message))
      }
    })
  }

  const connect = useCallback(async (roomCode: string, createRoom: boolean) => {
    return new Promise<void>((resolve, reject) => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
        const ws = new WebSocket(`${protocol}//localhost:8080/ws?room=${roomCode}`)
        wsRef.current = ws

        ws.onopen = () => {
          console.log('WebSocket connected')
          setIsConnected(true)
          setIsMaster(createRoom)

          ws.send(JSON.stringify({
            type: createRoom ? 'create-room' : 'join-room',
            room: roomCode,
          }))

          resolve()
        }

        ws.onmessage = async (event) => {
          try {
            const message = JSON.parse(event.data)

            switch (message.type) {
              case 'peer-joined':
                const pc = createPeerConnection(message.peerId, true)
                const offer = await pc.createOffer()
                await pc.setLocalDescription(offer)

                ws.send(JSON.stringify({
                  type: 'offer',
                  offer: offer,
                  to: message.peerId,
                }))
                break

              case 'offer':
                const answerPc = createPeerConnection(message.from, false)
                await answerPc.setRemoteDescription(message.offer)
                const answer = await answerPc.createAnswer()
                await answerPc.setLocalDescription(answer)

                ws.send(JSON.stringify({
                  type: 'answer',
                  answer: answer,
                  to: message.from,
                }))
                break

              case 'answer':
                const peer = peersRef.current.get(message.from)
                if (peer?.connection) {
                  await peer.connection.setRemoteDescription(message.answer)
                }
                break

              case 'ice-candidate':
                const candidatePeer = peersRef.current.get(message.from)
                if (candidatePeer?.connection) {
                  await candidatePeer.connection.addIceCandidate(message.candidate)
                }
                break

              case 'peer-left':
                const leftPeer = peersRef.current.get(message.peerId)
                if (leftPeer) {
                  leftPeer.connection?.close()
                  peersRef.current.delete(message.peerId)
                  setPeers(Array.from(peersRef.current.values()))
                }
                break
            }
          } catch (error) {
            console.error('Error handling WebSocket message:', error)
          }
        }

        ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          reject(error)
        }

        ws.onclose = () => {
          console.log('WebSocket disconnected')
          setIsConnected(false)
          disconnect()
        }
      } catch (error) {
        reject(error)
      }
    })
  }, [createPeerConnection])

  const disconnect = useCallback(() => {
    peersRef.current.forEach((peer) => {
      peer.dataChannel?.close()
      peer.connection?.close()
    })
    peersRef.current.clear()
    setPeers([])

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setIsConnected(false)
  }, [])

  const sendSyncMessage = useCallback((message: SyncMessage) => {
    if (!isConnected) return

    if (isMaster) {
      broadcastToOthers(message)
    } else {
      const masterPeer = Array.from(peersRef.current.values()).find(p => p.connected)
      if (masterPeer?.dataChannel?.readyState === 'open') {
        masterPeer.dataChannel.send(JSON.stringify(message))
      }
    }
  }, [isConnected, isMaster])

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [disconnect])

  return {
    connect,
    disconnect,
    isConnected,
    peers,
    isMaster,
    sendSyncMessage,
  }
}