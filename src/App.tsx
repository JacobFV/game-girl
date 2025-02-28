import { useState, useEffect } from 'react'
import './App.css'
import GameLibrary from './components/GameLibrary'
import DeviceManager from './components/DeviceManager'
import { Network } from './core/Network'
import type { Game } from './games/Game'
import { PlatformGame } from './games/platform/PlatformGame'
import { AdventureGame } from './games/adventure/AdventureGame'
import { Calculator } from './games/utility/Calculator'
import { ChatGame } from './games/ai/ChatGame'
import ZoomControls from './ZoomControls'
import DraggablePanel from './DraggablePanel'

// Define available environments
const environments = [
  { id: 'bedroom', name: 'Bedroom', bgColor: '#e8d0c3' },
  { id: 'kitchen', name: 'Kitchen', bgColor: '#c3e8d0' },
  { id: 'spaceship', name: 'Spaceship', bgColor: '#c3d0e8' },
  { id: 'arcade', name: 'Arcade', bgColor: '#e8c3d0' },
  { id: 'office', name: 'Office', bgColor: '#d0e8c3' },
  { id: 'beach', name: 'Beach', bgColor: '#e8e0c3' }
];

function App() {
  const [network] = useState(new Network())
  const [games, setGames] = useState<Game[]>([])
  const [currentEnvironment, setCurrentEnvironment] = useState(environments[0])
  const [showInfo, setShowInfo] = useState(false)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)

  // Initialize games
  useEffect(() => {
    const gamesList = [
      new PlatformGame(),
      new AdventureGame(),
      new Calculator(),
      new ChatGame()
    ]
    
    setGames(gamesList)
  }, [])

  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    console.log(`Selected game: ${game.getTitle()}`);
  };

  return (
    <div className="app-container" style={{ backgroundColor: currentEnvironment.bgColor }}>
      <header className="app-header">
        <h1>GameGirl Simulator</h1>
        <p>Create GameGirl devices and load games onto them</p>
        
        <div className="environment-selector">
          <label htmlFor="environment-select">Environment: </label>
          <select 
            id="environment-select"
            value={currentEnvironment.id}
            onChange={(e) => {
              const selected = environments.find(env => env.id === e.target.value);
              if (selected) setCurrentEnvironment(selected);
            }}
          >
            {environments.map(env => (
              <option key={env.id} value={env.id}>{env.name}</option>
            ))}
          </select>
        </div>
      </header>
      
      <div className="info-container">
        <span className="brand-name">GameGirl</span>
        <button 
          className="info-button"
          onClick={() => setShowInfo(!showInfo)}
          aria-label="Information"
          type="button"
        >
          i
        </button>
        
        {showInfo && (
          <div className="info-popup">
            <h3>About GameGirl</h3>
            <p>GameGirl is a handheld gaming device simulator. You can create multiple devices, load different games, and enjoy the nostalgic experience of 90s handheld gaming.</p>
            <button onClick={() => setShowInfo(false)} type="button">Close</button>
          </div>
        )}
      </div>
      
      <main className="app-content">
        <DraggablePanel 
          title="Game Library" 
          initialPosition={{ x: 20, y: 20 }}
        >
          <GameLibrary 
            games={games} 
            onSelectGame={handleSelectGame} 
          />
        </DraggablePanel>
        
        <DraggablePanel 
          title="Devices" 
          initialPosition={{ x: 350, y: 20 }}
        >
          <DeviceManager network={network} />
        </DraggablePanel>
        
        {selectedGame && (
          <DraggablePanel 
            title={`Game: ${selectedGame.getTitle()}`} 
            initialPosition={{ x: 150, y: 150 }}
          >
            <div>
              <h3>{selectedGame.getTitle()}</h3>
              <p>{selectedGame.getDescription()}</p>
            </div>
          </DraggablePanel>
        )}
      </main>
      
      <footer className="app-footer">
        <p>Drag panel headers to move. Use zoom controls to adjust view.</p>
      </footer>
      
      <ZoomControls />
    </div>
  )
}

export default App
