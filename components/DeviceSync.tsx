'use client'

import { useState, useEffect } from 'react'
import { DevicePhoneMobileIcon, ComputerDesktopIcon, WifiIcon } from '@heroicons/react/24/solid'
import { useWebRTC } from '@/lib/useWebRTC'

export default function DeviceSync() {
  const [devices, setDevices] = useState<Array<{
    id: string
    name: string
    type: 'mobile' | 'desktop' | 'web'
    connected: boolean
    isMaster: boolean
  }>>([])

  const [roomCode, setRoomCode] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const { connect, disconnect, isConnected, peers } = useWebRTC()

  useEffect(() => {
    const currentDevice = {
      id: 'self',
      name: 'This Device',
      type: 'web' as const,
      connected: true,
      isMaster: true,
    }

    const peerDevices = peers.map((peer) => ({
      id: peer.id,
      name: peer.name || 'Unknown Device',
      type: peer.type || 'web' as const,
      connected: peer.connected,
      isMaster: false,
    }))

    setDevices([currentDevice, ...peerDevices])
  }, [peers])

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase()
    setRoomCode(code)
    return code
  }

  const handleCreateRoom = async () => {
    setIsConnecting(true)
    const code = generateRoomCode()

    try {
      await connect(code, true)
    } catch (error) {
      console.error('Failed to create room:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleJoinRoom = async () => {
    if (!roomCode) return

    setIsConnecting(true)
    try {
      await connect(roomCode, false)
    } catch (error) {
      console.error('Failed to join room:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <DevicePhoneMobileIcon className="w-5 h-5" />
      case 'desktop':
        return <ComputerDesktopIcon className="w-5 h-5" />
      default:
        return <WifiIcon className="w-5 h-5" />
    }
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Device Sync</h2>

      {!isConnected ? (
        <div className="space-y-4">
          <div>
            <button
              onClick={handleCreateRoom}
              disabled={isConnecting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white py-2 px-4 rounded-lg transition"
            >
              {isConnecting ? 'Creating...' : 'Create Room'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400">OR</span>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter room code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleJoinRoom}
              disabled={isConnecting || !roomCode}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white py-2 px-4 rounded-lg transition"
            >
              {isConnecting ? 'Joining...' : 'Join'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Room Code</p>
            <p className="text-2xl font-mono font-bold">{roomCode}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Connected Devices ({devices.length})</h3>
            <div className="space-y-2">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(device.type)}
                    <div>
                      <p className="font-medium">{device.name}</p>
                      {device.isMaster && (
                        <span className="text-xs text-blue-400">Master</span>
                      )}
                    </div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${device.connected ? 'bg-green-500' : 'bg-gray-500'}`} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => disconnect()}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}