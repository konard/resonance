/**
 * Experimental script to test audio synchronization timing
 * This helps understand latency and precision requirements
 */

interface SyncTest {
  deviceId: string;
  timestamp: number;
  latency: number;
}

class AudioSyncExperiment {
  private devices: Map<string, SyncTest> = new Map();
  private tolerance: number = 50; // milliseconds

  /**
   * Simulate adding a device to the sync group
   */
  addDevice(deviceId: string): void {
    this.devices.set(deviceId, {
      deviceId,
      timestamp: Date.now(),
      latency: Math.random() * 100, // Simulate 0-100ms latency
    });
    console.log(`Device ${deviceId} added with ${this.devices.get(deviceId)?.latency.toFixed(2)}ms latency`);
  }

  /**
   * Calculate the maximum latency difference between devices
   */
  getMaxLatencyDifference(): number {
    const latencies = Array.from(this.devices.values()).map(d => d.latency);
    return Math.max(...latencies) - Math.min(...latencies);
  }

  /**
   * Check if all devices are within sync tolerance
   */
  isInSync(): boolean {
    const maxDiff = this.getMaxLatencyDifference();
    const inSync = maxDiff <= this.tolerance;
    console.log(`Max latency difference: ${maxDiff.toFixed(2)}ms - ${inSync ? 'IN SYNC' : 'OUT OF SYNC'}`);
    return inSync;
  }

  /**
   * Simulate sending a sync command to all devices
   */
  sendSyncCommand(command: string, position: number): void {
    console.log(`\nSending ${command} command at position ${position}s`);

    this.devices.forEach((device) => {
      const arrivalTime = Date.now() + device.latency;
      const adjustedPosition = position + (device.latency / 1000);

      console.log(`  ${device.deviceId}: arrives at ${arrivalTime}, adjusted position ${adjustedPosition.toFixed(3)}s`);
    });
  }

  /**
   * Run a full synchronization test
   */
  runTest(): void {
    console.log('=== Audio Sync Experiment ===\n');

    // Add multiple test devices
    this.addDevice('device-001');
    this.addDevice('device-002');
    this.addDevice('device-003');
    this.addDevice('device-004');

    console.log('');
    this.isInSync();

    // Test sync commands
    this.sendSyncCommand('PLAY', 10.5);
    this.sendSyncCommand('PAUSE', 25.3);
    this.sendSyncCommand('SEEK', 45.0);

    console.log('\n=== Test Complete ===');
  }
}

// Run the experiment
if (typeof window === 'undefined') {
  // Node.js environment
  const experiment = new AudioSyncExperiment();
  experiment.runTest();
}

export default AudioSyncExperiment;
