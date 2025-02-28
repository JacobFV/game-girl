# Game Boy Simulator

A virtual Game Boy simulator with multiple games and networking capabilities. Create multiple Game Boy devices, load different games onto them, and even connect devices for multiplayer experiences.

## Features

- **Game Boy Device Simulation**: Realistic Game Boy device with buttons, screen, and game loading capabilities
- **Multiple Games**: Library of games across different genres
- **Drag and Drop Interface**: Easily load games onto devices
- **Device Management**: Create and remove Game Boy devices as needed
- **Networking**: Connect devices together for multiplayer experiences

## Games Library

The simulator includes the following games:

### Platform Game
- **Player Facing**: Jump and run through platforms, collect coins, and avoid falling off the screen!
- **Developer Facing**: Implements physics system, collision detection, and simple level design.

### Adventure Game
- **Player Facing**: Explore a mysterious world, collect items, and solve puzzles to progress through different areas.
- **Developer Facing**: Implements a state machine for game progression, tile-based map system, inventory management, and simple collision detection.

### Calculator Utility
- **Player Facing**: Perform basic arithmetic operations with this handy calculator.
- **Developer Facing**: Implements expression parsing, calculation logic, and display formatting.

### AI Chat Game
- **Player Facing**: Have a conversation with a friendly AI character that responds to your messages and remembers your conversation history.
- **Developer Facing**: Implements pattern matching responses, conversation state tracking, and character personality traits.

## How to Use

1. **Create Devices**: Use the + button to create new Game Boy devices
2. **Load Games**: Drag a game from the library and drop it onto a device
3. **Play Games**: Use the buttons on the Game Boy to interact with the loaded game
4. **Connect Devices**: Devices are automatically connected for multiplayer experiences
5. **Remove Devices**: Hover over a device and click the - button to remove it

## Controls

Each Game Boy device has the following controls:

- **D-Pad**: Up, Down, Left, Right buttons for movement
- **A/B Buttons**: Action buttons for game interactions
- **Start/Select**: System buttons for game options
- **Power Button**: Turn the device on or off

## Technical Implementation

The simulator is built using React and TypeScript, with the following core components:

- **GameBoyDevice**: Core class that handles the device functionality
- **Game**: Base class for all games with common functionality
- **Network**: Class that manages connections between devices
- **UI Components**: React components for the user interface

## Development

To run the project locally:

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open your browser to the local development URL

## Future Enhancements

- Additional games across more genres
- Enhanced multiplayer capabilities
- Save/load game state
- Custom game creation tools
