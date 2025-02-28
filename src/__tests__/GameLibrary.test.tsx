import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameLibrary from '../components/GameLibrary';
import { Game } from '../games/Game';

// Mock Game class
class MockGame extends Game {
  constructor(title: string, category: string) {
    super(
      title,
      `Description for ${title}`,
      `Player description for ${title}`,
      `Developer description for ${title}`
    );
  }

  protected onInit = jest.fn();
  protected onStep = jest.fn();
}

describe('GameLibrary Component', () => {
  const mockOnSelectGame = jest.fn();
  
  // Create mock games for different categories
  const games = [
    new MockGame('Adventure Game', 'Adventure'),
    new MockGame('Platform Game', 'Platform'),
    new MockGame('Calculator', 'Utility'),
    new MockGame('Chat Game', 'AI')
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders without crashing', () => {
    render(<GameLibrary games={games} onSelectGame={mockOnSelectGame} />);
    
    // The component should render the title
    expect(screen.getByText('Game Library')).toBeInTheDocument();
  });
  
  test('displays games grouped by category', () => {
    render(<GameLibrary games={games} onSelectGame={mockOnSelectGame} />);
    
    // Should display category headings
    expect(screen.getByText('Adventure')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Utility')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    
    // Should display game titles
    expect(screen.getByText('Adventure Game')).toBeInTheDocument();
    expect(screen.getByText('Platform Game')).toBeInTheDocument();
    expect(screen.getByText('Calculator')).toBeInTheDocument();
    expect(screen.getByText('Chat Game')).toBeInTheDocument();
  });
  
  test('calls onSelectGame when a game is clicked', () => {
    render(<GameLibrary games={games} onSelectGame={mockOnSelectGame} />);
    
    // Click on a game
    fireEvent.click(screen.getByText('Adventure Game'));
    
    // onSelectGame should be called with the game
    expect(mockOnSelectGame).toHaveBeenCalledTimes(1);
    expect(mockOnSelectGame).toHaveBeenCalledWith(games[0]);
  });
  
  test('handles drag start on a game', () => {
    render(<GameLibrary games={games} onSelectGame={mockOnSelectGame} />);
    
    // Mock dataTransfer
    const dataTransfer = {
      setData: jest.fn(),
      effectAllowed: ''
    };
    
    // Start dragging a game
    fireEvent.dragStart(screen.getByText('Platform Game').closest('.game-item') as HTMLElement, {
      dataTransfer
    });
    
    // dataTransfer.setData should be called with the game data
    expect(dataTransfer.setData).toHaveBeenCalledTimes(1);
    expect(dataTransfer.setData.mock.calls[0][0]).toBe('application/json');
    expect(dataTransfer.effectAllowed).toBe('copy');
  });
}); 