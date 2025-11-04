import React, { useMemo, useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString();
}

function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date();
  const due = new Date(dueDate);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export default function TaskList({ tasks, toggleTask, deleteTask, editTask }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editPriority, setEditPriority] = useState("");

  const priorityRank = { high: 3, medium: 2, low: 1, null: 0, undefined: 0 };

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const rankDiff =
        (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0);
      if (rankDiff !== 0) return rankDiff;

      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      const aDue = a.dueDate ? new Date(a.dueDate) : null;
      const bDue = b.dueDate ? new Date(b.dueDate) : null;

      if (aDue && bDue) return aDue - bDue;
      if (aDue) return -1;
      if (bDue) return 1;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks]);

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditText(t.text);
    setEditDate(t.dueDate ? t.dueDate.slice(0, 10) : "");
    setEditPriority(t.priority || "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditDate("");
    setEditPriority("");
  };

  const saveEdit = (id) => {
    editTask(id, {
      text: editText.trim() || "—",
      dueDate: editDate ? new Date(editDate).toISOString() : null,
      priority: editPriority || null,
    });
    cancelEdit();
  };

  if (!sortedTasks.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
        No hay tareas para mostrar
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      <AnimatePresence>
        {sortedTasks.map((t) => {
          const vencida = isOverdue(t.dueDate);
          const editing = editingId === t.id;

          return (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              layout
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/70 backdrop-blur-sm transition hover:shadow-md ${
                t.completed ? "opacity-70" : ""
              }`}
            >
              {editing ? (
                <div className="flex flex-col sm:flex-row gap-2 w-full items-center">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-grow px-2 py-1 rounded border dark:bg-zinc-900 dark:text-gray-100"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="px-2 py-1 rounded border dark:bg-zinc-900 dark:text-gray-100"
                  />
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="px-2 py-1 rounded border dark:bg-zinc-900 dark:text-gray-100"
                  >
                    <option value="">Prioridad</option>
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                  <button
                    onClick={() => saveEdit(t.id)}
                    className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-900/40"
                    title="Guardar"
                  >
                    <Check size={18} className="text-green-600" />
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40"
                    title="Cancelar"
                  >
                    <X size={18} className="text-red-600" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={t.completed}
                      onChange={() => toggleTask(t.id)}
                      className="h-5 w-5 accent-indigo-500 cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span
                        className={`text-base ${
                          t.completed
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : "text-gray-900 dark:text-gray-100"
                        }`}
                      >
                        {t.text}
                      </span>

                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2 items-center">
                        <span>Creada: {formatDate(t.createdAt)}</span>
                        {t.dueDate && (
                          <span
                            className={`${
                              vencida && !t.completed
                                ? "text-red-500 font-semibold"
                                : "text-indigo-500 dark:text-indigo-400"
                            }`}
                          >
                            {vencida && !t.completed ? "Vencida: " : "Vence: "}
                            {formatDate(t.dueDate)}
                          </span>
                        )}

                        {t.priority && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              t.priority === "high"
                                ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300"
                                : t.priority === "medium"
                                ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-300"
                                : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300"
                            }`}
                          >
                            {t.priority === "high"
                              ? "Alta"
                              : t.priority === "medium"
                              ? "Media"
                              : "Baja"}
                          </span>
                        )}

                        {t.category && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-50 dark:bg-zinc-900/40 text-gray-700 dark:text-gray-200">
                            {t.category === "work" ? "💼 Trabajo" : t.category === "home" ? "🏠 Casa" : "🧠 Personal"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1 mt-2 sm:mt-0 sm:ml-3">
                    <button
                      onClick={() => startEdit(t)}
                      className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
                      title="Editar tarea"
                    >
                      <Pencil size={18} className="text-indigo-500" />
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40"
                      title="Eliminar tarea"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </>
              )}
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
