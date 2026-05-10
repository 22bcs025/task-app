const express = require('express');
const cors = require('cors');
const { router: authRouter, authenticate } = require('./auth');
const tasksRouter = require('./tasks');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRouter);
app.use('/tasks', authenticate, tasksRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API running on :${PORT}`));

module.exports = app;
