import { Game } from '../Game';
import { GameBoyDevice, ButtonStates } from '../../core/GameBoyDevice';

// Adventure game implementation
export class AdventureGame extends Game {
  // Game state
  private player: {
    x: number;
    y: number;
    direction: 'up' | 'down' | 'left' | 'right';
  };
  
  private map: number[][];
  private items: Array<{
    x: number;
    y: number;
    type: 'key' | 'treasure' | 'potion';
    collected: boolean;
  }>;
  
  private inventory: {
    keys: number;
    treasures: number;
    potions: number;
  };
  
  private currentRoom: number;
  private rooms: Array<{
    id: number;
    name: string;
    description: string;
    exits: Array<{
      direction: 'up' | 'down' | 'left' | 'right';
      roomId: number;
      locked: boolean;
    }>;
  }>;
  
  private messageQueue: string[];
  private messageTimer: number;
  private showingMessage: boolean;
  
  private tileSize: number;
  private screenWidth: number;
  private screenHeight: number;

  constructor() {
    super(
      'Mystic Quest',
      'An adventure game with exploration and puzzles',
      'Explore a mysterious world, collect items, and solve puzzles to progress through different areas.',
      'Implements a state machine for game progression, tile-based map system, inventory management, and simple collision detection.'
    );
    
    this.screenWidth = 160;
    this.screenHeight = 144;
    this.tileSize = 16;
    
    // Initialize player
    this.player = {
      x: 5,
      y: 5,
      direction: 'down'
    };
    
    // Initialize inventory
    this.inventory = {
      keys: 0,
      treasures: 0,
      potions: 0
    };
    
    // Initialize message system
    this.messageQueue = [];
    this.messageTimer = 0;
    this.showingMessage = false;
    
    // Initialize rooms
    this.rooms = [
      {
        id: 0,
        name: 'Starting Room',
        description: 'A small room with stone walls.',
        exits: [
          { direction: 'right', roomId: 1, locked: false },
          { direction: 'down', roomId: 2, locked: false }
        ]
      },
      {
        id: 1,
        name: 'Treasure Room',
        description: 'A room filled with ancient artifacts.',
        exits: [
          { direction: 'left', roomId: 0, locked: false },
          { direction: 'down', roomId: 3, locked: true }
        ]
      },
      {
        id: 2,
        name: 'Dark Corridor',
        description: 'A long, dark corridor.',
        exits: [
          { direction: 'up', roomId: 0, locked: false },
          { direction: 'right', roomId: 3, locked: false }
        ]
      },
      {
        id: 3,
        name: 'Final Chamber',
        description: 'A grand chamber with a pedestal in the center.',
        exits: [
          { direction: 'up', roomId: 1, locked: false },
          { direction: 'left', roomId: 2, locked: false }
        ]
      }
    ];
    
    this.currentRoom = 0;
    
    // Initialize map for current room
    this.map = this.createMapForRoom(this.currentRoom);
    
    // Initialize items
    this.items = [
      { x: 8, y: 3, type: 'key', collected: false },
      { x: 3, y: 7, type: 'potion', collected: false },
      { x: 7, y: 7, type: 'treasure', collected: false }
    ];
  }

  protected onInit(device: GameBoyDevice): void {
    console.log('Adventure game initialized');
    this.addMessage('Welcome to Mystic Quest!');
    this.addMessage(this.rooms[this.currentRoom].description);
  }

  protected onStep(device: GameBoyDevice): void {
    const ctx = device.getContext();
    const buttonStates = device.getButtonStates();
    
    // Clear the screen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    
    // Handle input if not showing a message
    if (!this.showingMessage) {
      this.handleInput(buttonStates);
    } else {
      // Handle message display
      this.handleMessages(buttonStates);
    }
    
    // Draw the map
    this.drawMap(ctx);
    
    // Draw items
    this.drawItems(ctx);
    
    // Draw the player
    this.drawPlayer(ctx);
    
    // Draw UI
    this.drawUI(ctx);
    
    // Draw message if showing
    if (this.showingMessage) {
      this.drawMessage(ctx);
    }
  }

