import { Game } from '../games/Game';
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

// Concrete implementation of Game for testing
class TestGame extends Game {
  public initCalled = false;
  public stepCalled = false;

  constructor() {
    super(
      'Test Game',
      'A game for testing',
      'Player description for testing',
      'Developer description for testing'
    );
  }

  protected onInit(device: GameBoyDevice): void {
    this.initCalled = true;
  }

  protected onStep(device: GameBoyDevice): void {
    this.stepCalled = true;
  }
}

describe('Game', () => {
  let game: TestGame;
  let device: GameBoyDevice;

  beforeEach(() => {
    game = new TestGame();
    device = new GameBoyDevice('test-device', mockCanvas);
  });

  test('should initialize with correct properties', () => {
    expect(game.getTitle()).toBe('Test Game');
    expect(game.getDescription()).toBe('A game for testing');
    expect(game.getPlayerFacingDescription()).toBe('Player description for testing');
    expect(game.getDeveloperFacingDescription()).toBe('Developer description for testing');
  });

  test('should call onInit when init is called', () => {
    expect(game.initCalled).toBe(false);
    
    game.init(device);
    
    expect(game.initCalled).toBe(true);
  });

  test('should call onInit when step is called if not initialized', () => {
    expect(game.initCalled).toBe(false);
    expect(game.stepCalled).toBe(false);
    
    game.step(device);
    
    expect(game.initCalled).toBe(true);
    expect(game.stepCalled).toBe(true);
  });

  test('should not call onInit again if already initialized', () => {
    // First initialize
    game.init(device);
    expect(game.initCalled).toBe(true);
    
    // Reset the flag
    game.initCalled = false;
    
    // Call step
    game.step(device);
    
    // onInit should not be called again
    expect(game.initCalled).toBe(false);
    expect(game.stepCalled).toBe(true);
  });
}); 