'use client'

import { useState, useEffect } from 'react'

export default function Home() {
  const [isConnected, setIsConnected] = useState(false)
  const [deviceId, setDeviceId] = useState('')
  const [connectedDevices, setConnectedDevices] = useState<string[]>([])

  useEffect(() => {
    // Generate a unique device ID
    const id = `device-${Math.random().toString(36).substr(2, 9)}`
    setDeviceId(id)
  }, [])

  const handleConnect = () => {
    setIsConnected(!isConnected)
    if (!isConnected) {
      // Simulate connecting to other devices
      setConnectedDevices([deviceId])
    } else {
      setConnectedDevices([])
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Resonance
        </h1>

        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">
            Sync Music Across Your Devices
          </h2>

          <div className="mb-6">
            <p className="text-sm opacity-75 mb-2">Device ID:</p>
            <code className="bg-black/20 px-3 py-2 rounded text-sm">
              {deviceId || 'Generating...'}
            </code>
          </div>

          <div className="mb-6">
            <p className="text-sm opacity-75 mb-2">Status:</p>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-gray-500'
                }`}
              />
              <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
          </div>

          {isConnected && (
            <div className="mb-6">
              <p className="text-sm opacity-75 mb-2">Connected Devices:</p>
              <ul className="space-y-1">
                {connectedDevices.map((device) => (
                  <li key={device} className="text-sm bg-black/20 px-3 py-2 rounded">
                    {device}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleConnect}
            className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
              isConnected
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isConnected ? 'Disconnect' : 'Connect Devices'}
          </button>

          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold mb-3">Features</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>✓ Cross-platform support (Web, iOS, Android, Electron)</li>
              <li>✓ WebRTC-based device communication</li>
              <li>✓ Real-time audio synchronization</li>
              <li>✓ Built with Next.js and React</li>
              <li>✓ Capacitor integration for mobile platforms</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center text-sm opacity-50">
          <p>Proof of Concept - Multi-Platform Music Sync App</p>
        </div>
      </div>
    </main>
  )
}
