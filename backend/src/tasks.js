const express = require('express');
const { randomUUID } = require('crypto');
const db = require('./db');

const router = express.Router();

router.get('/', (_req, res) => {
  const rows = db.prepare('SELECT id, title FROM tasks').all();
  res.json(Object.fromEntries(rows.map(r => [r.id, r.title])));
});

router.post('/', (req, res) => {
  if (!req.body.title) return res.status(400).json({ error: 'Title is required' });
  const id = randomUUID().slice(0, 8);
  db.prepare('INSERT INTO tasks (id, title) VALUES (?, ?)').run(id, req.body.title);
  res.json({ id, title: req.body.title });
});

router.put('/:id', (req, res) => {
  if (!req.body.title) return res.status(400).json({ error: 'Title is required' });
  const result = db.prepare('UPDATE tasks SET title = ? WHERE id = ?').run(req.body.title, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Task not found' });
  res.json({ id: req.params.id, title: req.body.title });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  res.json({ deleted: req.params.id });
});

module.exports = router;
