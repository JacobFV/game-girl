import { Game } from '../Game';
import { GameBoyDevice } from '../../core/GameBoyDevice';

export class ChatGame extends Game {
  private messages: Array<{text: string; sender: 'user' | 'system'}> = [];
  private currentInput = '';
  private cursorPosition = 0;
  private scrollPosition = 0;
  
  constructor() {
    super(
      'GameChat',
      'A simple chat application',
      'Send and receive messages on your Game Boy',
      'A communication app that demonstrates non-game applications'
    );
  }

  protected onInit(device: GameBoyDevice): void {
    // Add welcome message
    this.messages.push({
      text: 'Welcome to GameChat! Use D-pad to navigate, A to select, B to delete.',
      sender: 'system'
    });
    this.drawChat(device);
  }

  protected onStep(device: GameBoyDevice): void {
    const buttonStates = device.getButtonStates();
    
    // Handle button inputs
    if (buttonStates.a && !this.prevButtonStates?.a) {
      this.handleAButton();
    }
    
    if (buttonStates.b && !this.prevButtonStates?.b) {
      this.handleBButton();
    }
    
    if (buttonStates.start && !this.prevButtonStates?.start) {
      this.handleStartButton();
    }
    
    // Handle D-pad for navigation
    if (buttonStates.up && !this.prevButtonStates?.up) {
      this.scrollUp();
    } else if (buttonStates.down && !this.prevButtonStates?.down) {
      this.scrollDown();
    } else if (buttonStates.left && !this.prevButtonStates?.left) {
      this.moveCursorLeft();
    } else if (buttonStates.right && !this.prevButtonStates?.right) {
      this.moveCursorRight();
    }
    
    // Draw the chat interface
    this.drawChat(device);
    
    // Update previous button states
    this.prevButtonStates = { ...buttonStates };
  }

