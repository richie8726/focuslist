import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import CalendarPanel from "./components/CalendarPanel";
import BackgroundSelector from "./components/BackgroundSelector";
import CategorySelector from "./components/CategorySelector";
import StatsPanel from "./components/StatsPanel";
import ConfirmDialog from "./components/ConfirmDialog";
import {
  initFirebase,
  enableCloudSync,
  disableCloudSync,
  startCloudSync,
  stopCloudSync,
  pushTasksToCloud,
} from "../firebase";

const STORAGE_KEY = "focuslist_tasks_v1";
const SYNC_KEY = "focuslist_cloud_sync_v1";

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  const [confirmState, setConfirmState] = useState({ open: false, id: null });
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(SYNC_KEY)) || false;
    } catch {
      return false;
    }
  });

  // Init firebase (if user configured src/firebase.js)
  useEffect(() => {
    initFirebase(); // no-ops if not configured
  }, []);

  // persist local
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    // If cloud sync is enabled, push to cloud
    if (cloudSyncEnabled) {
      pushTasksToCloud(tasks).catch((e) => {
        console.warn("Cloud push failed:", e);
      });
    }
  }, [tasks, cloudSyncEnabled]);

  // cloud sync toggle
  useEffect(() => {
    localStorage.setItem(SYNC_KEY, JSON.stringify(cloudSyncEnabled));
    if (cloudSyncEnabled) {
      startCloudSync(setTasks);
    } else {
      stopCloudSync();
    }
  }, [cloudSyncEnabled]);

  const addTask = (e) => {
    e?.preventDefault();
    if (!newTask.trim()) return;
    const now = new Date();
    const item = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: now.toISOString(),
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      priority: priority || null,
      category: category || null,
    };
    setTasks((s) => [item, ...s]);
    setNewTask("");
    setDueDate("");
    setPriority("");
    setCategory("");
  };

  const toggleTask = (id) =>
    setTasks((s) =>
      s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id) => setTasks((s) => s.filter((t) => t.id !== id));

  const editTask = (id, updates) =>
    setTasks((s) => s.map((t) => (t.id === id ? { ...t, ...updates } : t)));

  const counts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let list = tasks;
    if (filter === "active") list = list.filter((t) => !t.completed);
    if (filter === "completed") list = list.filter((t) => t.completed);
    if (selectedDate) {
      list = list.filter((t) => {
        const d = t.dueDate || t.createdAt;
        if (!d) return false;
        const iso = new Date(d).toISOString().slice(0, 10);
        return iso === selectedDate;
      });
    }
    return list;
  }, [tasks, filter, selectedDate]);

  // Confirm deletion modal helpers
  const askDelete = (id) => setConfirmState({ open: true, id });
  const confirmDelete = () => {
    deleteTask(confirmState.id);
    setConfirmState({ open: false, id: null });
  };
  const cancelDelete = () => setConfirmState({ open: false, id: null });

  // Cloud sync enable/disable
  const toggleCloudSync = async () => {
    if (!cloudSyncEnabled) {
      try {
        await enableCloudSync();
        setCloudSyncEnabled(true);
      } catch (e) {
        console.error("Could not enable cloud sync:", e);
        alert("No se pudo habilitar la sincronización en la nube. Revisá src/firebase.js y la configuración de Firebase.");
      }
    } else {
      disableCloudSync();
      setCloudSyncEnabled(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <section className="md:col-span-2">
        <div className="rounded-2xl shadow-lg overflow-hidden bg-image-overlay p-6">
          <Header />

          {/* Formulario */}
          <form
            onSubmit={addTask}
            className="flex flex-col md:flex-row gap-2 mt-4 mb-4"
          >
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              type="text"
              placeholder="Agregar una nueva tarea..."
              className="flex-grow p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              type="date"
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
            >
              <option value="">Prioridad</option>
              <option value="low">Baja 🟢</option>
              <option value="medium">Media 🟡</option>
              <option value="high">Alta 🔴</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
            >
              <option value="">Categoría</option>
              <option value="work">💼 Trabajo</option>
              <option value="home">🏠 Casa</option>
              <option value="personal">🧠 Personal</option>
            </select>

            <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-sm hover:scale-105 transition">
              Añadir
            </button>
          </form>

          {/* Contadores y filtros */}
          <div className="mb-4 flex flex-wrap gap-2 items-center">
            <div className="text-sm px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800">
              Total: <strong>{counts.total}</strong>
            </div>
            <div className="text-sm px-3 py-1 rounded bg-yellow-100 dark:bg-yellow-900/30">
              Pendientes: <strong>{counts.pending}</strong>
            </div>
            <div className="text-sm px-3 py-1 rounded bg-green-100 dark:bg-green-900/30">
              Completadas: <strong>{counts.completed}</strong>
            </div>

            <div className="ml-auto flex items-center gap-2">
              {["all", "active", "completed"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilter(type);
                    setSelectedDate(null);
                  }}
                  className={`px-3 py-1 rounded ${
                    filter === type
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 dark:bg-zinc-700"
                  }`}
                >
                  {type === "all"
                    ? "Todas"
                    : type === "active"
                    ? "Pendientes"
                    : "Completadas"}
                </button>
              ))}

              <button
                onClick={toggleCloudSync}
                className={`px-3 py-1 rounded border ${
                  cloudSyncEnabled ? "bg-green-100 dark:bg-green-900/30" : "bg-gray-100 dark:bg-zinc-700"
                }`}
                title="Sincronizar en la nube (Firebase)"
              >
                {cloudSyncEnabled ? "Sincronización: ON" : "Sincronización: OFF"}
              </button>
            </div>
          </div>

          <TaskList
            tasks={filteredTasks}
            toggleTask={toggleTask}
            deleteTask={(id) => askDelete(id)}
            editTask={editTask}
          />
          <Footer count={counts.pending} />
        </div>
      </section>

      <aside className="md:col-span-1 space-y-4">
        <CalendarPanel
          tasks={tasks}
          onSelectDate={(dateStr) => setSelectedDate(dateStr)}
          clearSelection={() => setSelectedDate(null)}
        />
        <CategorySelector onSelect={(c) => { /* opcional: podrías filtrar por categoría */ }} />
        <StatsPanel tasks={tasks} />
      </aside>

      <ConfirmDialog
        open={confirmState.open}
        title="Eliminar tarea"
        description="¿Estás seguro que querés eliminar esta tarea? Esta acción no se puede deshacer."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
