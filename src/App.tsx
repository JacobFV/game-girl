import { useState, useEffect } from 'react'
import './App.css'
import GameBoy from './components/GameBoy'
import GameLibrary from './components/GameLibrary'
import DeviceManager from './components/DeviceManager'
import { Network } from './core/Network'
import { Game } from './games/Game'
import { PlatformGame } from './games/platform/PlatformGame'
import { AdventureGame } from './games/adventure/AdventureGame'
import { Calculator } from './games/utility/Calculator'
import { ChatGame } from './games/ai/ChatGame'

function App() {
  const [network] = useState(new Network())
  const [games, setGames] = useState<Game[]>([])

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

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Game Boy Simulator</h1>
        <p>Create Game Boy devices and load games onto them</p>
      </header>
      
      <main className="app-content">
        <div className="app-section">
          <h2>Game Library</h2>
          <GameLibrary 
            games={games} 
            onSelectGame={(game) => console.log(`Selected game: ${game.getTitle()}`)} 
          />
        </div>
        
        <div className="app-section">
          <h2>Devices</h2>
          <DeviceManager network={network} />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Drag and drop games onto devices to play. Use the + button to add more devices.</p>
      </footer>
    </div>
  )
}

export default App
