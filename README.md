# task-app

Ultra simple task manager with JWT authentication and tests.

## Run

```bash
docker compose up --build
```

Open http://localhost:5173. Register an account, then add and delete tasks.

## Dev mode

```bash
# backend
cd backend && npm install && npm start

# frontend (separate terminal)
cd frontend && npm install && npm run dev
```

## Structure

```
backend/
  src/db.js         - SQLite setup, creates tables on first run
  src/auth.js       - register and login routes, JWT middleware
  src/tasks.js      - task CRUD routes
  src/index.js      - Express app entry point
  src/auth.test.js  - Jest tests for the auth endpoints
  Dockerfile        - builds the backend image

frontend/
  src/App.jsx     - UI: register, login, task list
  src/global.css  - styles
  src/main.jsx    - React entry point
  vite.config.js  - dev proxy to backend
  Dockerfile      - builds and serves the frontend via Nginx
  nginx.conf      - serves static files, proxies /auth and /tasks

.github/workflows/ci.yml - runs tests then builds Docker images
docker-compose.yml       - wires backend and frontend, mounts DB volume
```

## Screenshots

Screenshots of the API and browser UI can be found in the [screenshots](screenshots/) dir.
