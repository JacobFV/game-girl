import { Game } from '../Game';
import { GameBoyDevice, ButtonStates } from '../../core/GameBoyDevice';

// AI Chat game implementation
export class ChatGame extends Game {
  private conversation: Array<{
    speaker: 'user' | 'ai';
    message: string;
  }>;
  
  private currentInput: string = '';
  private cursorPosition: number = 0;
  private scrollPosition: number = 0;
  
  private readonly characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,?!-_';
  private selectedCharIndex: number = 0;
  
  private inputMode: 'keyboard' | 'message' = 'message';
  private showKeyboard: boolean = false;
  
  private aiPersonality: string;
  private aiName: string;
  
  private screenWidth: number = 160;
  private screenHeight: number = 144;
  
  private lastKey: string | null = null;
  private lastKeyTime: number = 0;
  private keyRepeatDelay: number = 200;

  constructor() {
    super(
      'AI Chat Companion',
      'Chat with a simple AI character',
      'Have a conversation with a friendly AI character that responds to your messages and remembers your conversation history.',
      'Implements pattern matching responses, conversation state tracking, and character personality traits.'
    );
    
    // Initialize conversation
    this.conversation = [];
    
    // Choose a random AI personality
    const personalities = [
      { name: 'ELIZA', personality: 'a helpful therapist' },
      { name: 'HAL', personality: 'a logical and calm assistant' },
      { name: 'GAIA', personality: 'a nature-loving guide' },
      { name: 'NOVA', personality: 'a curious space explorer' },
      { name: 'PIXEL', personality: 'a playful game enthusiast' }
    ];
    
    const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];
    this.aiName = randomPersonality.name;
    this.aiPersonality = randomPersonality.personality;
  }

  protected onInit(device: GameBoyDevice): void {
    console.log('Chat game initialized');
    
    // Add initial greeting
    this.addAIMessage(`Hello! I'm ${this.aiName}, ${this.aiPersonality}. What would you like to talk about today?`);
  }

  protected onStep(device: GameBoyDevice): void {
    const ctx = device.getContext();
    const buttonStates = device.getButtonStates();
    
    // Clear the screen
    ctx.fillStyle = '#f0f8ff'; // Light blue background
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    
    // Handle input
    this.handleInput(buttonStates);
    
    // Draw conversation
    this.drawConversation(ctx);
    
    // Draw input area
    this.drawInputArea(ctx);
    
    // Draw keyboard if visible
    if (this.showKeyboard) {
      this.drawKeyboard(ctx);
    }
  }

  private handleInput(buttonStates: ButtonStates): void {
    const now = Date.now();
    
    // Debounce or handle key repeat
    if (this.lastKey !== null && now - this.lastKeyTime < this.keyRepeatDelay) {
      return;
    }
    
    if (this.inputMode === 'message') {
      // Message mode controls
      if (buttonStates.up) {
        this.scrollPosition = Math.max(0, this.scrollPosition - 1);
        this.lastKey = 'up';
        this.lastKeyTime = now;
      } else if (buttonStates.down) {
        this.scrollPosition++;
        this.lastKey = 'down';
        this.lastKeyTime = now;
      } else if (buttonStates.a) {
        this.showKeyboard = true;
        this.inputMode = 'keyboard';
        this.lastKey = 'a';
        this.lastKeyTime = now;
      } else if (buttonStates.b && this.currentInput.length > 0) {
        this.sendMessage();
        this.lastKey = 'b';
        this.lastKeyTime = now;
      } else {
        this.lastKey = null;
      }
    } else if (this.inputMode === 'keyboard') {
      // Keyboard mode controls
      if (buttonStates.up) {
        this.selectedCharIndex = (this.selectedCharIndex - 10 + this.characters.length) % this.characters.length;
        this.lastKey = 'up';
        this.lastKeyTime = now;
      } else if (buttonStates.down) {
        this.selectedCharIndex = (this.selectedCharIndex + 10) % this.characters.length;
        this.lastKey = 'down';
        this.lastKeyTime = now;
      } else if (buttonStates.left) {
        this.selectedCharIndex = (this.selectedCharIndex - 1 + this.characters.length) % this.characters.length;
        this.lastKey = 'left';
        this.lastKeyTime = now;
      } else if (buttonStates.right) {
        this.selectedCharIndex = (this.selectedCharIndex + 1) % this.characters.length;
        this.lastKey = 'right';
        this.lastKeyTime = now;
      } else if (buttonStates.a) {
        // Add selected character to input
        const char = this.characters[this.selectedCharIndex];
        this.currentInput = this.currentInput.substring(0, this.cursorPosition) + char + this.currentInput.substring(this.cursorPosition);
        this.cursorPosition++;
        this.lastKey = 'a';
        this.lastKeyTime = now;
      } else if (buttonStates.b) {
        if (this.currentInput.length > 0 && this.cursorPosition > 0) {
          // Delete character before cursor
          this.currentInput = this.currentInput.substring(0, this.cursorPosition - 1) + this.currentInput.substring(this.cursorPosition);
          this.cursorPosition--;
        } else {
          // Exit keyboard mode if input is empty
          this.showKeyboard = false;
          this.inputMode = 'message';
        }
        this.lastKey = 'b';
        this.lastKeyTime = now;
      } else if (buttonStates.start) {
        this.sendMessage();
        this.lastKey = 'start';
        this.lastKeyTime = now;
      } else if (buttonStates.select) {
        this.showKeyboard = false;
        this.inputMode = 'message';
        this.lastKey = 'select';
        this.lastKeyTime = now;
      } else {
        this.lastKey = null;
      }
    }
  }

  private sendMessage(): void {
    if (this.currentInput.trim() === '') return;
    
    // Add user message to conversation
    this.addUserMessage(this.currentInput);
    
    // Generate AI response
    this.generateAIResponse(this.currentInput);
    
    // Clear input
    this.currentInput = '';
    this.cursorPosition = 0;
    this.showKeyboard = false;
    this.inputMode = 'message';
    
    // Scroll to bottom
    this.scrollToBottom();
  }

  private addUserMessage(message: string): void {
    this.conversation.push({
      speaker: 'user',
      message
    });
  }

  private addAIMessage(message: string): void {
    this.conversation.push({
      speaker: 'ai',
      message
    });
    
    // Scroll to bottom when AI responds
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    // Calculate how many messages can fit on screen and set scroll position
    this.scrollPosition = Math.max(0, this.conversation.length - 4);
  }

  private generateAIResponse(userMessage: string): void {
    // Simple pattern matching for responses
    const userMessageLower = userMessage.toLowerCase();
    
    // Greeting patterns
    if (userMessageLower.includes('hello') || userMessageLower.includes('hi') || userMessageLower.includes('hey')) {
      this.addAIMessage(`Hello there! How are you feeling today?`);
      return;
    }
    
    // Questions about the AI
    if (userMessageLower.includes('who are you') || userMessageLower.includes('your name')) {
      this.addAIMessage(`I'm ${this.aiName}, ${this.aiPersonality}. I'm here to chat with you!`);
      return;
    }
    
    // Questions about feelings
    if (userMessageLower.includes('how are you') || userMessageLower.includes('feeling')) {
      this.addAIMessage(`I'm doing well, thank you for asking! I enjoy our conversations.`);
      return;
    }
    
    // Questions about capabilities
    if (userMessageLower.includes('what can you do') || userMessageLower.includes('help me')) {
      this.addAIMessage(`I can chat with you about various topics, answer simple questions, or just keep you company!`);
      return;
    }
    
    // Goodbye patterns
    if (userMessageLower.includes('bye') || userMessageLower.includes('goodbye') || userMessageLower.includes('see you')) {
      this.addAIMessage(`Goodbye! Feel free to chat again anytime.`);
      return;
    }
    
    // Thank you patterns
    if (userMessageLower.includes('thank') || userMessageLower.includes('thanks')) {
      this.addAIMessage(`You're welcome! I'm happy to help.`);
      return;
    }
    
    // Default responses if no pattern matches
    const defaultResponses = [
      `That's interesting! Tell me more about that.`,
      `I see. What are your thoughts on this?`,
      `Hmm, I'm not sure I fully understand. Could you explain more?`,
      `That's a good point. What else is on your mind?`,
      `I'd like to hear more about that.`,
      `As ${this.aiPersonality}, I find that fascinating!`
    ];
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    this.addAIMessage(randomResponse);
  }

  private drawConversation(ctx: CanvasRenderingContext2D): void {
    const messageAreaHeight = 100;
    const messageSpacing = 5;
    const textPadding = 5;
    
    ctx.font = '8px Arial';
    
    // Draw conversation area background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, 5, this.screenWidth - 10, messageAreaHeight);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(5, 5, this.screenWidth - 10, messageAreaHeight);
    
    // Draw messages
    let y = 10;
    
    for (let i = this.scrollPosition; i < this.conversation.length; i++) {
      const message = this.conversation[i];
      const isAI = message.speaker === 'ai';
      
      // Measure text to wrap it
      const maxWidth = this.screenWidth - 30;
      const words = message.message.split(' ');
      let line = '';
      const lines: string[] = [];
      
      for (const word of words) {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
          lines.push(line);
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      
      if (line !== '') {
        lines.push(line);
      }
      
      // Draw message bubble
      const bubbleHeight = lines.length * 10 + textPadding * 2;
      const bubbleWidth = maxWidth;
      const bubbleX = isAI ? 10 : this.screenWidth - bubbleWidth - 10;
      
      ctx.fillStyle = isAI ? '#e3f2fd' : '#e8f5e9';
      ctx.fillRect(bubbleX, y, bubbleWidth, bubbleHeight);
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(bubbleX, y, bubbleWidth, bubbleHeight);
      
      // Draw speaker name
      ctx.fillStyle = '#000000';
      ctx.fillText(isAI ? this.aiName : 'YOU', bubbleX + textPadding, y + 10);
      
      // Draw message text
      for (let j = 0; j < lines.length; j++) {
        ctx.fillText(lines[j], bubbleX + textPadding, y + 20 + j * 10);
      }
      
      // Move to next message position
      y += bubbleHeight + messageSpacing;
      
      // Stop if we've reached the bottom of the message area
      if (y > messageAreaHeight) {
        break;
      }
    }
    
    // Draw scroll indicators if needed
    if (this.scrollPosition > 0) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(this.screenWidth / 2 - 5, 10);
      ctx.lineTo(this.screenWidth / 2, 5);
      ctx.lineTo(this.screenWidth / 2 + 5, 10);
      ctx.fill();
    }
    
    if (this.scrollPosition < this.conversation.length - 4) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(this.screenWidth / 2 - 5, messageAreaHeight);
      ctx.lineTo(this.screenWidth / 2, messageAreaHeight + 5);
      ctx.lineTo(this.screenWidth / 2 + 5, messageAreaHeight);
      ctx.fill();
    }
  }

  private drawInputArea(ctx: CanvasRenderingContext2D): void {
    const inputAreaY = 110;
    const inputAreaHeight = 25;
    
    // Draw input area background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, inputAreaY, this.screenWidth - 10, inputAreaHeight);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(5, inputAreaY, this.screenWidth - 10, inputAreaHeight);
    
    // Draw input text
    ctx.fillStyle = '#000000';
    ctx.font = '8px Arial';
    
    // Handle text that's too long
    let displayText = this.currentInput;
    const maxWidth = this.screenWidth - 20;
    const metrics = ctx.measureText(displayText);
    
    if (metrics.width > maxWidth) {
      // Show text around cursor
      const cursorPos = this.cursorPosition;
      let startPos = 0;
      let endPos = displayText.length;
      
      // Find a substring that fits and includes the cursor
      while (startPos < cursorPos && ctx.measureText(displayText.substring(startPos, endPos)).width > maxWidth) {
        startPos++;
      }
      
      while (endPos > cursorPos && ctx.measureText(displayText.substring(startPos, endPos)).width > maxWidth) {
        endPos--;
      }
      
      displayText = displayText.substring(startPos, endPos);
    }
    
    ctx.fillText(displayText, 10, inputAreaY + 15);
    
    // Draw cursor
    if (this.inputMode === 'keyboard' && Math.floor(Date.now() / 500) % 2 === 0) {
      const cursorX = 10 + ctx.measureText(displayText.substring(0, this.cursorPosition)).width;
      ctx.fillRect(cursorX, inputAreaY + 5, 1, 15);
    }
    
    // Draw instructions
    ctx.fillStyle = '#666666';
    ctx.font = '7px Arial';
    ctx.fillText('A: Type  B: Send', 10, inputAreaY + inputAreaHeight + 10);
  }

  private drawKeyboard(ctx: CanvasRenderingContext2D): void {
    const keyboardY = 50;
    const keySize = 12;
    const keysPerRow = 10;
    const keySpacing = 2;
    const keyboardWidth = keysPerRow * (keySize + keySpacing) - keySpacing;
    const keyboardHeight = Math.ceil(this.characters.length / keysPerRow) * (keySize + keySpacing) - keySpacing;
    const keyboardX = (this.screenWidth - keyboardWidth) / 2;
    
    // Draw keyboard background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.screenWidth, this.screenHeight);
    
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(keyboardX - 5, keyboardY - 5, keyboardWidth + 10, keyboardHeight + 10);
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(keyboardX - 5, keyboardY - 5, keyboardWidth + 10, keyboardHeight + 10);
    
    // Draw keys
    ctx.font = '8px Arial';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < this.characters.length; i++) {
      const row = Math.floor(i / keysPerRow);
      const col = i % keysPerRow;
      const x = keyboardX + col * (keySize + keySpacing);
      const y = keyboardY + row * (keySize + keySpacing);
      
      // Draw key background
      ctx.fillStyle = i === this.selectedCharIndex ? '#4caf50' : '#ffffff';
      ctx.fillRect(x, y, keySize, keySize);
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(x, y, keySize, keySize);
      
      // Draw key character
      ctx.fillStyle = '#000000';
      ctx.fillText(this.characters[i], x + keySize / 2, y + keySize / 2 + 3);
    }
    
    // Draw keyboard instructions
    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '7px Arial';
    ctx.fillText('A: Select  B: Delete  START: Send  SELECT: Close', 10, this.screenHeight - 5);
  }
} 