import React, { useState, useEffect } from 'react'
import './App.css'
import './styles/EnvironmentBackgrounds.css'
import { GameBoyDevice } from './core/GameBoyDevice'
import { Game } from './games/Game'
import EnvironmentSelector from './components/EnvironmentSelector'
import GameGirlLogo from './components/GameGirlLogo'
import ZoomControls from './components/ZoomControls'
import GameCartridge from './components/GameCartridge'
import GameBoy from './components/GameBoy'
import { PlatformGame } from './games/platform/PlatformGame'
import { AdventureGame } from './games/adventure/AdventureGame'
import { CalculatorGame } from './games/calculator/CalculatorGame'
import { ChatGame } from './games/chat/ChatGame'

const App: React.FC = () => {
  const [environment, setEnvironment] = useState<string>('desk')
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [games, setGames] = useState<Game[]>([])
  const [devices, setDevices] = useState<string[]>([])
  const [devicePositions, setDevicePositions] = useState<Record<string, { x: number; y: number }>>({})
  const [gamePositions, setGamePositions] = useState<Record<string, { x: number; y: number }>>({})

  // Initialize games
  useEffect(() => {
    const platformGame = new PlatformGame()
    const adventureGame = new AdventureGame()
    const calculatorGame = new CalculatorGame()
    const chatGame = new ChatGame()
    
    setGames([platformGame, adventureGame, calculatorGame, chatGame])
    
    // Set initial positions for game cartridges
    setGamePositions({
      [platformGame.getId()]: { x: 150, y: 100 },
      [adventureGame.getId()]: { x: 150, y: 250 },
      [calculatorGame.getId()]: { x: 150, y: 400 },
      [chatGame.getId()]: { x: 150, y: 550 }
    })
  }, [])

  // Add a new device
  const handleAddDevice = () => {
    const deviceId = `device-${devices.length + 1}`
    setDevices([...devices, deviceId])
    
    // Calculate position for the new device in a grid-like pattern
    const deviceCount = devices.length;
    const row = Math.floor(deviceCount / 2);
    const col = deviceCount % 2;
    
    // Set initial position for the new device
    setDevicePositions(prev => ({
      ...prev,
      [deviceId]: { x: 500 + (col * 300), y: 200 + (row * 300) }
    }))
  }

  // Remove a device
  const handleRemoveDevice = (deviceId: string) => {
    setDevices(devices.filter(id => id !== deviceId))
    
    // Remove the device position
    const updatedPositions = { ...devicePositions }
    delete updatedPositions[deviceId]
    setDevicePositions(updatedPositions)
  }

  // Handle zoom controls
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5))
  }

  const handleZoomReset = () => {
    setZoomLevel(1)
  }

  // Get environment background
  const getBackgroundClass = () => {
    return `environment ${environment}`
  }

  return (
    <div className="app-container" style={{ transform: `scale(${zoomLevel})` }}>
      <header className="app-header">
        <h1>Game Boy Simulator</h1>
        <p>Create Game Boy devices and load games onto them</p>
      </header>
      
      <div className={getBackgroundClass()} />
      
      <EnvironmentSelector 
        currentEnvironment={environment} 
        onEnvironmentChange={setEnvironment} 
      />
      
      <GameGirlLogo />
      
      <ZoomControls 
        zoomLevel={zoomLevel}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
      />
      
      <button 
        className="add-device-button"
        onClick={handleAddDevice}
        type="button"
      >
        Add Game Boy
      </button>
      
      {/* Game cartridges */}
      <div data-testid="game-library">
        <h2 className="visually-hidden">Game Library</h2>
        {games.map(game => (
          <GameCartridge 
            key={game.getId()} 
            game={game} 
            initialPosition={gamePositions[game.getId()]}
          />
        ))}
      </div>
      
      {/* Game Boy devices */}
      <div data-testid="device-manager">
        <h2 className="visually-hidden">Device Manager</h2>
        {devices.map(deviceId => (
          <GameBoy 
            key={deviceId}
            id={deviceId}
            onRemove={handleRemoveDevice}
            initialPosition={devicePositions[deviceId]}
          />
        ))}
      </div>
      
      <footer className="app-footer">
        <p>Drag and drop games onto devices to play. Use the + button to add more devices.</p>
      </footer>
    </div>
  )
}

export default App