  private prevButtonStates: Record<string, boolean> | null = null;
  private keyboardLayout = [
    ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'],
    ['k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't'],
    ['u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3'],
    ['4', '5', '6', '7', '8', '9', '.', ',', '!', '?'],
    ['SPACE', 'SEND']
  ];
  private selectedRow = 0;
  private selectedCol = 0;

  private handleAButton(): void {
    // If on the keyboard
    if (this.selectedRow < this.keyboardLayout.length) {
      const row = this.keyboardLayout[this.selectedRow];
      if (this.selectedCol < row.length) {
        const key = row[this.selectedCol];
        
        if (key === 'SPACE') {
          this.addCharacter(' ');
        } else if (key === 'SEND') {
          this.sendMessage();
        } else {
          this.addCharacter(key);
        }
      }
    }
  }

  private handleBButton(): void {
    // Delete character before cursor
    if (this.cursorPosition > 0) {
      this.currentInput = 
        this.currentInput.substring(0, this.cursorPosition - 1) + 
        this.currentInput.substring(this.cursorPosition);
      this.cursorPosition--;
    }
  }

  private handleStartButton(): void {
    // Toggle between keyboard and message view
    this.sendMessage();
  }

  private addCharacter(char: string): void {
    // Insert character at cursor position
    this.currentInput = 
      this.currentInput.substring(0, this.cursorPosition) + 
      char + 
      this.currentInput.substring(this.cursorPosition);
    this.cursorPosition++;
  }

  private sendMessage(): void {
    if (this.currentInput.trim()) {
      // Add user message
      this.messages.push({
        text: this.currentInput,
        sender: 'user'
      });
      
      // Simulate a response
      setTimeout(() => {
        this.messages.push({
          text: this.getAutoResponse(this.currentInput),
          sender: 'system'
        });
        // Auto-scroll to the bottom
        this.scrollPosition = Math.max(0, this.messages.length - 4);
      }, 1000);
      
      // Clear input
      this.currentInput = '';
      this.cursorPosition = 0;
    }
  }

  private getAutoResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello there! How can I help you today?';
    } else if (lowerMessage.includes('how are you')) {
      return 'I\'m just a Game Boy program, but I\'m running well, thanks!';
    } else if (lowerMessage.includes('game') || lowerMessage.includes('play')) {
      return 'I have several games available. Try the platform game or adventure game!';
    } else if (lowerMessage.includes('help')) {
      return 'Use the D-pad to navigate, A to select, B to delete, and START to send messages.';
    } else {
      return 'Interesting message! What else would you like to chat about?';
    }
  }

  private moveCursorLeft(): void {
    if (this.selectedRow < this.keyboardLayout.length) {
      // On keyboard
      if (this.selectedCol > 0) {
        this.selectedCol--;
      } else {
        this.selectedCol = this.keyboardLayout[this.selectedRow].length - 1;
      }
    } else {
      // In text input
      if (this.cursorPosition > 0) {
        this.cursorPosition--;
      }
    }
  }

  private moveCursorRight(): void {
    if (this.selectedRow < this.keyboardLayout.length) {
      // On keyboard
      const maxCol = this.keyboardLayout[this.selectedRow].length - 1;
      if (this.selectedCol < maxCol) {
        this.selectedCol++;
      } else {
        this.selectedCol = 0;
      }
    } else {
      // In text input
      if (this.cursorPosition < this.currentInput.length) {
        this.cursorPosition++;
      }
    }
  }

  private scrollUp(): void {
    if (this.selectedRow > 0) {
      this.selectedRow--;
      // Adjust column if needed
      const maxCol = this.keyboardLayout[this.selectedRow].length - 1;
      if (this.selectedCol > maxCol) {
        this.selectedCol = maxCol;
      }
    } else if (this.scrollPosition > 0) {
      this.scrollPosition--;
    }
  }

  private scrollDown(): void {
    if (this.selectedRow < this.keyboardLayout.length - 1) {
      this.selectedRow++;
      // Adjust column if needed
      const maxCol = this.keyboardLayout[this.selectedRow].length - 1;
      if (this.selectedCol > maxCol) {
        this.selectedCol = maxCol;
      }
    } else if (this.scrollPosition < Math.max(0, this.messages.length - 4)) {
      this.scrollPosition++;
    }
  }

  private drawChat(device: GameBoyDevice): void {
    const ctx = device.getContext();
    if (!ctx) return;
    
    // Clear screen
    ctx.fillStyle = '#9bbc0f';
    ctx.fillRect(0, 0, 160, 144);
    
    // Draw message area
    ctx.fillStyle = '#0f380f';
    ctx.fillRect(5, 5, 150, 70);
    
    // Draw messages
    ctx.fillStyle = '#9bbc0f';
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    
    const visibleMessages = this.messages.slice(
      this.scrollPosition, 
      this.scrollPosition + 4
    );
    
    visibleMessages.forEach((message, index) => {
      const prefix = message.sender === 'user' ? 'You: ' : 'GB: ';
      const fullText = prefix + message.text;
      
      // Split long messages
      const maxChars = 18;
      for (let i = 0; i < fullText.length; i += maxChars) {
        const line = fullText.substring(i, i + maxChars);
        const yPos = 15 + index * 16 + Math.floor(i / maxChars) * 8;
        
        if (yPos < 70) {
          ctx.fillText(line, 10, yPos);
        }
      }
    });
    
    // Draw input area
    ctx.fillStyle = '#306230';
    ctx.fillRect(5, 80, 150, 15);
    
    // Draw input text
    ctx.fillStyle = '#9bbc0f';
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(this.currentInput, 10, 90);
    
    // Draw cursor
    const cursorX = 10 + this.getCursorXPosition();
    ctx.fillRect(cursorX, 82, 1, 10);
    
    // Draw keyboard
    this.keyboardLayout.forEach((row, rowIndex) => {
      row.forEach((key, colIndex) => {
        const keyX = 5 + colIndex * 15;
        const keyY = 100 + rowIndex * 9;
        
        // Draw key background
        const isSelected = rowIndex === this.selectedRow && colIndex === this.selectedCol;
        ctx.fillStyle = isSelected ? '#0f380f' : '#306230';
        
        // Special case for wider keys
        if (key === 'SPACE' || key === 'SEND') {
          ctx.fillRect(keyX, keyY, 30, 8);
        } else {
          ctx.fillRect(keyX, keyY, 14, 8);
        }
        
        // Draw key text
        ctx.fillStyle = '#9bbc0f';
        ctx.font = '7px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(key, keyX + (key === 'SPACE' || key === 'SEND' ? 15 : 7), keyY + 6);
      });
    });
  }

  private getCursorXPosition(): number {
    // Calculate cursor X position based on monospace font
    return this.currentInput.substring(0, this.cursorPosition).length * 5;
  }
} 