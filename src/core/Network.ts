import { GameBoyDevice } from './GameBoyDevice';

// Network class to manage connections between Game Boy devices
export class Network {
  private devices: GameBoyDevice[] = [];

  constructor() {}

  // Add a device to the network
  public addDevice(device: GameBoyDevice): void {
    if (!this.devices.includes(device)) {
      this.devices.push(device);
      
      // Connect the new device to all existing devices
      this.devices.forEach(existingDevice => {
        if (existingDevice !== device) {
          device.connectTo(existingDevice);
        }
      });
      
      console.log(`Device ${device.getId()} added to network`);
    }
  }

  // Remove a device from the network
  public removeDevice(device: GameBoyDevice): void {
    const index = this.devices.indexOf(device);
    if (index !== -1) {
      // Disconnect the device from all other devices
      this.devices.forEach(existingDevice => {
        if (existingDevice !== device) {
          device.disconnectFrom(existingDevice);
        }
      });
      
      // Remove the device from the network
      this.devices.splice(index, 1);
      
      console.log(`Device ${device.getId()} removed from network`);
    }
  }

  // Get all devices in the network
  public getDevices(): GameBoyDevice[] {
    return [...this.devices];
  }

  // Get the number of devices in the network
  public getDeviceCount(): number {
    return this.devices.length;
  }

  // Check if a device is in the network
  public hasDevice(device: GameBoyDevice): boolean {
    return this.devices.includes(device);
  }

  // Clear the network (remove all devices)
  public clear(): void {
    // Disconnect all devices from each other
    for (let i = 0; i < this.devices.length; i++) {
      for (let j = i + 1; j < this.devices.length; j++) {
        this.devices[i].disconnectFrom(this.devices[j]);
      }
    }
    
    this.devices = [];
    console.log('Network cleared');
  }
} 