import React from 'react';
import GameBoy from './GameBoy';
import { Game } from '../games/Game';
import { Network } from '../core/Network';
import '../styles/DeviceManager.css';

interface DeviceManagerProps {
  network: Network;
}

const DeviceManager: React.FC<DeviceManagerProps> = ({ network }) => {
  const [devices, setDevices] = React.useState<string[]>(['device-1']);
  const [selectedGame, setSelectedGame] = React.useState<Game | null>(null);

  // Add a new device
  const addDevice = () => {
    const newDeviceId = `device-${devices.length + 1}`;
    setDevices([...devices, newDeviceId]);
  };

  // Remove a device
  const removeDevice = (id: string) => {
    if (devices.length <= 1) {
      // Always keep at least one device
      return;
    }
    setDevices(devices.filter(deviceId => deviceId !== id));
  };

  // Handle game drop on a device
  const handleGameDrop = (deviceId: string, game: Game) => {
    console.log(`Loading game "${game.getTitle()}" on device ${deviceId}`);
    setSelectedGame(game);
  };

  return (
    <div className="device-manager">
      <div className="devices-container">
        {devices.map(deviceId => (
          <GameBoy
            key={deviceId}
            id={deviceId}
            onRemove={removeDevice}
            onDrop={(game) => handleGameDrop(deviceId, game)}
          />
        ))}
      </div>
      
      <button 
        className="add-device-button" 
        onClick={addDevice}
        aria-label="Add new Game Boy device"
        type="button"
      >
        +
      </button>
    </div>
  );
};

export default DeviceManager; 