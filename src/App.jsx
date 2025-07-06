import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import { loadTasks, saveTasks } from './utils/localStorage';
import { Moon, Sun } from 'lucide-react';

export default function App() {
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // 🌙 Apply theme on initial load and on theme change
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // 📥 Load tasks for the logged-in user
  useEffect(() => {
    if (username) {
      const userTasks = loadTasks(username);
      setTasks(userTasks);
    }
  }, [username]);

  // 💾 Save tasks to localStorage
  useEffect(() => {
    if (username) {
      saveTasks(username, tasks);
    }
  }, [tasks, username]);

  // 🔔 Deadline reminder (runs every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const updatedTasks = tasks.map(task => {
        if (task.deadline && !task.alerted) {
          const deadline = new Date(task.deadline);
          const timeLeft = deadline - now;
          if (timeLeft > 0 && timeLeft <= 15 * 60 * 1000) {
            alert(`Reminder: Task "${task.title}" is due soon!`);
            return { ...task, alerted: true };
          }
        }
        return task;
      });
      setTasks(updatedTasks);
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

  // 👋 Logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername(null);
    setTasks([]);
  };

  // ➕ Add new task
  const handleAddTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
      alerted: false,
    };
    setTasks(prev => [newTask, ...prev]);
    setShowForm(false);
  };

  // ✅ Toggle task complete
  const handleToggleComplete = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // 🗑️ Delete task
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // ✏️ Update task
  const handleUpdateTask = (id, updatedData) => {
    setTasks(prev =>
      prev.map(task => task.id === id ? { ...task, ...updatedData } : task)
    );
    setEditingTask(null);
    setShowForm(false);
  };

  // 🖊️ Edit task (block if completed)
  const handleEditTask = (task) => {
    if (task.completed) {
      alert("You can't edit a completed task.");
      return;
    }
    setEditingTask(task);
    setShowForm(true);
  };

  const taskCounts = {
    all: tasks.length,
    pending: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length,
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && task.completed) ||
      (filter === 'pending' && !task.completed);

    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (!username) return <Login onLogin={setUsername} />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="container mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Welcome, {username}</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(prev => (prev === 'light' ? 'dark' : 'light'))}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800 transition"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        <button
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => {
            setEditingTask(null);
            setShowForm(true);
          }}
        >
          + Add New Task
        </button>

        {showForm && (
          <TaskForm
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onCancel={() => {
              setShowForm(false);
              setEditingTask(null);
            }}
            editingTask={editingTask}
          />
        )}

        <TaskFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          taskCounts={taskCounts}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      </div>
    </div>
  );
}
