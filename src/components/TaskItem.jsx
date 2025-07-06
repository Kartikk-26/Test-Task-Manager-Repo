import React, { useState } from 'react';
import { Check, Trash2, Edit2 } from 'lucide-react';

export default function TaskItem({ task, onToggleComplete, onDeleteTask, onEditTask }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  return (
    <div className={`p-4 rounded-lg shadow border-l-4 ${task.completed ? 'border-green-500' : 'border-blue-500'} bg-white`}>
      <div className="flex justify-between items-start">
        <div className="flex gap-3">
          <button
            onClick={() => onToggleComplete(task.id)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
            }`}
          >
            {task.completed && <Check className="w-3 h-3" />}
          </button>
          <div>
            <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">Created: {formatDate(task.createdAt)}</p>
          </div>
        </div>

        {/* Edit and Delete Icons */}
        <div className="flex gap-2">
          <button
            onClick={() => onEditTask(task)}
            className="text-blue-500 hover:text-blue-700"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-red-500 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {confirmDelete && (
        <div className="mt-3 bg-red-50 p-3 rounded">
          <p className="text-sm text-red-700 mb-2">Confirm delete?</p>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="bg-red-600 text-white px-3 py-1 rounded mr-2"
          >
            Delete
          </button>
          <button
            onClick={() => setConfirmDelete(false)}
            className="bg-gray-500 text-white px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
