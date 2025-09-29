# Resonance

A cross-platform music synchronization app that plays music across all your devices in perfect sync. Built with Next.js, React, Capacitor, and Electron, allowing deployment to web, iOS, Android, and desktop platforms from a single codebase.

## Features

- 🎵 **Multi-Device Sync**: Play music across multiple devices simultaneously
- 📱 **Cross-Platform**: Works on iOS, Android, Web, and Desktop (macOS, Windows, Linux)
- 🔊 **WebRTC Integration**: Real-time synchronization using WebRTC for low-latency communication
- 🎨 **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- ⚡ **One Codebase**: Single repository for all platforms using the "repository that rules them all" approach

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Mobile**: Capacitor for iOS/Android
- **Desktop**: Electron for macOS/Windows/Linux
- **Real-time Communication**: WebRTC with WebSocket signaling
- **Testing**: Jest, React Testing Library

## Prerequisites

- Node.js 18+ and npm
- For iOS development: macOS with Xcode
- For Android development: Android Studio
- For desktop builds: Platform-specific build tools

## Installation

1. Clone the repository:
```bash
git clone https://github.com/konard/resonance.git
cd resonance
```

2. Install dependencies:
```bash
npm install
```

## Development

### Web Development

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Signaling Server

The WebRTC signaling server is required for device synchronization:
```bash
npm run server
```

The server runs on port 8080 by default.

### Desktop Development (Electron)

Run the desktop app in development mode:
```bash
npm run electron:dev
```

### Mobile Development

#### iOS
```bash
# Add iOS platform
npm run capacitor:add:ios

# Build and sync
npm run capacitor:sync

# Open in Xcode
npm run capacitor:open:ios
```

#### Android
```bash
# Add Android platform
npm run capacitor:add:android

# Build and sync
npm run capacitor:sync

# Open in Android Studio
npm run capacitor:open:android
```

## Building for Production

### Web Build
```bash
npm run build
```

The static files will be generated in the `out` directory.

### Desktop Build
```bash
npm run electron:build
```

Platform-specific installers will be created in the `dist-electron` directory.

### Mobile Build

1. First, build the web app:
```bash
npm run build
```

2. Sync with Capacitor:
```bash
npm run capacitor:sync
```

3. Open the respective IDE (Xcode/Android Studio) and build from there.

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Generate coverage report:
```bash
npm run test:coverage
```

## Project Structure

```
resonance/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── MusicPlayer.tsx # Main music player component
│   └── DeviceSync.tsx  # Device synchronization UI
├── lib/                # Utility functions and hooks
│   └── useWebRTC.ts    # WebRTC hook for synchronization
├── server/             # Backend services
│   └── signaling-server.js # WebSocket signaling server
├── electron/           # Electron desktop app
│   └── main.js         # Electron main process
├── public/             # Static assets
├── __tests__/          # Test files
└── capacitor.config.ts # Capacitor configuration
```

## How It Works

1. **Room Creation**: One device creates a room and gets a room code
2. **Device Connection**: Other devices join using the room code
3. **WebRTC Setup**: Devices establish peer-to-peer connections via WebRTC
4. **Music Sync**: The master device controls playback, and all connected devices stay in sync
5. **Low Latency**: Direct P2P connections ensure minimal delay between devices

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run server` - Start signaling server
- `npm run electron` - Run Electron app
- `npm run electron:build` - Build Electron app
- `npm run capacitor:sync` - Sync with Capacitor platforms
- `npm run build:all` - Build for all platforms

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is released under The Unlicense - see the [LICENSE](LICENSE) file for details.
