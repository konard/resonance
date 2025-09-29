import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import MusicPlayer from '@/components/MusicPlayer'

describe('MusicPlayer Component', () => {
  const mockProps = {
    isPlaying: false,
    setIsPlaying: jest.fn(),
    currentTime: 0,
    setCurrentTime: jest.fn(),
    duration: 100,
    setDuration: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders music player with track information', () => {
    render(<MusicPlayer {...mockProps} />)

    expect(screen.getByText('Sample Track')).toBeInTheDocument()
    expect(screen.getByText('Sample Artist')).toBeInTheDocument()
  })

  it('toggles play/pause when button is clicked', () => {
    const { rerender } = render(<MusicPlayer {...mockProps} />)

    const playButton = screen.getByRole('button', { name: /play|pause/i })
    fireEvent.click(playButton)

    expect(mockProps.setIsPlaying).toHaveBeenCalledWith(true)

    rerender(<MusicPlayer {...mockProps} isPlaying={true} />)
    fireEvent.click(playButton)

    expect(mockProps.setIsPlaying).toHaveBeenCalledWith(false)
  })

  it('displays formatted time correctly', () => {
    render(<MusicPlayer {...mockProps} currentTime={65} duration={180} />)

    expect(screen.getByText('1:05')).toBeInTheDocument()
    expect(screen.getByText('3:00')).toBeInTheDocument()
  })

  it('handles volume control changes', () => {
    render(<MusicPlayer {...mockProps} />)

    const volumeSliders = screen.getAllByRole('slider')
    const volumeSlider = volumeSliders[volumeSliders.length - 1]

    fireEvent.change(volumeSlider, { target: { value: '0.5' } })

    expect(volumeSlider).toHaveValue('0.5')
  })

  it('handles seek bar changes', () => {
    render(<MusicPlayer {...mockProps} />)

    const seekBars = screen.getAllByRole('slider')
    const seekBar = seekBars[0]

    fireEvent.change(seekBar, { target: { value: '50' } })

    expect(mockProps.setCurrentTime).toHaveBeenCalledWith(50)
  })
})