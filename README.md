# Space Travel Chatbot

A Node/Express backend and React frontend that provides a space-themed chat experience with pill-shaped message bubbles, orbiting planets, quick-reply chips, message actions (copy/delete/regenerate/like/dislike), and click-to-speak playback for bot replies.

## Project Structure
- `backend/` – Express server exposing `POST /chat`
- `frontend/` – React app with chat UI and styles


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

## Features
- Pill bubbles, multi-line wrapping
- Animated space background
- Emoji sanitization of bot replies
- Actions on bot messages:
  - 📋 Copy
  - 🗑️ Delete
  - ♻️ Regenerate (re-ask last user query)
  - 🔊 Speak (plays once per click)
  - 👍/👎 Feedback with counters and active color
- Quick-reply chips
