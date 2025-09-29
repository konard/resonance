'use client'

import { useRef, useEffect, useState } from 'react'
import { PlayIcon, PauseIcon, ForwardIcon, BackwardIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid'

interface MusicPlayerProps {
  isPlaying: boolean
  setIsPlaying: (value: boolean) => void
  currentTime: number
  setCurrentTime: (value: number) => void
  duration: number
  setDuration: (value: number) => void
}

export default function MusicPlayer({
  isPlaying,
  setIsPlaying,
  currentTime,
  setCurrentTime,
  duration,
  setDuration,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState(0.7)
  const [currentTrack, setCurrentTrack] = useState({
    title: 'Sample Track',
    artist: 'Sample Artist',
    url: '/sample-audio.mp3'
  })

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [setCurrentTime, setDuration])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 shadow-xl">
      <audio ref={audioRef} src={currentTrack.url} />

      <div className="mb-6">
        <h2 className="text-2xl font-bold">{currentTrack.title}</h2>
        <p className="text-gray-400">{currentTrack.artist}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-gray-400">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
        <button className="p-2 hover:bg-gray-800 rounded-full transition">
          <BackwardIcon className="w-6 h-6" />
        </button>

        <button
          onClick={togglePlayPause}
          className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full transition"
        >
          {isPlaying ? (
            <PauseIcon className="w-8 h-8" />
          ) : (
            <PlayIcon className="w-8 h-8" />
          )}
        </button>

        <button className="p-2 hover:bg-gray-800 rounded-full transition">
          <ForwardIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <SpeakerWaveIcon className="w-5 h-5 text-gray-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  )
}