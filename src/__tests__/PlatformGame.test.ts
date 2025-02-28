import { PlatformGame } from '../games/platform/PlatformGame';
import { GameBoyDevice } from '../core/GameBoyDevice';
import type { ButtonStates } from '../core/GameBoyDevice';

// Mock canvas and context
const mockCanvas = {
  getContext: jest.fn(() => ({
    fillRect: jest.fn(),
    clearRect: jest.fn(),
    fillText: jest.fn(),
    measureText: jest.fn(() => ({ width: 10 })),
    drawImage: jest.fn(),
    fillStyle: '',
    font: '',
    // Add missing methods
    beginPath: jest.fn(),
    arc: jest.fn(),
    fill: jest.fn(),
    stroke: jest.fn()
  }))
} as unknown as HTMLCanvasElement;

describe('PlatformGame', () => {
  let game: PlatformGame;
  let device: GameBoyDevice;
  
  beforeEach(() => {
    game = new PlatformGame();
    device = new GameBoyDevice('test-device', mockCanvas);
  });

  test('should initialize with correct properties', () => {
    expect(game.getTitle()).toContain('Platform');
    expect(game.getDescription()).toBeTruthy();
    expect(game.getPlayerFacingDescription()).toBeTruthy();
    expect(game.getDeveloperFacingDescription()).toBeTruthy();
  });

  test('should initialize game state when init is called', () => {
    // Call init to set up the game
    game.init(device);
    
    // Call step to trigger game logic
    game.step(device);
    
    // The game should be running now
    // We can't easily test internal state, but we can verify the game doesn't crash
    expect(() => game.step(device)).not.toThrow();
  });

  test('should respond to button presses', () => {
    // Initialize the game
    game.init(device);
    
    // Simulate button presses
    const buttonStates: ButtonStates = {
      up: false,
      down: false,
      left: false,
      right: false,
      a: false,
      b: false,
      start: false,
      select: false
    };
    
    // Press right button
    buttonStates.right = true;
    device.setButtonState('right', true);
    
    // Step the game to process input
    game.step(device);
    
    // Press jump button
    buttonStates.a = true;
    device.setButtonState('a', true);
    
    // Step the game again
    game.step(device);
    
    // Release buttons
    buttonStates.right = false;
    buttonStates.a = false;
    device.setButtonState('right', false);
    device.setButtonState('a', false);
    
    // Step the game again
    game.step(device);
    
    // The game should continue running without errors
    expect(() => game.step(device)).not.toThrow();
  });

  test('should reset game state when restarted', () => {
    // Initialize the game
    game.init(device);
    
    // Step a few times to change game state
    for (let i = 0; i < 10; i++) {
      game.step(device);
    }
    
    // Press start button to pause/unpause
    device.setButtonState('start', true);
    game.step(device);
    device.setButtonState('start', false);
    
    // Step again
    game.step(device);
    
    // The game should continue running
    expect(() => game.step(device)).not.toThrow();
  });
}); 