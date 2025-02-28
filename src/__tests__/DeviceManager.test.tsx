import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DeviceManager from '../components/DeviceManager';
import { Network } from '../core/Network';
import { Game } from '../games/Game';

// Mock dependencies
jest.mock('../components/GameBoy', () => {
  return function MockGameBoy({ id, onRemove, onDrop }: { id: string; onRemove: (id: string) => void; onDrop?: (game: Game) => void }) {
    return (
      <div data-testid={`gameboy-${id}`}>
        <button onClick={() => onRemove(id)}>Remove</button>
        {onDrop && <button onClick={() => onDrop({ getTitle: () => 'Mock Game' } as Game)}>Drop Game</button>}
      </div>
    );
  };
});

describe('DeviceManager Component', () => {
  let network: Network;
  
  beforeEach(() => {
    network = new Network();
    jest.clearAllMocks();
  });
  
  test('renders without crashing', () => {
    render(<DeviceManager network={network} />);
    
    // Should render at least one Game Boy device
    expect(screen.getByTestId('gameboy-device-1')).toBeInTheDocument();
    
    // Should render the add device button
    expect(screen.getByLabelText('Add new Game Boy device')).toBeInTheDocument();
  });
  
  test('adds a new device when add button is clicked', () => {
    render(<DeviceManager network={network} />);
    
    // Initially there should be one device
    expect(screen.getAllByTestId(/gameboy-device-/)).toHaveLength(1);
    
    // Click the add device button
    fireEvent.click(screen.getByLabelText('Add new Game Boy device'));
    
    // Now there should be two devices
    expect(screen.getAllByTestId(/gameboy-device-/)).toHaveLength(2);
    expect(screen.getByTestId('gameboy-device-2')).toBeInTheDocument();
  });
  
  test('removes a device when remove button is clicked', () => {
    render(<DeviceManager network={network} />);
    
    // Add a second device
    fireEvent.click(screen.getByLabelText('Add new Game Boy device'));
    
    // Now there should be two devices
    expect(screen.getAllByTestId(/gameboy-device-/)).toHaveLength(2);
    
    // Remove the second device
    fireEvent.click(screen.getByTestId('gameboy-device-2').querySelector('button') as HTMLElement);
    
    // Now there should be one device again
    expect(screen.getAllByTestId(/gameboy-device-/)).toHaveLength(1);
    expect(screen.queryByTestId('gameboy-device-2')).not.toBeInTheDocument();
  });
  
  test('does not remove the last device', () => {
    render(<DeviceManager network={network} />);
    
    // Try to remove the only device
    fireEvent.click(screen.getByTestId('gameboy-device-1').querySelector('button') as HTMLElement);
    
    // The device should still be there
    expect(screen.getByTestId('gameboy-device-1')).toBeInTheDocument();
  });
  
  test('handles game drop on a device', () => {
    render(<DeviceManager network={network} />);
    
    // Find the drop game button on the first device
    const dropButton = screen.getByTestId('gameboy-device-1').querySelectorAll('button')[1];
    
    // Click the drop game button
    fireEvent.click(dropButton);
    
    // The game should be loaded (we can't easily test this directly, but at least it shouldn't crash)
    expect(screen.getByTestId('gameboy-device-1')).toBeInTheDocument();
  });
}); 