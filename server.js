const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'data', 'notes.json');
const COLORS = ['yellow', 'mint', 'pink', 'blue', 'peach'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readNotes() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeNotes(notes) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

// GET all notes
app.get('/api/notes', (req, res) => {
  const notes = readNotes().sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.updatedAt - a.updatedAt;
  });
  res.json(notes);
});

// CREATE a note
app.post('/api/notes', (req, res) => {
  const { title = '', body = '', color } = req.body;
  const notes = readNotes();
  const now = Date.now();
  const note = {
    id: crypto.randomUUID(),
    title: title.trim(),
    body: body || '',
    color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
  notes.push(note);
  writeNotes(notes);
  res.status(201).json(note);
});

// UPDATE a note
app.put('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const idx = notes.findIndex(n => n.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Note not found' });

  const { title, body, color, pinned } = req.body;
  const existing = notes[idx];
  const updated = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    body: body !== undefined ? body : existing.body,
    color: color !== undefined ? color : existing.color,
    pinned: pinned !== undefined ? pinned : existing.pinned,
    updatedAt: Date.now(),
  };
  notes[idx] = updated;
  writeNotes(notes);
  res.json(updated);
});

// DELETE a note
app.delete('/api/notes/:id', (req, res) => {
  const notes = readNotes();
  const filtered = notes.filter(n => n.id !== req.params.id);
  if (filtered.length === notes.length) return res.status(404).json({ error: 'Note not found' });
  writeNotes(filtered);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Notes app running at http://localhost:${PORT}`);
});
