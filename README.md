# Space Travel Chatbot

A Node/Express backend and React frontend that provides a space-themed chat experience with pill-shaped message bubbles, orbiting planets, quick-reply chips, message actions (copy/delete/regenerate/like/dislike), and click-to-speak playback for bot replies.

## Project Structure
- `backend/` – Express server exposing `POST /chat`
- `frontend/` – React app with chat UI and styles

## Prerequisites
- Node.js 18+
- Modern browser (Chrome recommended)

## Quick Start
### Install
```bash
# backend
cd backend
npm install

# frontend
cd ../frontend
npm install
```

### Run
```bash
# start backend (http://localhost:5000)
cd backend
npm start

# start frontend (http://localhost:3000)
cd ../frontend
npm start
```

Open `http://localhost:3000`.

## Environment
The frontend calls `http://localhost:5000/chat`. Change it in `frontend/src/ChatBox.js` if needed.

## Features
- Pill bubbles, multi-line wrapping
- Animated space background
- Auto-scroll, hidden scrollbar
- Emoji sanitization of bot replies
- Long-reply trimming
- Actions on bot messages:
  - 📋 Copy
  - 🗑️ Delete
  - ♻️ Regenerate (re-ask last user query)
  - 🔊 Speak (plays once per click)
  - 👍/👎 Feedback with counters and active color
- Quick-reply chips

## Build
```bash
# frontend build (if configured)
cd frontend
npm run build
```

## Deploy
- Deploy frontend to Netlify/Vercel; backend to Render/Heroku/Fly.
- Update the fetch URL in the frontend to your deployed API.

## License
MIT
