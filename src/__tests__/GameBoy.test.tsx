import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GameBoy from '../components/GameBoy';
import { Game } from '../games/Game';

// Mock Game class
class MockGame extends Game {
  constructor() {
    super(
      'Mock Game',
      'A game for testing',
      'Player description',
      'Developer description'
    );
  }

  protected onInit = jest.fn();
  protected onStep = jest.fn();
}

// Use the setupTests.ts mock instead of defining it here
// The getContext method is already mocked in setupTests.ts

describe('GameBoy Component', () => {
  const mockOnRemove = jest.fn();
  const mockOnDrop = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders without crashing', () => {
    render(<GameBoy id="test-device" onRemove={mockOnRemove} />);
    
    // The component should render a canvas
    const canvas = document.querySelector('.gameboy-screen');
    expect(canvas).toBeInTheDocument();
  });
  
  test('shows remove button on hover', () => {
    render(<GameBoy id="test-device" onRemove={mockOnRemove} />);
    
    // Initially, remove button should not be visible
    expect(screen.queryByLabelText('Remove Game Boy')).not.toBeInTheDocument();
    
    // Hover over the component
    const gameboyContainer = document.querySelector('.gameboy-container') as HTMLElement;
    fireEvent.mouseEnter(gameboyContainer);
    
    // Now the remove button should be visible
    expect(screen.getByLabelText('Remove Game Boy')).toBeInTheDocument();
  });
  
  test('calls onRemove when remove button is clicked', () => {
    render(<GameBoy id="test-device" onRemove={mockOnRemove} />);
    
    // Hover over the component to show the remove button
    const gameboyContainer = document.querySelector('.gameboy-container') as HTMLElement;
    fireEvent.mouseEnter(gameboyContainer);
    
    // Click the remove button
    fireEvent.click(screen.getByLabelText('Remove Game Boy'));
    
    // onRemove should be called with the device id
    expect(mockOnRemove).toHaveBeenCalledWith('test-device');
  });
  
  test('handles button presses', () => {
    render(<GameBoy id="test-device" onRemove={mockOnRemove} />);
    
    // Press the A button
    fireEvent.mouseDown(screen.getByLabelText('A Button'));
    
    // Release the A button
    fireEvent.mouseUp(screen.getByLabelText('A Button'));
    
    // Press the B button
    fireEvent.mouseDown(screen.getByLabelText('B Button'));
    
    // Release the B button
    fireEvent.mouseUp(screen.getByLabelText('B Button'));
    
    // The component should not crash
    expect(screen.getByLabelText('A Button')).toBeInTheDocument();
  });
  
  test('handles game drop', () => {
    render(<GameBoy id="test-device" onRemove={mockOnRemove} onDrop={mockOnDrop} />);
    
    const game = new MockGame();
    const dataTransfer = {
      getData: jest.fn().mockReturnValue(JSON.stringify(game))
    };
    
    // Simulate drag over
    const gameboyContainer = document.querySelector('.gameboy-container') as HTMLElement;
    fireEvent.dragOver(gameboyContainer);
    
    // Simulate drop
    fireEvent.drop(gameboyContainer, {
      dataTransfer
    });
    
    // onDrop should be called with the game
    expect(mockOnDrop).toHaveBeenCalled();
  });
}); 