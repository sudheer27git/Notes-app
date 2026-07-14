# Corkboard — a full-stack notes app

A sticky-note / corkboard style notes app. React (via JSX, compiled in the browser with Babel standalone — no build step) on the frontend, talking to a small Express + JSON-file backend for persistence.

## Stack
- **Backend:** Node.js, Express, notes stored in `data/notes.json`
- **Frontend:** HTML, CSS, React (JSX) served as static files from `public/`

## Run it

```bash
npm install
npm start
```

Then open **http://localhost:3000**.

Notes are saved to `data/notes.json` on the server, so they persist across restarts.

## API

| Method | Path             | Description        |
|--------|------------------|---------------------|
| GET    | /api/notes       | List all notes      |
| POST   | /api/notes       | Create a note        |
| PUT    | /api/notes/:id   | Update a note (title, body, color, pinned) |
| DELETE | /api/notes/:id   | Delete a note        |

## Features
- Create, edit, delete, pin, and color-tag notes
- Search across titles and bodies
- Pinned notes always float to the top
- Masonry-style board layout, responsive down to mobile