  private createMapForRoom(roomId: number): number[][] {
    // Create a basic map with walls (1) and floor (0)
    const map: number[][] = [];
    
    for (let y = 0; y < 9; y++) {
      map[y] = [];
      for (let x = 0; x < 10; x++) {
        // Create walls around the edges
        if (x === 0 || x === 9 || y === 0 || y === 8) {
          map[y][x] = 1; // Wall
        } else {
          map[y][x] = 0; // Floor
        }
      }
    }
    
    // Create exits based on room configuration
    const room = this.rooms[roomId];
    
    for (const exit of room.exits) {
      if (exit.locked) continue;
      
      switch (exit.direction) {
        case 'up':
          map[0][4] = 2; // Door
          map[0][5] = 2; // Door
          break;
        case 'right':
          map[4][9] = 2; // Door
          map[5][9] = 2; // Door
          break;
        case 'down':
          map[8][4] = 2; // Door
          map[8][5] = 2; // Door
          break;
        case 'left':
          map[4][0] = 2; // Door
          map[5][0] = 2; // Door
          break;
      }
    }
    
    return map;
  }

  private handleInput(buttonStates: ButtonStates): void {
    let newX = this.player.x;
    let newY = this.player.y;
    
    // Movement
    if (buttonStates.up) {
      this.player.direction = 'up';
      newY--;
    } else if (buttonStates.down) {
      this.player.direction = 'down';
      newY++;
    } else if (buttonStates.left) {
      this.player.direction = 'left';
      newX--;
    } else if (buttonStates.right) {
      this.player.direction = 'right';
      newX++;
    }
    
    // Action button
    if (buttonStates.a) {
      this.handleAction();
    }
    
    // Check if the new position is valid
    if (this.isValidPosition(newX, newY)) {
      this.player.x = newX;
      this.player.y = newY;
      
      // Check for room transitions
      this.checkRoomTransition();
      
      // Check for item collection
      this.checkItemCollection();
    }
  }

  private isValidPosition(x: number, y: number): boolean {
    // Check map boundaries
    if (x < 0 || x >= 10 || y < 0 || y >= 9) {
      return false;
    }
    
    // Check for walls
    if (this.map[y][x] === 1) {
      return false;
    }
    
    return true;
  }

  private checkRoomTransition(): void {
    // Check if player is at a door
    if (this.map[this.player.y][this.player.x] === 2) {
      // Find the exit that matches the player's position
      const room = this.rooms[this.currentRoom];
      
      for (const exit of room.exits) {
        if (exit.locked) continue;
        
        let shouldTransition = false;
        
        switch (exit.direction) {
          case 'up':
            shouldTransition = this.player.y === 0;
            break;
          case 'right':
            shouldTransition = this.player.x === 9;
            break;
          case 'down':
            shouldTransition = this.player.y === 8;
            break;
          case 'left':
            shouldTransition = this.player.x === 0;
            break;
        }
        
        if (shouldTransition) {
          // Transition to the new room
          this.currentRoom = exit.roomId;
          this.map = this.createMapForRoom(this.currentRoom);
          
          // Position player at the opposite side
          switch (exit.direction) {
            case 'up':
              this.player.y = 7;
              break;
            case 'right':
              this.player.x = 1;
              break;
            case 'down':
              this.player.y = 1;
              break;
            case 'left':
              this.player.x = 8;
              break;
          }
          
          // Show room description
          this.addMessage(`Entered ${this.rooms[this.currentRoom].name}`);
          this.addMessage(this.rooms[this.currentRoom].description);
          
          break;
        }
      }
    }
  }

  private checkItemCollection(): void {
    for (const item of this.items) {
      if (!item.collected && item.x === this.player.x && item.y === this.player.y) {
        item.collected = true;
        
        switch (item.type) {
          case 'key':
            this.inventory.keys++;
            this.addMessage('Found a key!');
            break;
          case 'treasure':
            this.inventory.treasures++;
            this.addMessage('Found a treasure!');
            break;
          case 'potion':
            this.inventory.potions++;
            this.addMessage('Found a potion!');
            break;
        }
        
        // Check if we should unlock any doors
        if (item.type === 'key') {
          this.checkUnlockDoors();
        }
      }
    }
  }

