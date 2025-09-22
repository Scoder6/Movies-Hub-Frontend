# Movie Maze Feed

## Setup
1. Install dependencies:
```bash
npm install
```

2. Create `.env` file with these variables:
```
VITE_API_BASE_URL=http://localhost:5000
VITE_COOKIE_DOMAIN=localhost
VITE_COOKIE_SECURE=false
VITE_COOKIE_SAME_SITE=lax
```

3. Start development server:
```bash
npm run dev
```

## Deployment
This project is deployed at [https://movie-maze-feed.vercel.app](https://movie-maze-feed.vercel.app)

## Production Build
```bash
npm run build
npm run dev
```
