# 🎵 LyrixTube

> The Ultimate Song Lyrics Generator. Instantly generate song lyrics from any YouTube link with ease.

LyrixTube is a full-stack application that extracts song information from YouTube music links and retrieves accurate lyrics using the Genius Lyrics API.

Built with Flutter for a beautiful UI and Node.js/Express for a robust backend.

## ✨ Features

- 🎬 **YouTube Integration**: Extract song metadata directly from YouTube music links
- 📝 **Instant Lyrics**: Fetch accurate lyrics from Genius Lyrics API
- 🔄 **State Management**: Provider pattern for efficient state management
- 🌐 **Cross-Platform**: Support for iOS, Android, Web, macOS, Linux, and Windows

## 🛠️ Tech Stack

### Frontend
- **Framework**: Flutter 3.6.0+
- **Language**: Dart
- **State Management**: Provider (v6.1.5+)
- **HTTP Client**: Dio (v5.9.0)
- **UI Components**:
  - Material 3 Design
  - Shimmer loading animations

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5.2.1)
- **HTTP Client**: Axios (v1.13.3)
- **Music API**:
  - Genius Lyrics (v4.4.7)
  - play-dl (v1.9.7) for YouTube extraction
- **Utilities**: CORS, dotenv for environment configuration

## Demo

| Home                                               | Lyrics                                              |
| -------------------------------------------------- | --------------------------------------------------- |
| <img src="demo/screen1.png" width="250" alt="Home screen" /> | <img src="demo/screen2.png" width="250" alt="Lyrics screen" /> |

## 📋 Project Structure

```
LyrixTube/
├── lyrix_tube_app/           # Flutter Frontend Application
│   ├── lib/
│   │   ├── main.dart         # App entry point
│   │   ├── screen/
│   │   │   └── lyrics_screen.dart    # Main UI screen
│   │   └── provider/
│   │       └── lyrics_provider.dart  # State management logic
│   ├── android/              # Android native code
│   ├── ios/                  # iOS native code
│   └── pubspec.yaml          # Flutter dependencies
│
├── server/                   # Node.js Backend
│   ├── Dockerfile            # Docker image definition for backend
│   ├── .dockerignore         # Files excluded from Docker build context
│   ├── .env.example          # Environment variable template
│   ├── index.js              # Server entry point
│   ├── controllers/
│   │   └── lyrics.js         # Lyrics controller logic
│   ├── routes/
│   │   └── allRoutes.js      # API route definitions
│   ├── services/
│   │   └── lyrics.js         # Lyrics service/business logic
│   ├── utils/
│   │   └── formatLyrics.js   # Lyrics formatting utilities
│   └── package.json          # Node dependencies
│
├── docker-compose.yml        # Multi-container orchestration
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- **Flutter**: Version 3.6.0 or higher
- **Node.js**: Version 14 or higher
- **npm** or **yarn**: Package manager for backend
- **Git**: For cloning the repository

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/AritraC1/LyrixTube.git
cd LyrixTube
```

#### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy the environment variable template and fill in your values
cp .env.example .env

# Start the development server
npm start
```

The backend server will run on `http://localhost:3000` (or the port specified in your .env).

#### 3. Frontend Setup

```bash
# Navigate to Flutter app directory
cd lyrix_tube_app

# Get Flutter dependencies
flutter pub get

# Run on Android (requires Android Studio)
flutter run -d android

# Run on iOS (requires macOS and Xcode)
flutter run -d ios
```

## 🐳 Docker Setup

The backend API is fully containerised using Docker. The Flutter mobile app runs natively on device and does not require a container.

### Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher

### Environment Setup

```bash
# Copy the environment variable template
cp server/.env.example server/.env

# Fill in your Genius API key
# GENIUS_API_KEY=your_genius_api_key_here
```

### Running with Docker Compose (Recommended)

```bash
# Build and start the backend container in detached mode
docker compose up --build -d

# View live logs
docker compose logs -f api

# Stop the container
docker compose down
```

The API will be available at `http://localhost:3001`.

### Running with Docker directly

```bash
# Build the image
docker build -t lyrixtube-server ./server

# Run the container
docker run -p 3001:3000 --env-file ./server/.env lyrixtube-server
```

### Verify the container is healthy

```bash
# Check container status
docker ps

# Test the health endpoint
curl http://localhost:3001/health
# Expected response: { "status": "ok" }
```

### Docker Architecture

| File                 | Location   | Purpose                                      |
| -------------------- | ---------- | -------------------------------------------- |
| `Dockerfile`         | `server/`  | Builds the Node.js API image                 |
| `.dockerignore`      | `server/`  | Excludes unnecessary files from build context |
| `docker-compose.yml` | `root`     | Orchestrates the backend service             |

**Key decisions:**
- Base image: `node:20-slim` — small footprint, avoids Alpine's musl libc compatibility issues with native modules
- Runs as non-root `node` user for security
- Dependencies installed with `npm ci` for reproducible builds
- Layer-cached dependency install — only reinstalls packages when `package.json` changes
- Healthcheck on `/health` endpoint with 10s start period, 30s interval

## 📱 Usage

1. **Launch the App**: Open LyrixTube on your device
2. **Paste YouTube Link**: Enter a YouTube music video link in the input field
3. **Generate Lyrics**: Tap the "Generate Lyrics" button
4. **View Results**: Wait for the lyrics to load and display
5. **Loading State**: The app shows a shimmer loading animation while fetching data

### Example YouTube Links

- `https://www.youtube.com/watch?v=dQw4w9WgXcQ` (Rick Astley - Never Gonna Give You Up)
- `https://www.youtube.com/watch?v=hT_nvWreIhg` (OneRepublic - Counting Stars)

## 🔌 API Endpoints

### Backend API Routes

| Method | Endpoint                | Description                |
| ------ | ----------------------- | -------------------------- |
| GET    | `/health`               | Container health check     |
| POST   | `/api/generate-lyrics`  | Get lyrics for a song      |

#### Request Format
```json
{
  "link": "https://www.youtube.com/watch?v=hT_nvWreIhg"
}
```

#### Response Format
```json
{
  "success": true,
  "data": {
    "artist": "OneRepublic",
    "song": "Counting Stars",
    "lyrics": "[Intro]\nLately, I been, I been losin' sleep\nDreamin' ..."
  }
}
```

## 🔐 Environment Variables

### Backend (.env)

Copy `.env.example` to `.env` and fill in your values:

```
PORT=3000
GENIUS_API_KEY=your_genius_api_key_here
```

Get your Genius API key: [genius.com/api-clients](https://genius.com/api-clients)

> ⚠️ Never commit your `.env` file. It is listed in both `.gitignore` and `.dockerignore`.

## 📦 Building for Production

### Android APK
```bash
flutter build apk --release
# Output: build/app/outputs/flutter-apk/app-release.apk
```

### iOS App
```bash
flutter build ios --release
# Requires further processing with Xcode
```

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/AritraC1/LyrixTube/issues) on GitHub.

---