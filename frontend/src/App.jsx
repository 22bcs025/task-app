import { useState } from 'react';

function useSnack() {
  const [snack, setSnack] = useState(null);
  function show(msg, type = 'info') {
    setSnack({ msg, type });
    setTimeout(() => setSnack(null), 3000);
  }
  return [snack, show];
}

function Snackbar({ snack }) {
  if (!snack) return null;
  return <div className={`snack snack-${snack.type}`}>{snack.msg}</div>;
}

export default function App() {
  const [token, setToken] = useState('');
  const [tasks, setTasks] = useState([]);
  const [mode, setMode] = useState('register');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [newTask, setNewTask] = useState('');
  const [snack, showSnack] = useSnack();

  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };

  async function register() {
    if (password !== confirm) return showSnack('Passwords do not match', 'error');
    const res = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return showSnack(data.error, 'error');
    showSnack('Registered! Please log in.', 'success');
    setMode('login');
  }

  async function login() {
    const res = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) return showSnack(data.error, 'error');
    setToken(data.token);
    loadTasks(data.token);
  }

  async function loadTasks(t = token) {
    const res = await fetch('/tasks', { headers: { Authorization: `Bearer ${t}` } });
    const data = await res.json();
    setTasks(Object.entries(data).map(([id, title]) => ({ id, title })));
  }

  async function addTask() {
    if (!newTask.trim()) return;
    const res = await fetch('/tasks', {
      method: 'POST', headers: authHeaders,
      body: JSON.stringify({ title: newTask }),
    });
    const task = await res.json();
    setTasks(ts => [...ts, task]);
    setNewTask('');
    showSnack('Task added', 'success');
  }

  async function updateTask(id, title) {
    if (!title.trim()) return showSnack('Title cannot be empty', 'error');
    const res = await fetch(`/tasks/${id}`, {
      method: 'PUT', headers: authHeaders,
      body: JSON.stringify({ title }),
    });
    if (!res.ok) return showSnack('Update failed', 'error');
    setTasks(ts => ts.map(t => t.id === id ? { ...t, title } : t));
    showSnack('Task updated', 'success');
  }

  async function deleteTask(id) {
    await fetch(`/tasks/${id}`, { method: 'DELETE', headers: authHeaders });
    setTasks(ts => ts.filter(t => t.id !== id));
    showSnack('Task deleted', 'info');
  }

  if (!token) return (
    <div className="shell">
      <Snackbar snack={snack} />
      <header><h1>tasks</h1></header>
      <div className="card">
        <p className="label">username</p>
        <input value={username} onChange={e => setUsername(e.target.value)}
          placeholder="username" onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? login() : register())} />
        <p className="label">password</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="password" onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? login() : register())} />
        {mode === 'register' && <>
          <p className="label">confirm password</p>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
            placeholder="password" onKeyDown={e => e.key === 'Enter' && register()} />
        </>}
        <button className="primary" onClick={mode === 'login' ? login : register}>
          {mode === 'login' ? 'login' : 'register'}
        </button>
        <button className="link center" onClick={() => setMode(m => m === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'no account? register' : 'have an account? login'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="shell">
      <Snackbar snack={snack} />
      <header>
        <h1>tasks</h1>
        <button className="link" onClick={() => { setToken(''); setTasks([]); }}>logout</button>
      </header>
      {tasks.map(t => (
        <div key={t.id} className="task-row">
          <input
            className="task-edit"
            defaultValue={t.title}
            onBlur={e => e.target.value !== t.title && updateTask(t.id, e.target.value)}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
          />
          <button className="del" onClick={() => deleteTask(t.id)}>×</button>
        </div>
      ))}
      {tasks.length === 0 && <div className="empty">no tasks yet</div>}
      <div className="add-row">
        <input value={newTask} onChange={e => setNewTask(e.target.value)}
          placeholder="new task…" onKeyDown={e => e.key === 'Enter' && addTask()} />
        <button className="primary sq" onClick={addTask}>+</button>
      </div>
    </div>
  );
}
