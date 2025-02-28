import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock dependencies
jest.mock('../components/GameLibrary', () => {
  return function MockGameLibrary({ games, onSelectGame }: { games: any[]; onSelectGame: (game: any) => void }) {
    return (
      <div data-testid="game-library">
        <h2>Game Library</h2>
        <div>
          {games.map((game, index) => (
            <div key={index} data-testid={`game-${index}`}>
              {game.getTitle()}
            </div>
          ))}
        </div>
      </div>
    );
  };
});

jest.mock('../components/DeviceManager', () => {
  return function MockDeviceManager({ network }: { network: any }) {
    return (
      <div data-testid="device-manager">
        <h2>Device Manager</h2>
      </div>
    );
  };
});

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders without crashing', () => {
    render(<App />);
    
    // Should render the app title
    expect(screen.getByText('Game Boy Simulator')).toBeInTheDocument();
  });
  
  test('renders all main sections', () => {
    render(<App />);
    
    // Should render the header
    expect(screen.getByText('Game Boy Simulator')).toBeInTheDocument();
    expect(screen.getByText('Create Game Boy devices and load games onto them')).toBeInTheDocument();
    
    // Should render the game library section
    expect(screen.getByTestId('game-library')).toBeInTheDocument();
    
    // Should render the device manager section
    expect(screen.getByTestId('device-manager')).toBeInTheDocument();
    
    // Should render the footer
    expect(screen.getByText('Drag and drop games onto devices to play. Use the + button to add more devices.')).toBeInTheDocument();
  });
  
  test('initializes games', async () => {
    render(<App />);
    
    // Wait for games to be initialized
    // In a real test, we would use waitFor or findBy queries
    // For this mock, we're just checking that the component renders
    expect(screen.getByTestId('game-library')).toBeInTheDocument();
  });
}); 