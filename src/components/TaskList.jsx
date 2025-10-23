import React, { useMemo } from "react";
import { Trash2 } from "lucide-react"; // 🗑️ Icono de tarro de basura

// Formatea una fecha ISO a formato local (ej: "23/10/2025")
function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString();
}

// Verifica si una fecha ya venció (comparando con hoy)
function isOverdue(dueDate) {
  if (!dueDate) return false;
  const today = new Date();
  const due = new Date(dueDate);
  // Ignora horas, compara solo la fecha (YYYY-MM-DD)
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

export default function TaskList({ tasks, toggleTask, deleteTask }) {
  // Ordenamos las tareas: primero las no completadas y con fecha más cercana
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // 1️⃣ Pendientes primero
      if (a.completed !== b.completed) return a.completed ? 1 : -1;

      // 2️⃣ Ordenar por fecha de vencimiento (las más cercanas arriba)
      const aDue = a.dueDate ? new Date(a.dueDate) : null;
      const bDue = b.dueDate ? new Date(b.dueDate) : null;

      if (aDue && bDue) return aDue - bDue;
      if (aDue) return -1;
      if (bDue) return 1;

      // 3️⃣ Si ninguna tiene fecha, ordenar por creación descendente
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks]);

  if (!sortedTasks.length) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 italic">
        No hay tareas para mostrar
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {sortedTasks.map((t) => {
        const vencida = isOverdue(t.dueDate);

        return (
          <li
            key={t.id}
            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/70 backdrop-blur-sm transition hover:shadow-md ${
              t.completed ? "opacity-70" : ""
            }`}
          >
            {/* Columna izquierda: checkbox + texto */}
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

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
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
                </div>
              </div>
            </div>

            {/* Botón eliminar */}
            <button
              onClick={() => deleteTask(t.id)}
              className="mt-2 sm:mt-0 sm:ml-3 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition"
              title="Eliminar tarea"
            >
              <Trash2 size={18} className="text-red-500" />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
