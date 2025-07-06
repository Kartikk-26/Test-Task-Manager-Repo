// Load tasks for a specific user
export const loadTasks = (username) => {
  if (!username) return [];
  try {
    const data = localStorage.getItem(`tasks_${username}`);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load tasks:', error);
    return [];
  }
};

// Save tasks for a specific user
export const saveTasks = (username, tasks) => {
  if (!username) return;
  try {
    localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks:', error);
  }
};

// Optional: remove tasks for a specific user (e.g. on logout)
export const clearUserTasks = (username) => {
  try {
    localStorage.removeItem(`tasks_${username}`);
  } catch (error) {
    console.error('Failed to clear user tasks:', error);
  }
};
