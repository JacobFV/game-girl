import { Network } from '../core/Network';
import { GameBoyDevice } from '../core/GameBoyDevice';

// Mock canvas and context for GameBoyDevice
const mockCanvas = {
  getContext: jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 10 })),
    drawImage: jest.fn(),
    fillStyle: '',
    font: ''
  }))
} as unknown as HTMLCanvasElement;

describe('Network', () => {
  let network: Network;
  let device1: GameBoyDevice;
  let device2: GameBoyDevice;
  let device3: GameBoyDevice;

  beforeEach(() => {
    network = new Network();
    device1 = new GameBoyDevice('device-1', mockCanvas);
    device2 = new GameBoyDevice('device-2', mockCanvas);
    device3 = new GameBoyDevice('device-3', mockCanvas);
  });

  test('should initialize with no devices', () => {
    expect(network.getDevices()).toEqual([]);
    expect(network.getDeviceCount()).toBe(0);
  });

  test('should add a device to the network', () => {
    network.addDevice(device1);
    
    expect(network.getDevices()).toContain(device1);
    expect(network.getDeviceCount()).toBe(1);
    expect(network.hasDevice(device1)).toBe(true);
  });

  test('should not add the same device twice', () => {
    network.addDevice(device1);
    network.addDevice(device1);
    
    expect(network.getDeviceCount()).toBe(1);
  });

  test('should remove a device from the network', () => {
    network.addDevice(device1);
    expect(network.hasDevice(device1)).toBe(true);
    
    network.removeDevice(device1);
    
    expect(network.hasDevice(device1)).toBe(false);
    expect(network.getDeviceCount()).toBe(0);
  });

  test('should connect devices when added to the network', () => {
    network.addDevice(device1);
    network.addDevice(device2);
    
    // Devices should be connected to each other
    expect(device1.getConnectedDevices()).toContain(device2);
    expect(device2.getConnectedDevices()).toContain(device1);
  });

  test('should disconnect devices when removed from the network', () => {
    network.addDevice(device1);
    network.addDevice(device2);
    
    // Devices should be connected initially
    expect(device1.getConnectedDevices()).toContain(device2);
    
    network.removeDevice(device2);
    
    // Devices should be disconnected after removal
    expect(device1.getConnectedDevices()).not.toContain(device2);
  });

  test('should clear all devices from the network', () => {
    network.addDevice(device1);
    network.addDevice(device2);
    network.addDevice(device3);
    
    expect(network.getDeviceCount()).toBe(3);
    
    network.clear();
    
    expect(network.getDeviceCount()).toBe(0);
    expect(network.getDevices()).toEqual([]);
    
    // All devices should be disconnected
    expect(device1.getConnectedDevices()).not.toContain(device2);
    expect(device1.getConnectedDevices()).not.toContain(device3);
    expect(device2.getConnectedDevices()).not.toContain(device3);
  });
}); 