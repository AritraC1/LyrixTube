# 🎵 LyrixTube

> A full-stack lyrics lookup app that generates song lyrics from YouTube music links.

LyrixTube combines a Flutter mobile frontend with a Node.js/Express backend. The backend extracts metadata from YouTube URLs, searches Genius for lyrics, formats them, and caches results in MongoDB.

## ✨ What’s Included

- 🎬 YouTube song metadata extraction using `play-dl`
- 📝 Lyrics lookup with `genius-lyrics`
- 🧠 MongoDB caching layer for repeated searches
- 📱 Flutter UI with Provider state management and Dio HTTP client
- 🐳 Docker Compose setup for backend + MongoDB
- 🧪 Jest backend tests with Supertest

## 🛠️ Tech Stack

### Frontend
- Flutter
- Dart
- Provider
- Dio
- Shimmer

### Backend
- Node.js
- Express
- MongoDB / Mongoose
- Genius Lyrics API
- play-dl
- CORS
- dotenv

## Demo

| Home                                               | Lyrics                                              |
| -------------------------------------------------- | --------------------------------------------------- |
| <img src="demo/screen1.png" width="250" alt="Home screen" /> | <img src="demo/screen2.png" width="250" alt="Lyrics screen" /> |

## 📋 Project Structure

```
LyrixTube/
├── lyrix_tube_app/           # Flutter frontend
│   ├── lib/
│   │   ├── main.dart
│   │   ├── provider/          # app state
│   │   └── screen/            # UI screens
│   ├── android/
│   ├── ios/
│   └── pubspec.yaml
├── server/                   # Node.js backend
│   ├── Dockerfile
│   ├── .env.example
│   ├── index.js
│   ├── app.js
│   ├── config/db.js
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── models/
│   └── utils/
├── docker-compose.yml        # backend + MongoDB orchestration
└── README.md                 # this file
```

## 🚀 Getting Started

### Prerequisites

- Flutter 3.6.0+
- Node.js 14+
- npm or yarn
- Docker & Docker Compose (optional, recommended for backend)

### 1. Clone the repository

```bash
git clone https://github.com/AritraC1/LyrixTube.git
cd LyrixTube
```

### 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `server/.env` and set:

```env
PORT=3000
GENIUS_TOKEN=your_genius_api_key
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_mongo_super_secret_password
MONGO_INITDB_DATABASE=lyrixtube
MONGO_URI=mongodb://admin:your_mongo_super_secret_password@mongo:27017/your_database_name?authSource=admin
```

Start the backend locally:

```bash
npm start
```

The backend will run on `http://localhost:3000`.

### 3. Frontend setup

```bash
cd ../lyrix_tube_app
flutter pub get
flutter run
```

## 🐳 Docker Setup

The backend and MongoDB are orchestrated with Docker Compose.

### Start services

```bash
docker compose up --build -d
```

### Verify services

```bash
docker compose ps
curl http://localhost:3001/health
curl http://localhost:3001/db-health
```

### Stop services

```bash
docker compose down
```

## 🔌 API Endpoints

### Health

- `GET /health` — service health status
- `GET /db-health` — MongoDB connection status

### Lyrics

- `POST /api/generate-lyrics`

Request body:

```json
{
  "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

Success response:

```json
{
  "status": "success",
  "data": {
    "song": "Never Gonna Give You Up",
    "artist": "Rick Astley",
    "lyrics": "[Chorus]\nNever gonna give you up..."
  }
}
```

Error response:

```json
{
  "status": "error",
  "message": "..."
}
```

## 🧠 Backend behavior

- Validates YouTube video URLs using `play-dl`
- Extracts artist and song names from video titles
- Searches Genius for the best lyrics match
- Filters out junk or translation results
- Formats lyrics and caches them in MongoDB
- Increments `search_count` for repeated lookups

## 🧪 Testing

Run backend tests:

```bash
cd server
npm test
```

## 🔐 Environment variables

Copy `server/.env.example` to `server/.env` and configure values.

- `PORT` — backend port
- `GENIUS_TOKEN` — Genius API token
- `MONGO_URI` — MongoDB URI
- `MONGO_INITDB_ROOT_USERNAME` — MongoDB root user
- `MONGO_INITDB_ROOT_PASSWORD` — MongoDB root password
- `MONGO_INITDB_DATABASE` — database name

## 📁 Notes

- The Flutter app is not containerized in this repository.
- MongoDB is used for caching lyrics and improving repeated requests.
- Docker Compose maps host port `3001` to the backend container port `3000`.

---