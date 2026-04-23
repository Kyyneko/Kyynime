# 🎌 Kyynime

**Your Anime Paradise** — A modern, feature-rich anime & manga discovery platform built with React and the Jikan API.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Jikan API](https://img.shields.io/badge/Jikan_API-v4-25c2a0)](https://jikan.moe/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔍 **Anime Search** | Search any anime from the MyAnimeList database |
| ⭐ **Top Anime** | Browse the highest-rated anime of all time |
| 📅 **Seasonal Anime** | Discover what's airing this season |
| 📖 **Manga Explorer** | Search and browse top manga with detailed info |
| 👥 **Character Database** | Explore popular characters with voice actor details |
| 🎭 **People** | Discover voice actors and staff *(coming soon)* |
| 🎲 **Random** | Get random anime/manga recommendations *(coming soon)* |
| 📱 **Responsive Design** | Fully responsive UI — works on mobile, tablet, and desktop |
| 🌙 **Dark Mode** | Sleek dark theme with gradient accents |

## 🖼️ Screenshots

> *Run the app locally to see it in action!*

## 🛠️ Tech Stack

### Frontend
- **React 19** — UI library with hooks
- **Vite 7** — Lightning-fast build tool with HMR
- **Tailwind CSS 4** — Utility-first CSS framework
- **Axios** — HTTP client for API requests

### API
- **[Jikan API v4](https://jikan.moe/)** — Unofficial MyAnimeList REST API

### DevOps
- **Docker** — Multi-stage build with Nginx for production
- **Nginx** — Reverse proxy & static file server
- **Docker Compose** — Orchestration for frontend + backend services

## 📁 Project Structure

```
Kyynime/
├── docker-compose.yml        # Docker orchestration
├── frontend/
│   ├── Dockerfile            # Multi-stage build (Node → Nginx)
│   ├── nginx.conf            # Nginx config with SPA support & API proxy
│   ├── index.html            # Entry HTML
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx          # React entry point
│       ├── App.jsx           # Main app with view routing
│       ├── index.css         # Global styles & theme variables
│       ├── App.css           # Legacy component styles
│       ├── services/
│       │   └── api.js        # Jikan API service with rate-limiting queue
│       └── components/
│           ├── Navbar.jsx        # Navigation bar (desktop + mobile)
│           ├── SearchBar.jsx     # Anime search input
│           ├── AnimeCard.jsx     # Anime grid card
│           ├── AnimeDetail.jsx   # Anime detail modal
│           ├── AnimeSection.jsx  # Anime section layout
│           ├── MangaCard.jsx     # Manga grid card
│           ├── MangaDetail.jsx   # Manga detail modal
│           ├── MangaSection.jsx  # Manga section with search
│           ├── CharacterCard.jsx    # Character grid card
│           ├── CharacterDetail.jsx  # Character detail modal
│           └── CharacterSection.jsx # Character section with search
└── myenv/                    # Python virtual environment (gitignored)
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Docker** & **Docker Compose** *(optional, for containerized deployment)*

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kyyneko/Kyynime.git
   cd Kyynime
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the dev server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

2. **Access the app**
   ```
   http://localhost:80
   ```

## ⚙️ API Rate Limiting

Kyynime implements a **custom request queue** to respect the Jikan API rate limits (~3 requests/second). All API calls are automatically queued and throttled with a 350ms delay between requests to prevent `429 Too Many Requests` errors.

## 🎨 Design System

The app uses a custom dark theme with the following color palette:

| Token | Color | Usage |
|-------|-------|-------|
| `--color-primary` | `#3b82f6` | Primary actions, links |
| `--color-accent` | `#10b981` | Success states, highlights |
| `--color-accent-orange` | `#f59e0b` | Warnings, ratings |
| `--color-dark` | `#0a0e27` | Main background |
| `--color-dark-light` | `#151b3d` | Navbar, elevated surfaces |
| `--color-dark-card` | `#1e2749` | Card backgrounds |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available for personal and educational use.

## 👤 Author

**Kyyneko** — [@Kyyneko](https://github.com/Kyyneko)

---

<div align="center">

Made with ❤️ and ☕ by **Kyyneko**

⭐ Star this repo if you find it useful!

</div>
