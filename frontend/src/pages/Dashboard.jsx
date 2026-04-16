import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import TaskForm from "../components/TaskForm";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const priorityConfig = {
  High:   { color: "bg-red-500/20 text-red-400 border-red-500/30",    dot: "bg-red-400" },
  Medium: { color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-400" },
  Low:    { color: "bg-green-500/20 text-green-400 border-green-500/30",  dot: "bg-green-400" },
};

const TaskCard = ({ task, handleDelete, setEditTask, toggleComplete, dark }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isOverdue = !task.completed && task.dueDate && new Date(task.dueDate) < new Date();
  const p = priorityConfig[task.priority] || priorityConfig.Low;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group rounded-2xl border p-4 mb-3 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 ${
        dark
          ? "bg-slate-800/80 border-slate-700 hover:border-indigo-500/50"
          : "bg-white border-slate-200 hover:border-indigo-300 shadow-sm"
      } ${task.completed ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <div
          {...attributes}
          {...listeners}
          className="mt-1 cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 transition"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 6a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm8-16a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4zm0 8a2 2 0 110-4 2 2 0 010 4z"/>
          </svg>
        </div>

        <button
          onClick={() => toggleComplete(task)}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
            task.completed ? "bg-indigo-600 border-indigo-600" : "border-slate-500 hover:border-indigo-400"
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm truncate ${task.completed ? "line-through" : ""} ${dark ? "text-white" : "text-slate-800"}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className={`text-xs mt-0.5 truncate ${dark ? "text-slate-400" : "text-slate-500"}`}>{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${p.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${p.dot}`}></span>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                isOverdue
                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : dark ? "bg-slate-700 text-slate-400 border-slate-600" : "bg-slate-100 text-slate-500 border-slate-200"
              }`}>
                {isOverdue ? "⚠ " : "📅 "}
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => setEditTask(task)}
            className={`p-1.5 rounded-lg transition ${dark ? "hover:bg-slate-700 text-slate-400 hover:text-indigo-400" : "hover:bg-slate-100 text-slate-400 hover:text-indigo-600"}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(task._id)}
            className={`p-1.5 rounded-lg transition ${dark ? "hover:bg-slate-700 text-slate-400 hover:text-red-400" : "hover:bg-slate-100 text-slate-400 hover:text-red-500"}`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color, dark }) => (
  <div className={`rounded-2xl p-4 border ${dark ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
    <p className={`text-xs font-medium uppercase tracking-wide ${dark ? "text-slate-400" : "text-slate-500"}`}>{label}</p>
    <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/tasks");
      setTasks(Array.isArray(res.data) ? res.data : res.data.tasks ?? []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError("Failed to load tasks. Please refresh.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const addTaskToUI = (task) => setTasks((prev) => [task, ...prev]);
  const updateTaskInUI = (updated) => setTasks((prev) => prev.map((t) => t._id === updated._id ? updated : t));

  const handleDelete = async (id) => {
    await api.delete(`/api/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const toggleComplete = async (task) => {
    const res = await api.put(`/api/tasks/${task._id}`, { ...task, completed: !task.completed });
    updateTaskInUI(res.data);
  };

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return;
    setTasks((items) => {
      const oldIndex = items.findIndex((t) => t._id === active.id);
      const newIndex = items.findIndex((t) => t._id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const filteredTasks = tasks.filter((task) => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "completed") return task.completed && matchSearch;
    if (filter === "pending") return !task.completed && matchSearch;
    if (filter === "overdue") return !task.completed && new Date(task.dueDate) < new Date() && matchSearch;
    return matchSearch;
  });

  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const filters = ["all", "pending", "completed", "overdue"];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-slate-900" : "bg-slate-50"}`}>
      {/* Navbar */}
      <nav className={`border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 backdrop-blur-md ${
        dark ? "bg-slate-900/80 border-slate-800" : "bg-white/80 border-slate-200"
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className={`font-bold text-lg ${dark ? "text-white" : "text-slate-800"}`}>TaskFlow</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-xl border transition ${dark ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"}`}
          >
            {dark ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          <button
            onClick={() => { localStorage.removeItem("token"); navigate("/login"); }}
            className={`px-3 py-2 rounded-xl border text-xs font-medium transition ${dark ? "bg-slate-800 border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500/40" : "bg-slate-100 border-slate-200 text-slate-600 hover:text-red-500"}`}
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>Loading tasks...</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <StatCard label="Total" value={tasks.length} color={dark ? "text-white" : "text-slate-800"} dark={dark} />
              <StatCard label="Completed" value={completed} color="text-green-400" dark={dark} />
              <StatCard label="Pending" value={pending} color="text-yellow-400" dark={dark} />
              <StatCard label="Overdue" value={overdue} color="text-red-400" dark={dark} />
            </div>

            {/* Progress Bar */}
            {tasks.length > 0 && (
              <div className={`rounded-2xl border p-4 mb-6 ${dark ? "bg-slate-800/60 border-slate-700" : "bg-white border-slate-200 shadow-sm"}`}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-600"}`}>Overall Progress</span>
                  <span className="text-sm font-bold text-indigo-400">{progress}%</span>
                </div>
                <div className={`w-full h-2 rounded-full ${dark ? "bg-slate-700" : "bg-slate-200"}`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Task Form */}
            <TaskForm
              addTaskToUI={addTaskToUI}
              updateTaskInUI={updateTaskInUI}
              editTask={editTask}
              setEditTask={setEditTask}
              dark={dark}
            />

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  placeholder="Search tasks..."
                  onChange={(e) => setSearch(e.target.value)}
                  className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition ${
                    dark
                      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500"
                      : "bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400"
                  }`}
                />
              </div>
              <div className="flex gap-1.5">
                {filters.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize transition ${
                      filter === f
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : dark
                        ? "bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
                        : "bg-white border border-slate-200 text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Task List */}
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={filteredTasks.map((t) => t._id)} strategy={verticalListSortingStrategy}>
                {filteredTasks.length === 0 ? (
                  <div className={`text-center py-16 rounded-2xl border ${dark ? "border-slate-800 text-slate-500" : "border-slate-200 text-slate-400"}`}>
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-sm font-medium">No tasks found</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      handleDelete={handleDelete}
                      setEditTask={setEditTask}
                      toggleComplete={toggleComplete}
                      dark={dark}
                    />
                  ))
                )}
              </SortableContext>
            </DndContext>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
