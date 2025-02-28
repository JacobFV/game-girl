import { GameBoyDevice } from '../core/GameBoyDevice';

// Base Game class that all games will extend
export abstract class Game {
  protected title: string;
  protected description: string;
  protected playerFacingDescription: string;
  protected developerFacingDescription: string;
  protected initialized: boolean = false;
  protected id: string;

  constructor(
    title: string,
    description: string,
    playerFacingDescription: string,
    developerFacingDescription: string
  ) {
    this.title = title;
    this.description = description;
    this.playerFacingDescription = playerFacingDescription;
    this.developerFacingDescription = developerFacingDescription;
    this.id = `game-${title.toLowerCase().replace(/\s+/g, '-')}`;
  }

  // Initialize the game with the device
  public init(device: GameBoyDevice): void {
    this.initialized = true;
    this.onInit(device);
  }

  // Game step function called by the device at its update rate
  public step(device: GameBoyDevice): void {
    if (!this.initialized) {
      this.init(device);
    }
    this.onStep(device);
  }

  // Get the game title
  public getTitle(): string {
    return this.title;
  }

  // Get the game description
  public getDescription(): string {
    return this.description;
  }

  // Get the player-facing description
  public getPlayerFacingDescription(): string {
    return this.playerFacingDescription;
  }

  // Get the developer-facing description
  public getDeveloperFacingDescription(): string {
    return this.developerFacingDescription;
  }

  // Get the unique identifier for the game
  public getId(): string {
    return this.id;
  }

  // Abstract methods that must be implemented by game subclasses
  protected abstract onInit(device: GameBoyDevice): void;
  protected abstract onStep(device: GameBoyDevice): void;
} 