import React from 'react';
import { Game } from '../games/Game';
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

  return (
    <div className="game-library">
      <h2>Game Library</h2>
      <p className="library-instructions">Drag a game onto a Game Boy to load it</p>
      
      {Object.entries(gamesByCategory).map(([category, categoryGames]) => (
        <div key={category} className="game-category">
          <h3>{category}</h3>
          <div className="game-list">
            {categoryGames.map((game, index) => (
              <div
                key={`${game.getTitle()}-${index}`}
                className="game-item"
                draggable
                onDragStart={(e) => handleDragStart(e, game)}
                onClick={() => onSelectGame(game)}
              >
                <div className="game-icon" style={{ backgroundColor: getColorForCategory(category) }}>
                  {game.getTitle().charAt(0)}
                </div>
                <div className="game-info">
                  <h4>{game.getTitle()}</h4>
                  <p>{game.getDescription()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Get color for category
const getColorForCategory = (category: string): string => {
  const colors: Record<string, string> = {
    'Adventure': '#8bcdcd',
    'Learning': '#a6dcef',
    'Platform': '#ffaaa5',
    'Skill': '#ffd3b6',
    'Story': '#dcedc1',
    'Social': '#fdffbc',
    'Utility': '#d9a5b3',
    'AI': '#c6d8ff',
    'Other': '#d6cbd3'
  };
  
  return colors[category] || colors['Other'];
};

export default GameLibrary; 