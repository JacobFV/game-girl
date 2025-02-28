import React, { useState, useRef } from 'react';
import { Game } from '../games/Game';
import '../styles/GameCartridge.css';

interface GameCartridgeProps {
  game: Game;
  initialPosition?: { x: number; y: number };
}

const GameCartridge: React.FC<GameCartridgeProps> = ({ game, initialPosition = { x: 0, y: 0 } }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const cartridgeRef = useRef<HTMLDivElement>(null);

  // Generate a color based on the game type
  const getCartridgeColor = () => {
    const title = game.getTitle().toLowerCase();
    if (title.includes('platform')) return '#8bcdcd'; // Teal
    if (title.includes('adventure')) return '#ffa9a3'; // Salmon
    if (title.includes('calculator')) return '#c8e6c9'; // Light Green
    if (title.includes('chat')) return '#ffcc80'; // Light Orange
    return '#e0e0e0'; // Default gray
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (cartridgeRef.current) {
      const rect = cartridgeRef.current.getBoundingClientRect();
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

  const handleDragStartForGameBoy = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(game));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div
      ref={cartridgeRef}
      className={`game-cartridge ${isDragging ? 'dragging' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        backgroundColor: getCartridgeColor()
      }}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onMouseMove={handleDrag}
      onMouseLeave={isDragging ? handleDragEnd : undefined}
      draggable
      onDragStart={handleDragStartForGameBoy}
    >
      <div className="cartridge-top">
        <div className="cartridge-notch" />
      </div>
      <div className="cartridge-label">
        <h3>{game.getTitle()}</h3>
        <p>{game.getDescription()}</p>
      </div>
      <div className="cartridge-contacts" />
    </div>
  );
};

export default GameCartridge; 