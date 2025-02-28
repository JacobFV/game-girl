import { Game } from '../Game';
import { GameBoyDevice } from '../../core/GameBoyDevice';

export class CalculatorGame extends Game {
  private display: string = '0';
  private firstOperand: number | null = null;
  private operator: string | null = null;
  private waitingForSecondOperand: boolean = false;

  constructor() {
    super(
      'Calculator Utility',
      'A simple calculator for your Game Boy',
      'Perform basic calculations on your Game Boy',
      'A utility app that demonstrates non-game applications'
    );
  }

  protected onInit(device: GameBoyDevice): void {
    this.resetCalculator();
    this.drawCalculator(device);
  }

  protected onStep(device: GameBoyDevice): void {
    const buttonStates = device.getButtonStates();
    
    // Handle number inputs (D-pad for navigation, A for select)
    if (buttonStates.a && !this.prevButtonStates?.a) {
      const cursorPosition = this.getCursorPosition();
      if (cursorPosition >= 0 && cursorPosition <= 9) {
        this.inputDigit(cursorPosition);
      } else if (cursorPosition === 10) { // Clear
        this.resetCalculator();
      } else if (cursorPosition === 11) { // Add
        this.handleOperator('+');
      } else if (cursorPosition === 12) { // Subtract
        this.handleOperator('-');
      } else if (cursorPosition === 13) { // Multiply
        this.handleOperator('*');
      } else if (cursorPosition === 14) { // Divide
        this.handleOperator('/');
      } else if (cursorPosition === 15) { // Equals
        this.handleEquals();
      }
    }
    
    // Update cursor position with D-pad
    if (buttonStates.up && !this.prevButtonStates?.up) {
      this.moveCursor('up');
    } else if (buttonStates.down && !this.prevButtonStates?.down) {
      this.moveCursor('down');
    } else if (buttonStates.left && !this.prevButtonStates?.left) {
      this.moveCursor('left');
    } else if (buttonStates.right && !this.prevButtonStates?.right) {
      this.moveCursor('right');
    }
    
    // Draw the calculator
    this.drawCalculator(device);
    
    // Update previous button states
    this.prevButtonStates = { ...buttonStates };
  }

  private cursorX: number = 0;
  private cursorY: number = 0;
  private prevButtonStates: Record<string, boolean> | null = null;

  private getCursorPosition(): number {
    // Convert 2D cursor position to button index
    return this.cursorY * 4 + this.cursorX;
  }

  private moveCursor(direction: 'up' | 'down' | 'left' | 'right'): void {
    switch (direction) {
      case 'up':
        this.cursorY = (this.cursorY - 1 + 4) % 4;
        break;
      case 'down':
        this.cursorY = (this.cursorY + 1) % 4;
        break;
      case 'left':
        this.cursorX = (this.cursorX - 1 + 4) % 4;
        break;
      case 'right':
        this.cursorX = (this.cursorX + 1) % 4;
        break;
    }
  }

  private resetCalculator(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }

  private inputDigit(digit: number): void {
    if (this.waitingForSecondOperand) {
      this.display = String(digit);
      this.waitingForSecondOperand = false;
    } else {
      this.display = this.display === '0' ? String(digit) : this.display + digit;
    }
  }

  private handleOperator(nextOperator: string): void {
    const inputValue = parseFloat(this.display);
    
    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.performCalculation(this.operator, this.firstOperand, inputValue);
      this.display = String(result);
      this.firstOperand = result;
    }
    
    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
  }

  private handleEquals(): void {
    if (!this.operator || this.firstOperand === null) return;
    
    const inputValue = parseFloat(this.display);
    const result = this.performCalculation(this.operator, this.firstOperand, inputValue);
    
    this.display = String(result);
    this.firstOperand = result;
    this.operator = null;
    this.waitingForSecondOperand = true;
  }

  private performCalculation(operator: string, firstOperand: number, secondOperand: number): number {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }

  private drawCalculator(device: GameBoyDevice): void {
    const ctx = device.getContext();
    if (!ctx) return;
    
    // Clear screen
    ctx.fillStyle = '#9bbc0f';
    ctx.fillRect(0, 0, 160, 144);
    
    // Draw display
    ctx.fillStyle = '#0f380f';
    ctx.fillRect(10, 10, 140, 30);
    
    // Draw display text
    ctx.fillStyle = '#9bbc0f';
    ctx.font = '16px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(this.display.substring(0, 10), 140, 30);
    
    // Draw buttons
    const buttons = [
      '7', '8', '9', '÷',
      '4', '5', '6', '×',
      '1', '2', '3', '-',
      'C', '0', '=', '+'
    ];
    
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const index = y * 4 + x;
        const buttonX = 10 + x * 37;
        const buttonY = 50 + y * 22;
        
        // Draw button background
        ctx.fillStyle = this.cursorX === x && this.cursorY === y ? '#0f380f' : '#306230';
        ctx.fillRect(buttonX, buttonY, 32, 18);
        
        // Draw button text
        ctx.fillStyle = '#9bbc0f';
        ctx.font = '14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(buttons[index], buttonX + 16, buttonY + 14);
      }
    }
    
    // Draw operation indicator
    if (this.operator) {
      ctx.fillStyle = '#0f380f';
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`Op: ${this.operator}`, 10, 140);
    }
  }
} 