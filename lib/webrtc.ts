/**
 * WebRTC utility for peer-to-peer communication between devices
 * This enables audio synchronization across multiple devices
 */

export interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  dataChannel?: RTCDataChannel;
}

export interface SyncMessage {
  type: 'play' | 'pause' | 'seek' | 'sync';
  timestamp: number;
  position?: number;
  data?: any;
}

export class WebRTCManager {
  private peerConnections: Map<string, PeerConnection> = new Map();
  private localStream: MediaStream | null = null;
  private onMessageCallback?: (message: SyncMessage, peerId: string) => void;

  constructor() {
    // Initialize WebRTC configuration
  }

  /**
   * Create a new peer connection
   */
  async createPeerConnection(peerId: string): Promise<RTCPeerConnection> {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    const pc = new RTCPeerConnection(configuration);

    // Set up event handlers
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate to remote peer
        console.log('ICE candidate:', event.candidate);
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        this.removePeerConnection(peerId);
      }
    };

    // Create data channel for sending sync messages
    const dataChannel = pc.createDataChannel('sync');
    dataChannel.onopen = () => {
      console.log('Data channel opened for peer:', peerId);
    };

    dataChannel.onmessage = (event) => {
      try {
        const message: SyncMessage = JSON.parse(event.data);
        if (this.onMessageCallback) {
          this.onMessageCallback(message, peerId);
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    this.peerConnections.set(peerId, {
      id: peerId,
      connection: pc,
      dataChannel,
    });

    return pc;
  }

  /**
   * Remove a peer connection
   */
  removePeerConnection(peerId: string): void {
    const peer = this.peerConnections.get(peerId);
    if (peer) {
      peer.dataChannel?.close();
      peer.connection.close();
      this.peerConnections.delete(peerId);
    }
  }

  /**
   * Send a sync message to all connected peers
   */
  sendSyncMessage(message: SyncMessage): void {
    const data = JSON.stringify(message);
    this.peerConnections.forEach((peer) => {
      if (peer.dataChannel?.readyState === 'open') {
        peer.dataChannel.send(data);
      }
    });
  }

  /**
   * Set callback for received messages
   */
  onMessage(callback: (message: SyncMessage, peerId: string) => void): void {
    this.onMessageCallback = callback;
  }

  /**
   * Get list of connected peer IDs
   */
  getConnectedPeers(): string[] {
    return Array.from(this.peerConnections.keys());
  }

  /**
   * Initialize local media stream for audio
   */
  async initializeLocalStream(): Promise<MediaStream> {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      return this.localStream;
    } catch (error) {
      console.error('Failed to get local stream:', error);
      throw error;
    }
  }

  /**
   * Add local stream to all peer connections
   */
  addStreamToPeers(): void {
    if (!this.localStream) return;

    this.localStream.getTracks().forEach((track) => {
      this.peerConnections.forEach((peer) => {
        peer.connection.addTrack(track, this.localStream!);
      });
    });
  }

  /**
   * Clean up all connections and streams
   */
  cleanup(): void {
    this.peerConnections.forEach((peer) => {
      this.removePeerConnection(peer.id);
    });

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
  }
}

/**
 * Calculate time difference for synchronization
 */
export function calculateTimeDifference(
  localTime: number,
  remoteTime: number
): number {
  return remoteTime - localTime;
}

/**
 * Synchronize playback across devices with timestamp
 */
export function synchronizePlayback(
  audioElement: HTMLAudioElement,
  targetPosition: number,
  tolerance: number = 0.1
): void {
  const currentPosition = audioElement.currentTime;
  const difference = Math.abs(currentPosition - targetPosition);

  if (difference > tolerance) {
    audioElement.currentTime = targetPosition;
  }
}