  private checkUnlockDoors(): void {
    // Check if we can unlock any doors in the current room
    const room = this.rooms[this.currentRoom];
    
    for (const exit of room.exits) {
      if (exit.locked && this.inventory.keys > 0) {
        exit.locked = false;
        this.inventory.keys--;
        this.addMessage(`Unlocked the door to the ${exit.direction}!`);
        
        // Update the map to show the new exit
        this.map = this.createMapForRoom(this.currentRoom);
      }
    }
  }

  private handleAction(): void {
    // Implement action logic here (e.g., using items, interacting with objects)
    this.addMessage('You look around but see nothing special.');
  }

  private addMessage(message: string): void {
    this.messageQueue.push(message);
    
    if (!this.showingMessage) {
      this.showingMessage = true;
      this.messageTimer = 0;
    }
  }

  private handleMessages(buttonStates: ButtonStates): void {
    // Advance message on button press
    if (buttonStates.a || buttonStates.b) {
      this.messageTimer++;
      
      if (this.messageTimer > 10) { // Debounce
        this.messageQueue.shift();
        this.messageTimer = 0;
        
        if (this.messageQueue.length === 0) {
          this.showingMessage = false;
        }
      }
    }
  }

  private drawMap(ctx: CanvasRenderingContext2D): void {
    for (let y = 0; y < 9; y++) {
      for (let x = 0; x < 10; x++) {
        const tileType = this.map[y][x];
        
        switch (tileType) {
          case 0: // Floor
            ctx.fillStyle = '#333333';
            break;
          case 1: // Wall
            ctx.fillStyle = '#666666';
            break;
          case 2: // Door
            ctx.fillStyle = '#8B4513';
            break;
        }
        
        ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
      }
    }
  }

  private drawItems(ctx: CanvasRenderingContext2D): void {
    for (const item of this.items) {
      if (!item.collected) {
        switch (item.type) {
          case 'key':
            ctx.fillStyle = '#FFD700'; // Gold
            break;
          case 'treasure':
            ctx.fillStyle = '#FF00FF'; // Magenta
            break;
          case 'potion':
            ctx.fillStyle = '#00FF00'; // Green
            break;
        }
        
        const x = item.x * this.tileSize + this.tileSize / 4;
        const y = item.y * this.tileSize + this.tileSize / 4;
        const size = this.tileSize / 2;
        
        ctx.fillRect(x, y, size, size);
      }
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FF0000'; // Red
    
    const x = this.player.x * this.tileSize;
    const y = this.player.y * this.tileSize;
    
    // Draw player body
    ctx.fillRect(x + 4, y + 4, 8, 8);
    
    // Draw direction indicator
    ctx.fillStyle = '#FFFFFF';
    
    switch (this.player.direction) {
      case 'up':
        ctx.fillRect(x + 6, y + 2, 4, 2);
        break;
      case 'right':
        ctx.fillRect(x + 12, y + 6, 2, 4);
        break;
      case 'down':
        ctx.fillRect(x + 6, y + 12, 4, 2);
        break;
      case 'left':
        ctx.fillRect(x + 2, y + 6, 2, 4);
        break;
    }
  }

  private drawUI(ctx: CanvasRenderingContext2D): void {
    // Draw inventory at the bottom
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 144 - 16, 160, 16);
    
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px Arial';
    ctx.fillText(`Room: ${this.rooms[this.currentRoom].name}`, 5, 144 - 5);
    
    // Draw inventory items
    ctx.fillText(`Keys: ${this.inventory.keys}`, 100, 144 - 5);
  }

  private drawMessage(ctx: CanvasRenderingContext2D): void {
    if (this.messageQueue.length === 0) return;
    
    // Draw message box
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(10, 30, 140, 40);
    
    ctx.strokeStyle = '#FFFFFF';
    ctx.strokeRect(10, 30, 140, 40);
    
    // Draw message text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px Arial';
    
    const message = this.messageQueue[0];
    const words = message.split(' ');
    let line = '';
    let y = 42;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > 130 && line !== '') {
        ctx.fillText(line, 15, y);
        line = word + ' ';
        y += 10;
      } else {
        line = testLine;
      }
    }
    
    ctx.fillText(line, 15, y);
    
    // Draw prompt
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillText('Press A to continue', 50, 65);
    }
  }
} 