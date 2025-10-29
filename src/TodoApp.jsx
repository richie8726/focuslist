import React, { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";
import CalendarPanel from "./components/CalendarPanel";
import BackgroundSelector from "./components/BackgroundSelector";

const STORAGE_KEY = "focuslist_tasks_v1";

function formatISOToLocalDate(iso) {
  if (!iso) return "";
  const dt = new Date(iso);
  return dt.toLocaleDateString();
}

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
  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);

  // Guardar tareas
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

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
    };
    setTasks((s) => [item, ...s]);
    setNewTask("");
    setDueDate("");
  };

  const toggleTask = (id) =>
    setTasks((s) =>
      s.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const deleteTask = (id) => setTasks((s) => s.filter((t) => t.id !== id));

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 🧾 Panel principal */}
      <section className="md:col-span-2">
        <div className="rounded-2xl shadow-lg overflow-hidden bg-image-overlay p-6">
          <Header />

          {/* Formulario */}
          <form onSubmit={addTask} className="flex gap-2 mt-4 mb-4">
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

            <div className="ml-auto flex gap-2">
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
            </div>
          </div>

          <TaskList
            tasks={filteredTasks}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
          <Footer count={counts.pending} />
        </div>
      </section>

      {/* 📅 Lateral: calendario + fondos */}
      <aside className="md:col-span-1 space-y-4">
        <CalendarPanel
          tasks={tasks}
          onSelectDate={(dateStr) => setSelectedDate(dateStr)}
          clearSelection={() => setSelectedDate(null)}
        />
        <BackgroundSelector />
      </aside>
    </div>
  );
}
