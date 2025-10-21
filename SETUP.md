# Resonance - Setup Guide

This is a proof of concept for a cross-platform music synchronization app built using the "repository that rules them all" approach.

## Overview

Resonance is a React-based web application that can be deployed to multiple platforms:
- **Web** - Progressive Web App
- **iOS** - via Capacitor
- **Android** - via Capacitor
- **Desktop** - via Electron (future)

The app enables synchronized music playback across multiple devices using WebRTC for peer-to-peer communication.

## Technology Stack

- **Framework**: Next.js 15 with React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Mobile**: Capacitor 6
- **Communication**: WebRTC

## Prerequisites

- Node.js 18+ and npm
- For iOS development: macOS with Xcode
- For Android development: Android Studio

## Installation

1. **Install dependencies**
```bash
npm install
```

2. **Install Capacitor dependencies** (for mobile platforms)
```bash
npm install
```

## Development

### Web Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Build the web app:
```bash
npm run build
```

This creates an optimized static export in the `out/` directory.

## Mobile Platform Setup

### iOS Setup

1. **Add iOS platform**
```bash
npm run cap:add:ios
```

2. **Sync web app to iOS**
```bash
npm run build
npm run cap:sync
```

3. **Open in Xcode**
```bash
npm run cap:open:ios
```

4. Build and run from Xcode

### Android Setup

1. **Add Android platform**
```bash
npm run cap:add:android
```

2. **Sync web app to Android**
```bash
npm run build
npm run cap:sync
```

3. **Open in Android Studio**
```bash
npm run cap:open:android
```

4. Build and run from Android Studio

## Project Structure

```
resonance/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   └── MusicPlayer.tsx    # Audio player component
├── lib/                   # Utilities and libraries
│   └── webrtc.ts          # WebRTC manager
├── examples/              # Example implementations
│   ├── webrtc-demo.html   # Standalone WebRTC demo
│   └── README.md          # Examples documentation
├── experiments/           # Experimental code
│   └── sync-test.ts       # Sync timing experiments
├── capacitor.config.ts    # Capacitor configuration
├── next.config.js         # Next.js configuration
└── package.json           # Dependencies and scripts
```

## Features

### Implemented (Proof of Concept)

- ✅ Cross-platform web application foundation
- ✅ Responsive UI with Tailwind CSS
- ✅ WebRTC connection setup
- ✅ Device ID generation
- ✅ Basic music player interface
- ✅ Capacitor configuration for iOS/Android

### Planned

- ⏳ Actual WebRTC peer discovery
- ⏳ Real-time audio synchronization
- ⏳ Multi-device playback control
- ⏳ Audio file management
- ⏳ Device pairing mechanism
- ⏳ Network resilience and reconnection

## WebRTC Communication

The app uses WebRTC for device-to-device communication:

1. **Peer Discovery**: Devices discover each other (to be implemented with signaling server)
2. **Connection**: WebRTC peer connections are established
3. **Data Channel**: Sync messages (play, pause, seek) are sent via data channels
4. **Timing**: Synchronization uses timestamps to ensure coordinated playback

See `lib/webrtc.ts` for the WebRTC manager implementation.

## Testing

### Web Testing

```bash
npm run dev
```

Open multiple browser windows to test multi-device simulation.

### Example Demos

Open `examples/webrtc-demo.html` in a browser to see WebRTC connection setup in action.

### Sync Experiments

Run the sync timing experiment:
```bash
npx tsx experiments/sync-test.ts
```

## Deployment

### Web Deployment

The app exports to static files and can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

```bash
npm run build
# Upload the 'out/' directory
```

### App Store Deployment

Follow standard iOS and Android app store submission processes after building the respective platform versions.

## Known Limitations (POC)

- WebRTC signaling server not implemented (local testing only)
- No actual audio synchronization yet (UI demonstration only)
- Peer discovery mechanism not included
- No audio file upload/storage

## Next Steps

1. Implement WebRTC signaling server
2. Add peer discovery mechanism
3. Implement actual audio playback synchronization
4. Add audio file management
5. Build and test on iOS devices
6. Build and test on Android devices
7. Add Electron support for desktop

## Contributing

This is a proof of concept. For production development, consider:
- Adding comprehensive error handling
- Implementing proper state management (Redux, Zustand, etc.)
- Adding automated tests
- Setting up CI/CD pipelines
- Implementing proper security measures

## License

See LICENSE file for details.
