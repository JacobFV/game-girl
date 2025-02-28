import { GameBoyDevice, ButtonStates } from '../core/GameBoyDevice';
import { Game } from '../games/Game';

// Mock canvas and context
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

// Mock game class
class MockGame extends Game {
  constructor() {
    super(
      'Mock Game',
      'A game for testing',
      'Player description',
      'Developer description'
    );
  }

  protected onInit = jest.fn();
  protected onStep = jest.fn();
}

describe('GameBoyDevice', () => {
  let device: GameBoyDevice;
  
  beforeEach(() => {
    device = new GameBoyDevice('test-device', mockCanvas);
  });

  test('should initialize with correct default values', () => {
    expect(device.getId()).toBe('test-device');
    expect(device.isDeviceOn()).toBe(false);
    expect(device.getGame()).toBeNull();
    expect(device.getConnectedDevices()).toEqual([]);
  });

  test('should update button states correctly', () => {
    // Initial state - all buttons should be false
    const initialButtonStates = device.getButtonStates();
    for (const state of Object.values(initialButtonStates)) {
      expect(state).toBe(false);
    }

    // Set a button state
    device.setButtonState('a', true);
    
    // Check that only the 'a' button is true
    const updatedButtonStates = device.getButtonStates();
    expect(updatedButtonStates.a).toBe(true);
    
    // Check that other buttons are still false
    expect(updatedButtonStates.b).toBe(false);
    expect(updatedButtonStates.up).toBe(false);
  });

  test('should load a game correctly', () => {
    const game = new MockGame();
    device.loadGame(game);
    
    expect(device.getGame()).toBe(game);
  });

  test('should turn on and off correctly', () => {
    // Initially off
    expect(device.isDeviceOn()).toBe(false);
    
    // Load a game first (required to turn on the device)
    const game = new MockGame();
    device.loadGame(game);
    
    // Turn on
    device.turnOn();
    expect(device.isDeviceOn()).toBe(true);
    
    // Turn off
    device.turnOff();
    expect(device.isDeviceOn()).toBe(false);
  });

  test('should connect to another device', () => {
    const otherDevice = new GameBoyDevice('other-device', mockCanvas);
    
    device.connectTo(otherDevice);
    
    expect(device.getConnectedDevices()).toContain(otherDevice);
  });

  test('should disconnect from another device', () => {
    const otherDevice = new GameBoyDevice('other-device', mockCanvas);
    
    // Connect first
    device.connectTo(otherDevice);
    expect(device.getConnectedDevices()).toContain(otherDevice);
    
    // Then disconnect
    device.disconnectFrom(otherDevice);
    expect(device.getConnectedDevices()).not.toContain(otherDevice);
  });

  test('should send and receive network messages', () => {
    const otherDevice = new GameBoyDevice('other-device', mockCanvas);
    
    // Connect devices
    device.connectTo(otherDevice);
    
    // Send message
    const testData = { test: 'data' };
    device.sendNetworkMessage('other-device', testData);
    
    // Check that other device received the message
    const messages = otherDevice.getNetworkMessages(true);
    expect(messages.length).toBe(1);
    expect(messages[0].from).toBe('test-device');
    expect(messages[0].to).toBe('other-device');
    expect(messages[0].data).toEqual(testData);
  });
}); 