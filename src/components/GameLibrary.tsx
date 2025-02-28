import type React from 'react';
import type { KeyboardEvent } from 'react';
import type { Game } from '../games/Game';
import '../styles/GameLibrary.css';

interface GameLibraryProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const GameLibrary: React.FC<GameLibraryProps> = ({ games, onSelectGame }) => {
  // Handle drag start
  const handleDragStart = (e: React.DragEvent, game: Game) => {
    e.dataTransfer.setData('application/json', JSON.stringify(game));
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Handle key press for accessibility
  const handleKeyPress = (e: KeyboardEvent<HTMLButtonElement>, game: Game) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onSelectGame(game);
    }
  };

  // Get category from game title or class
  const getCategoryFromGame = (game: Game): string => {
    const title = game.getTitle().toLowerCase();
    
    if (title.includes('adventure')) return 'Adventure';
    if (title.includes('learn')) return 'Learning';
    if (title.includes('platform')) return 'Platform';
    if (title.includes('skill')) return 'Skill';
    if (title.includes('story')) return 'Story';
    if (title.includes('social')) return 'Social';
    if (title.includes('calculator') || title.includes('browser')) return 'Utility';
    if (title.includes('chat') || title.includes('ai')) return 'AI';
    
    // Default category
    return 'Other';
  };

  // Group games by category
  const gamesByCategory: Record<string, Game[]> = games.reduce((acc, game) => {
    const category = getCategoryFromGame(game);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(game);
    return acc;
  }, {} as Record<string, Game[]>);

  // Get cartridge design elements based on category
  const getCartridgeDesign = (category: string, game: Game) => {
    const title = game.getTitle();
    const firstLetter = title.charAt(0);
    const color = getColorForCategory(category);
    
    // Generate a pattern based on the game title
    const patternType = title.length % 4;
    let pattern: string;
    
    switch (patternType) {
      case 0:
        pattern = 'linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 25%, transparent 50%)';
        break;
      case 1:
        pattern = 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.1) 5px, rgba(255,255,255,0.1) 10px)';
        break;
      case 2:
        pattern = 'radial-gradient(circle at top right, rgba(255,255,255,0.2), transparent 60%)';
        break;
      case 3:
        pattern = 'linear-gradient(to bottom right, transparent, rgba(255,255,255,0.15))';
        break;
      default:
        pattern = 'none';
    }
    
    return {
      backgroundColor: color,
      backgroundImage: pattern,
      letter: firstLetter
    };
  };

  return (
    <div className="game-library">
      <h2>Game Library</h2>
      <p className="library-instructions">Drag a game cartridge onto a GameGirl to play</p>
      
      {Object.entries(gamesByCategory).map(([category, categoryGames]) => (
        <div key={category} className="game-category">
          <h3>{category}</h3>
          <div className="game-list">
            {categoryGames.map((game, index) => {
              const design = getCartridgeDesign(category, game);
              
              return (
                <button
                  key={`${game.getTitle()}-${index}`}
                  className="game-item"
                  draggable
                  onDragStart={(e) => handleDragStart(e, game)}
                  onClick={() => onSelectGame(game)}
                  onKeyUp={(e) => handleKeyPress(e, game)}
                  aria-label={`Select ${game.getTitle()} game`}
                  type="button"
                >
                  <div 
                    className="game-icon" 
                    style={{ 
                      backgroundColor: design.backgroundColor,
                      backgroundImage: design.backgroundImage
                    }}
                  >
                    {design.letter}
                  </div>
                  <div className="game-info">
                    <h4>{game.getTitle()}</h4>
                    <p>{game.getDescription()}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// Get color for category
const getColorForCategory = (category: string): string => {
  const colors: Record<string, string> = {
    Adventure: '#8bcdcd',
    Learning: '#a6dcef',
    Platform: '#ffaaa5',
    Skill: '#ffd3b6',
    Story: '#dcedc1',
    Social: '#fdffbc',
    Utility: '#d9a5b3',
    AI: '#c6d8ff',
    Other: '#d6cbd3'
  };
  
  return colors[category] || colors.Other;
};

export default GameLibrary; 