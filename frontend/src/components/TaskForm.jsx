import React, { useState, useEffect } from "react";
import api from '../api/axios';

const TaskForm = ({ addTaskToUI, updateTaskInUI, editTask, setEditTask, dark }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setPriority(editTask.priority);
      setDueDate(editTask.dueDate?.substring(0, 10));
    }
  }, [editTask]);

  const handleSubmit = async () => {
    try {
      if (!title) return setError("Title is required");
      setError("");
      if (editTask) {
        const res = await api.put(`/api/tasks/${editTask._id}`, { title, description, priority, dueDate });
        updateTaskInUI(res.data);
        setEditTask(null);
      } else {
        const res = await api.post("/api/tasks", { title, description, priority, dueDate });
        addTaskToUI(res.data);
      }
      setTitle(""); setDescription(""); setDueDate(""); setPriority("Low");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  const inputClass = `w-full border rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition text-sm ${
    dark
      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
      : "bg-white border-slate-300 text-slate-800 placeholder-slate-400"
  }`;

  return (
    <div className={`border rounded-2xl p-5 mb-6 ${dark ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
      <h3 className={`font-semibold text-base mb-4 flex items-center gap-2 ${dark ? "text-white" : "text-slate-800"}`}>
        <span className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-xs">
          {editTask ? "✎" : "+"}
        </span>
        {editTask ? "Edit Task" : "New Task"}
      </h3>

      <div className="grid grid-cols-1 gap-3">
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl px-3 py-2 text-xs">
            {error}
          </div>
        )}
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={inputClass}
        />
        <div className="grid grid-cols-2 gap-3">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={inputClass}
          >
            <option value="Low">🟢 Low</option>
            <option value="Medium">🟡 Medium</option>
            <option value="High">🔴 High</option>
          </select>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl transition text-sm shadow-lg shadow-indigo-500/20"
          >
            {editTask ? "Update Task" : "Add Task"}
          </button>
          {editTask && (
            <button
              onClick={() => { setEditTask(null); setTitle(""); setDescription(""); setDueDate(""); setPriority("Low"); }}
              className={`px-4 rounded-xl transition text-sm ${dark ? "bg-slate-700 hover:bg-slate-600 text-slate-300" : "bg-slate-100 hover:bg-slate-200 text-slate-600"}`}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
