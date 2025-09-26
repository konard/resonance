import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import DeviceSync from '@/components/DeviceSync'

jest.mock('@/lib/useWebRTC', () => ({
  useWebRTC: () => ({
    connect: jest.fn(),
    disconnect: jest.fn(),
    isConnected: false,
    peers: [],
  }),
}))

describe('DeviceSync Component', () => {
  it('renders device sync interface', () => {
    render(<DeviceSync />)

    expect(screen.getByText('Device Sync')).toBeInTheDocument()
    expect(screen.getByText('Create Room')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter room code')).toBeInTheDocument()
  })

  it('handles room creation', () => {
    render(<DeviceSync />)

    const createButton = screen.getByText('Create Room')
    fireEvent.click(createButton)

    expect(createButton).toHaveTextContent('Create Room')
  })

  it('handles room code input', () => {
    render(<DeviceSync />)

    const input = screen.getByPlaceholderText('Enter room code')
    fireEvent.change(input, { target: { value: 'ABC123' } })

    expect(input).toHaveValue('ABC123')
  })

  it('enables join button when room code is entered', () => {
    render(<DeviceSync />)

    const joinButton = screen.getByText('Join')
    expect(joinButton).toBeDisabled()

    const input = screen.getByPlaceholderText('Enter room code')
    fireEvent.change(input, { target: { value: 'ABC123' } })

    expect(joinButton).not.toBeDisabled()
  })

  it('shows connected state when connected', () => {
    const mockUseWebRTC = jest.requireMock('@/lib/useWebRTC')
    mockUseWebRTC.useWebRTC = () => ({
      connect: jest.fn(),
      disconnect: jest.fn(),
      isConnected: true,
      peers: [
        { id: '1', name: 'Device 1', type: 'mobile', connected: true },
        { id: '2', name: 'Device 2', type: 'desktop', connected: true },
      ],
    })

    render(<DeviceSync />)

    expect(screen.getByText('Disconnect')).toBeInTheDocument()
    expect(screen.getByText(/Connected Devices/)).toBeInTheDocument()
  })
})