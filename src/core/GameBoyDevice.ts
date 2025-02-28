import { Game } from '../games/Game';

// Button states for the Game Boy
export interface ButtonStates {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  a: boolean;
  b: boolean;
  start: boolean;
  select: boolean;
}

// Network message interface for multiplayer functionality
export interface NetworkMessage {
  from: string;
  to: string;
  data: any;
  timestamp: number;
}

export class GameBoyDevice {
  private id: string;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frameColor: string;
  private game: Game | null = null;
  private isOn: boolean = false;
  private buttonStates: ButtonStates = {
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
    start: false,
    select: false
  };
  private networkMessages: NetworkMessage[] = [];
  private connectedDevices: GameBoyDevice[] = [];
  private updateInterval: number | null = null;
  private frameRate: number = 60; // Default frame rate

  constructor(id: string, canvas: HTMLCanvasElement) {
    this.id = id;
    this.canvas = canvas;
    
    // Get the 2D rendering context
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      throw new Error('Could not get 2D rendering context');
    }
    this.ctx = context;
    
    // Set pixelated rendering (no anti-aliasing)
    this.ctx.imageSmoothingEnabled = false;
    
    // Choose a random color for the Game Boy frame
    this.frameColor = this.getRandomColor();
    
    // Initialize the canvas
    this.clearScreen();
  }

  // Get a random pastel color for the Game Boy frame
  private getRandomColor(): string {
    const colors = [
      '#8bcdcd', // Teal
      '#a6dcef', // Light Blue
      '#ffaaa5', // Salmon
      '#ffd3b6', // Peach
      '#dcedc1', // Light Green
      '#fdffbc', // Light Yellow
      '#d9a5b3', // Pink
      '#c6d8ff', // Lavender
      '#b8e0d2', // Mint
      '#d6cbd3'  // Lilac
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Clear the screen with a light gray color
  private clearScreen(): void {
    this.ctx.fillStyle = '#c4cfa1'; // Classic Game Boy screen color
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Load a game into the device
  public loadGame(game: Game): void {
    this.game = game;
    this.clearScreen();
    
    if (this.isOn) {
      this.turnOff();
      this.turnOn();
    }
    
    console.log(`Game "${game.getTitle()}" loaded on device ${this.id}`);
  }

  // Turn on the device and start the game loop
  public turnOn(): void {
    if (this.isOn || !this.game) return;
    
    this.isOn = true;
    console.log(`Device ${this.id} turned on`);
    
    // Initialize the game
    this.game.init(this);
    
    // Start the game loop
    this.updateInterval = window.setInterval(() => {
      if (this.game) {
        this.game.step(this);
      }
    }, 1000 / this.frameRate);
  }

  // Turn off the device and stop the game loop
  public turnOff(): void {
    if (!this.isOn) return;
    
    this.isOn = false;
    console.log(`Device ${this.id} turned off`);
    
    // Stop the game loop
    if (this.updateInterval !== null) {
      window.clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    this.clearScreen();
  }

  // Connect this device to another device for multiplayer
  public connectTo(device: GameBoyDevice): void {
    if (!this.connectedDevices.includes(device)) {
      this.connectedDevices.push(device);
      device.connectTo(this); // Ensure bidirectional connection
      console.log(`Device ${this.id} connected to device ${device.getId()}`);
    }
  }

  // Disconnect from another device
  public disconnectFrom(device: GameBoyDevice): void {
    const index = this.connectedDevices.indexOf(device);
    if (index !== -1) {
      this.connectedDevices.splice(index, 1);
      device.disconnectFrom(this); // Ensure bidirectional disconnection
      console.log(`Device ${this.id} disconnected from device ${device.getId()}`);
    }
  }

  // Send a network message to connected devices
  public sendNetworkMessage(to: string | 'all', data: any): void {
    const message: NetworkMessage = {
      from: this.id,
      to,
      data,
      timestamp: Date.now()
    };
    
    // Add to local message queue
    this.networkMessages.push(message);
    
    // Send to connected devices
    this.connectedDevices.forEach(device => {
      if (to === 'all' || to === device.getId()) {
        device.receiveNetworkMessage(message);
      }
    });
  }

  // Receive a network message from another device
  public receiveNetworkMessage(message: NetworkMessage): void {
    this.networkMessages.push(message);
    console.log(`Device ${this.id} received message from ${message.from}:`, message.data);
  }

  // Get network messages and optionally clear the queue
  public getNetworkMessages(clear: boolean = false): NetworkMessage[] {
    const messages = [...this.networkMessages];
    if (clear) {
      this.networkMessages = [];
    }
    return messages;
  }

  // Set the state of a button
  public setButtonState(button: keyof ButtonStates, isPressed: boolean): void {
    this.buttonStates[button] = isPressed;
  }

  // Get the current button states
  public getButtonStates(): ButtonStates {
    return { ...this.buttonStates };
  }

  // Get the canvas context for rendering
  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }

  // Get the canvas element
  public getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  // Get the device ID
  public getId(): string {
    return this.id;
  }

  // Get the frame color
  public getFrameColor(): string {
    return this.frameColor;
  }

  // Get the current game
  public getGame(): Game | null {
    return this.game;
  }

  // Check if the device is on
  public isDeviceOn(): boolean {
    return this.isOn;
  }

  // Get connected devices
  public getConnectedDevices(): GameBoyDevice[] {
    return [...this.connectedDevices];
  }
} 