'use client'

import { useState } from 'react'
import MusicPlayer from '@/components/MusicPlayer'
import DeviceSync from '@/components/DeviceSync'

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24">
      <div className="w-full max-w-5xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center mb-2">Resonance</h1>
          <p className="text-center text-gray-400">Sync music across all your devices</p>
        </header>

        <div className="grid gap-8">
          <MusicPlayer
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            duration={duration}
            setDuration={setDuration}
          />

          <DeviceSync />
        </div>
      </div>
    </main>
  )
}