import React, { useState } from 'react';
import '../styles/GameGirlLogo.css';

const GameGirlLogo: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="gamegirl-logo-container">
      <div className="gamegirl-logo" onClick={toggleInfo}>
        <h3>GameGirl</h3>
        <div className="info-icon">i</div>
      </div>
      
      {showInfo && (
        <div className="gamegirl-info-panel">
          <h2>About GameGirl</h2>
          <p>
            GameGirl is a modern web-based Game Boy simulator that lets you play
            and create retro-style games in your browser.
          </p>
          
          <h3>Features</h3>
          <ul>
            <li>Multiple game cartridges to choose from</li>
            <li>Drag and drop interface for Game Boy devices</li>
            <li>Customizable environments</li>
            <li>Zoom controls for better visibility</li>
            <li>Authentic Game Boy controls and display</li>
          </ul>
          
          <h3>How to Use</h3>
          <ul>
            <li>Drag game cartridges onto Game Boy devices to load games</li>
            <li>Use arrow keys for D-pad controls</li>
            <li>Z key for A button, X key for B button</li>
            <li>Enter for Start, Shift for Select</li>
            <li>Adjust zoom with the controls in the bottom right</li>
          </ul>
          
          <h3>Available Games</h3>
          <ul>
            <li><strong>Platform Game</strong> - A classic side-scrolling adventure</li>
            <li><strong>Adventure Game</strong> - Explore a mysterious world</li>
            <li><strong>Calculator</strong> - A utility application</li>
            <li><strong>Chat</strong> - Send and receive messages</li>
          </ul>
          
          <button onClick={toggleInfo}>Close</button>
        </div>
      )}
    </div>
  );
};

export default GameGirlLogo; 