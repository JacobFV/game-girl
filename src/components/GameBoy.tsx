import React, { useEffect, useRef, useState } from 'react';
import { GameBoyDevice } from '../core/GameBoyDevice';
import { Game } from '../games/Game';
import '../styles/GameBoy.css';

interface GameBoyProps {
  id: string;
  onRemove: (id: string) => void;
  onDrop?: (game: Game) => void;
  initialPosition?: { x: number; y: number };
}

const GameBoy: React.FC<GameBoyProps> = ({ 
  id, 
  onRemove, 
  onDrop,
  initialPosition = { x: 100, y: 100 }
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [device, setDevice] = useState<GameBoyDevice | null>(null);
  const [isOn, setIsOn] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [buttonStates, setButtonStates] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    a: false,
    b: false,
    start: false,
    select: false
  });
  
  // Dragging state
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const gameboyRef = useRef<HTMLDivElement>(null);

  // Initialize the device when the component mounts
  useEffect(() => {
    if (canvasRef.current) {
      const newDevice = new GameBoyDevice(id, canvasRef.current);
      setDevice(newDevice);
    }
  }, [id]);

  // Update the device when button states change
  useEffect(() => {
    if (device) {
      for (const [button, isPressed] of Object.entries(buttonStates)) {
        device.setButtonState(button as keyof typeof buttonStates, isPressed);
      }
    }
  }, [buttonStates, device]);

  // Handle power button click
  const handlePowerClick = () => {
    if (!device) return;
    
    if (isOn) {
      device.turnOff();
    } else {
      device.turnOn();
    }
    
    setIsOn(!isOn);
  };

  // Handle button press
  const handleButtonPress = (button: keyof typeof buttonStates) => {
    setButtonStates(prev => ({
      ...prev,
      [button]: true
    }));
  };

  // Handle button release
  const handleButtonRelease = (button: keyof typeof buttonStates) => {
    setButtonStates(prev => ({
      ...prev,
      [button]: false
    }));
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isDragging) {
      e.currentTarget.classList.add('drag-over');
    }
  };

  // Handle drag leave
  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('drag-over');
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (isDragging) return; // Don't process drop if we're dragging the GameBoy itself
    
    try {
      const gameData = e.dataTransfer.getData('application/json');
      if (gameData && device && onDrop) {
        const game = JSON.parse(gameData) as Game;
        onDrop(game);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  // Handle GameBoy dragging
  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (gameboyRef.current) {
      const rect = gameboyRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  // Get the frame color from the device
  const frameColor = device ? device.getFrameColor() : '#8bcdcd';

  return (
    <div 
      ref={gameboyRef}
      className={`gameboy-container ${isDragging ? 'dragging' : ''}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      style={{ 
        backgroundColor: frameColor,
        left: `${position.x}px`,
        top: `${position.y}px`
      }}
    >
      {isHovering && !isDragging && (
        <button 
          className="remove-button"
          onClick={() => onRemove(id)}
          aria-label="Remove Game Boy"
          type="button"
        >
          -
        </button>
      )}
      
      <div className="gameboy-screen-container">
        <div className="gameboy-screen-bezel">
          <div className="power-indicator">
            <div className={`power-led ${isOn ? 'on' : 'off'}`} />
            <span className="power-text">POWER</span>
          </div>
          <canvas 
            ref={canvasRef} 
            className="gameboy-screen"
            width={160} 
            height={144}
          />
        </div>
      </div>
      
      <div className="gameboy-brand">
        <span className="brand-text">GAME GIRL</span>
      </div>
      
      <div className="gameboy-controls">
        <div className="gameboy-dpad">
          <button 
            className={`dpad-button dpad-up ${buttonStates.up ? 'pressed' : ''}`}
            onMouseDown={() => handleButtonPress('up')}
            onMouseUp={() => handleButtonRelease('up')}
            onMouseLeave={() => handleButtonRelease('up')}
            aria-label="Up"
            type="button"
          />
          <button 
            className={`dpad-button dpad-right ${buttonStates.right ? 'pressed' : ''}`}
            onMouseDown={() => handleButtonPress('right')}
            onMouseUp={() => handleButtonRelease('right')}
            onMouseLeave={() => handleButtonRelease('right')}
            aria-label="Right"
            type="button"
          />
          <button 
            className={`dpad-button dpad-down ${buttonStates.down ? 'pressed' : ''}`}
            onMouseDown={() => handleButtonPress('down')}
            onMouseUp={() => handleButtonRelease('down')}
            onMouseLeave={() => handleButtonRelease('down')}
            aria-label="Down"
            type="button"
          />
          <button 
            className={`dpad-button dpad-left ${buttonStates.left ? 'pressed' : ''}`}
            onMouseDown={() => handleButtonPress('left')}
            onMouseUp={() => handleButtonRelease('left')}
            onMouseLeave={() => handleButtonRelease('left')}
            aria-label="Left"
            type="button"
          />
          <div className="dpad-center" />
        </div>
        
        <div className="gameboy-action-buttons">
          <button 
            className={`action-button button-b ${buttonStates.b ? 'pressed' : ''}`}
            onMouseDown={() => handleButtonPress('b')}
            onMouseUp={() => handleButtonRelease('b')}
            onMouseLeave={() => handleButtonRelease('b')}
            aria-label="B Button"
            type="button"
          >
            B
          </button>
          <button 
            className={`action-button button-a ${buttonStates.a ? 'pressed' : ''}`}
            onMouseDown={() => handleButtonPress('a')}
            onMouseUp={() => handleButtonRelease('a')}
            onMouseLeave={() => handleButtonRelease('a')}
            aria-label="A Button"
            type="button"
          >
            A
          </button>
        </div>
      </div>
      
      <div className="gameboy-system-buttons">
        <button 
          className={`system-button button-select ${buttonStates.select ? 'pressed' : ''}`}
          onMouseDown={() => handleButtonPress('select')}
          onMouseUp={() => handleButtonRelease('select')}
          onMouseLeave={() => handleButtonRelease('select')}
          aria-label="Select Button"
          type="button"
        >
          SELECT
        </button>
        <button 
          className={`system-button button-start ${buttonStates.start ? 'pressed' : ''}`}
          onMouseDown={() => handleButtonPress('start')}
          onMouseUp={() => handleButtonRelease('start')}
          onMouseLeave={() => handleButtonRelease('start')}
          aria-label="Start Button"
          type="button"
        >
          START
        </button>
      </div>
      
      <button 
        className={`power-button ${isOn ? 'on' : 'off'}`}
        onClick={handlePowerClick}
        aria-label="Power Button"
        type="button"
      >
        {isOn ? 'OFF' : 'ON'}
      </button>
    </div>
  );
};

export default GameBoy; 