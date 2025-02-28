import { Game } from '../Game';
import { GameBoyDevice, ButtonStates } from '../../core/GameBoyDevice';

// Calculator utility game
export class Calculator extends Game {
  private display: string = '0';
  private firstOperand: number | null = null;
  private operator: string | null = null;
  private waitingForSecondOperand: boolean = false;
  private lastKey: string | null = null;
  private lastKeyTime: number = 0;
  
  // Calculator button layout
  private buttons: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    value: string;
    type: 'digit' | 'operator' | 'function';
  }>;
  
  // Selected button index
  private selectedButtonIndex: number = 0;
  
  // Screen dimensions
  private screenWidth: number = 160;
  private screenHeight: number = 144;

  constructor() {
    super(
      'Calculator',
      'A simple calculator utility',
      'Perform basic arithmetic operations with this handy calculator.',
      'Implements expression parsing, calculation logic, and display formatting.'
    );
    
    // Initialize calculator buttons
    this.buttons = [
      // First row
      { x: 20, y: 40, width: 25, height: 20, value: 'C', type: 'function' },
      { x: 50, y: 40, width: 25, height: 20, value: '±', type: 'function' },
      { x: 80, y: 40, width: 25, height: 20, value: '%', type: 'operator' },
      { x: 110, y: 40, width: 25, height: 20, value: '÷', type: 'operator' },
      
      // Second row
      { x: 20, y: 65, width: 25, height: 20, value: '7', type: 'digit' },
      { x: 50, y: 65, width: 25, height: 20, value: '8', type: 'digit' },
      { x: 80, y: 65, width: 25, height: 20, value: '9', type: 'digit' },
      { x: 110, y: 65, width: 25, height: 20, value: '×', type: 'operator' },
      
      // Third row
      { x: 20, y: 90, width: 25, height: 20, value: '4', type: 'digit' },
      { x: 50, y: 90, width: 25, height: 20, value: '5', type: 'digit' },
      { x: 80, y: 90, width: 25, height: 20, value: '6', type: 'digit' },
      { x: 110, y: 90, width: 25, height: 20, value: '-', type: 'operator' },
      
      // Fourth row
      { x: 20, y: 115, width: 25, height: 20, value: '1', type: 'digit' },
      { x: 50, y: 115, width: 25, height: 20, value: '2', type: 'digit' },
      { x: 80, y: 115, width: 25, height: 20, value: '3', type: 'digit' },
      { x: 110, y: 115, width: 25, height: 20, value: '+', type: 'operator' },
      
      // Fifth row
      { x: 20, y: 140, width: 55, height: 20, value: '0', type: 'digit' },
      { x: 80, y: 140, width: 25, height: 20, value: '.', type: 'digit' },
      { x: 110, y: 140, width: 25, height: 20, value: '=', type: 'function' }
    ];
  }

  protected onInit(device: GameBoyDevice): void {
    console.log('Calculator initialized');
    this.resetCalculator();
  }

  protected onStep(device: GameBoyDevice): void {
    const ctx = device.getContext();
    const buttonStates = device.getButtonStates();
    
    // Clear the screen
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    
    // Handle input
    this.handleInput(buttonStates);
    
    // Draw calculator
    this.drawCalculator(ctx);
  }

  private resetCalculator(): void {
    this.display = '0';
    this.firstOperand = null;
    this.operator = null;
    this.waitingForSecondOperand = false;
  }

  private handleInput(buttonStates: ButtonStates): void {
    const now = Date.now();
    const debounceTime = 200; // ms
    
    // Debounce input
    if (now - this.lastKeyTime < debounceTime) {
      return;
    }
    
    // Navigation
    if (buttonStates.up && this.selectedButtonIndex >= 4) {
      this.selectedButtonIndex -= 4;
      this.lastKeyTime = now;
      this.lastKey = 'up';
    } else if (buttonStates.down && this.selectedButtonIndex < this.buttons.length - 4) {
      this.selectedButtonIndex += 4;
      this.lastKeyTime = now;
      this.lastKey = 'down';
    } else if (buttonStates.left && this.selectedButtonIndex % 4 !== 0) {
      this.selectedButtonIndex--;
      this.lastKeyTime = now;
      this.lastKey = 'left';
    } else if (buttonStates.right && this.selectedButtonIndex % 4 !== 3 && this.selectedButtonIndex !== this.buttons.length - 1) {
      this.selectedButtonIndex++;
      this.lastKeyTime = now;
      this.lastKey = 'right';
    }
    
    // Button press
    if (buttonStates.a && this.lastKey !== 'a') {
      const button = this.buttons[this.selectedButtonIndex];
      this.handleButtonPress(button.value);
      this.lastKeyTime = now;
      this.lastKey = 'a';
    } else if (!buttonStates.a && this.lastKey === 'a') {
      this.lastKey = null;
    }
    
    // Reset calculator
    if (buttonStates.b && this.lastKey !== 'b') {
      this.resetCalculator();
      this.lastKeyTime = now;
      this.lastKey = 'b';
    } else if (!buttonStates.b && this.lastKey === 'b') {
      this.lastKey = null;
    }
  }

  private handleButtonPress(value: string): void {
    switch (value) {
      case 'C':
        this.resetCalculator();
        break;
      case '±':
        this.display = (parseFloat(this.display) * -1).toString();
        break;
      case '%':
        this.display = (parseFloat(this.display) / 100).toString();
        break;
      case '=':
        this.performCalculation();
        this.operator = null;
        this.waitingForSecondOperand = false;
        break;
      case '+':
      case '-':
      case '×':
      case '÷':
        this.handleOperator(value);
        break;
      case '.':
        this.handleDecimal();
        break;
      default:
        this.handleDigit(value);
        break;
    }
  }

  private handleDigit(digit: string): void {
    if (this.waitingForSecondOperand) {
      this.display = digit;
      this.waitingForSecondOperand = false;
    } else {
      this.display = this.display === '0' ? digit : this.display + digit;
    }
  }

  private handleDecimal(): void {
    if (this.waitingForSecondOperand) {
      this.display = '0.';
      this.waitingForSecondOperand = false;
      return;
    }
    
    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  private handleOperator(nextOperator: string): void {
    const inputValue = parseFloat(this.display);
    
    if (this.firstOperand === null) {
      this.firstOperand = inputValue;
    } else if (this.operator) {
      const result = this.calculate(this.firstOperand, inputValue, this.operator);
      this.display = result.toString();
      this.firstOperand = result;
    }
    
    this.waitingForSecondOperand = true;
    this.operator = nextOperator;
  }

  private performCalculation(): void {
    if (this.firstOperand === null || this.operator === null) {
      return;
    }
    
    const inputValue = parseFloat(this.display);
    const result = this.calculate(this.firstOperand, inputValue, this.operator);
    
    this.display = result.toString();
    this.firstOperand = result;
  }

  private calculate(firstOperand: number, secondOperand: number, operator: string): number {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        return secondOperand !== 0 ? firstOperand / secondOperand : NaN;
      default:
        return secondOperand;
    }
  }

  private drawCalculator(ctx: CanvasRenderingContext2D): void {
    // Draw display
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(20, 10, 120, 25);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 10, 120, 25);
    
    // Draw display text
    ctx.fillStyle = '#000000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    
    // Truncate display if too long
    let displayText = this.display;
    if (displayText.length > 10) {
      const num = parseFloat(displayText);
      if (!isNaN(num)) {
        displayText = num.toExponential(5);
      } else {
        displayText = displayText.substring(0, 10);
      }
    }
    
    ctx.fillText(displayText, 135, 28);
    
    // Draw buttons
    for (let i = 0; i < this.buttons.length; i++) {
      const button = this.buttons[i];
      
      // Button background
      if (i === this.selectedButtonIndex) {
        ctx.fillStyle = '#4caf50'; // Highlight selected button
      } else {
        switch (button.type) {
          case 'digit':
            ctx.fillStyle = '#e0e0e0';
            break;
          case 'operator':
            ctx.fillStyle = '#ffcc80';
            break;
          case 'function':
            ctx.fillStyle = '#90caf9';
            break;
        }
      }
      
      ctx.fillRect(button.x, button.y, button.width, button.height);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(button.x, button.y, button.width, button.height);
      
      // Button text
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(button.value, button.x + button.width / 2, button.y + button.height / 2 + 4);
    }
    
    // Draw instructions
    ctx.fillStyle = '#666666';
    ctx.font = '8px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('D-Pad: Navigate', 20, this.screenHeight - 5);
    ctx.fillText('A: Select', 80, this.screenHeight - 5);
    ctx.fillText('B: Clear', 120, this.screenHeight - 5);
  }
} 