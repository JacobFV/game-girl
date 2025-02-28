import { Game } from '../Game';
import { GameBoyDevice, ButtonStates } from '../../core/GameBoyDevice';

// Platform game implementation
export class PlatformGame extends Game {
  private player: {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityX: number;
    velocityY: number;
    isJumping: boolean;
  };

  private platforms: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>;

  private coins: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    collected: boolean;
  }>;

  private score: number;
  private gravity: number;
  private screenWidth: number;
  private screenHeight: number;

  constructor() {
    super(
      'Platform Adventure',
      'A classic side-scrolling platformer game',
      'Jump and run through platforms, collect coins, and avoid falling off the screen!',
      'Implements physics system, collision detection, and simple level design'
    );

    this.screenWidth = 160;
    this.screenHeight = 144;
    
    // Initialize player
    this.player = {
      x: 40,
      y: 100,
      width: 10,
      height: 16,
      velocityX: 0,
      velocityY: 0,
      isJumping: false
    };
    
    // Initialize platforms
    this.platforms = [
      { x: 0, y: 130, width: 60, height: 10 },
      { x: 80, y: 110, width: 60, height: 10 },
      { x: 30, y: 90, width: 40, height: 10 },
      { x: 100, y: 70, width: 60, height: 10 },
      { x: 0, y: 50, width: 40, height: 10 },
      { x: 60, y: 30, width: 100, height: 10 }
    ];
    
    // Initialize coins
    this.coins = [
      { x: 20, y: 110, width: 8, height: 8, collected: false },
      { x: 100, y: 90, width: 8, height: 8, collected: false },
      { x: 50, y: 70, width: 8, height: 8, collected: false },
      { x: 120, y: 50, width: 8, height: 8, collected: false },
      { x: 20, y: 30, width: 8, height: 8, collected: false },
      { x: 140, y: 10, width: 8, height: 8, collected: false }
    ];
    
    this.score = 0;
    this.gravity = 0.5;
  }

  protected onInit(device: GameBoyDevice): void {
    console.log('Platform game initialized');
    this.resetGame();
  }

  protected onStep(device: GameBoyDevice): void {
    const ctx = device.getContext();
    const buttonStates = device.getButtonStates();
    
    // Clear the screen
    ctx.fillStyle = '#87CEEB'; // Sky blue background
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    
    // Update player position based on input
    this.handleInput(buttonStates);
    
    // Apply physics
    this.applyPhysics();
    
    // Check collisions
    this.checkCollisions();
    
    // Draw platforms
    this.drawPlatforms(ctx);
    
    // Draw coins
    this.drawCoins(ctx);
    
    // Draw player
    this.drawPlayer(ctx);
    
    // Draw score
    this.drawScore(ctx);
    
    // Check if player fell off the screen
    if (this.player.y > this.screenHeight) {
      this.resetGame();
    }
  }

  private resetGame(): void {
    // Reset player position
    this.player.x = 40;
    this.player.y = 100;
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.player.isJumping = false;
    
    // Reset coins
    this.coins.forEach(coin => {
      coin.collected = false;
    });
    
    // Reset score
    this.score = 0;
  }

  private handleInput(buttonStates: ButtonStates): void {
    // Horizontal movement
    if (buttonStates.left) {
      this.player.velocityX = -2;
    } else if (buttonStates.right) {
      this.player.velocityX = 2;
    } else {
      // Apply friction
      this.player.velocityX *= 0.8;
    }
    
    // Jumping
    if (buttonStates.a && !this.player.isJumping) {
      this.player.velocityY = -8;
      this.player.isJumping = true;
    }
  }

  private applyPhysics(): void {
    // Apply gravity
    this.player.velocityY += this.gravity;
    
    // Update position
    this.player.x += this.player.velocityX;
    this.player.y += this.player.velocityY;
    
    // Screen boundaries
    if (this.player.x < 0) {
      this.player.x = 0;
      this.player.velocityX = 0;
    } else if (this.player.x + this.player.width > this.screenWidth) {
      this.player.x = this.screenWidth - this.player.width;
      this.player.velocityX = 0;
    }
  }

  private checkCollisions(): void {
    // Check platform collisions
    let onPlatform = false;
    
    for (const platform of this.platforms) {
      // Check if player is above the platform and falling
      if (
        this.player.velocityY > 0 &&
        this.player.y + this.player.height <= platform.y &&
        this.player.y + this.player.height + this.player.velocityY >= platform.y &&
        this.player.x + this.player.width > platform.x &&
        this.player.x < platform.x + platform.width
      ) {
        // Land on platform
        this.player.y = platform.y - this.player.height;
        this.player.velocityY = 0;
        this.player.isJumping = false;
        onPlatform = true;
      }
    }
    
    // If not on any platform, player is jumping/falling
    if (!onPlatform) {
      this.player.isJumping = true;
    }
    
    // Check coin collisions
    for (const coin of this.coins) {
      if (
        !coin.collected &&
        this.player.x < coin.x + coin.width &&
        this.player.x + this.player.width > coin.x &&
        this.player.y < coin.y + coin.height &&
        this.player.y + this.player.height > coin.y
      ) {
        coin.collected = true;
        this.score += 10;
      }
    }
  }

  private drawPlatforms(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#8B4513'; // Brown color for platforms
    
    for (const platform of this.platforms) {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    }
  }

  private drawCoins(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FFD700'; // Gold color for coins
    
    for (const coin of this.coins) {
      if (!coin.collected) {
        ctx.beginPath();
        ctx.arc(
          coin.x + coin.width / 2,
          coin.y + coin.height / 2,
          coin.width / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    }
  }

  private drawPlayer(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FF0000'; // Red color for player
    ctx.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );
  }

  private drawScore(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '8px Arial';
    ctx.fillText(`SCORE: ${this.score}`, 5, 10);
  }
} 