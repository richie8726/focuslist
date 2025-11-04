import React, { useMemo } from "react";

/**
 * Muestra estadísticas simples: tareas totales, completadas,
 * completadas por día (últimos 7), y porcentaje de completadas.
 * No necesita librería externa.
 */

function lastNDays(n) {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

export default function StatsPanel({ tasks }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

    // completadas por día últimos 7
    const days = lastNDays(7);
    const perDay = days.map((day) => {
      const count = tasks.filter((t) => {
        if (!t.createdAt) return false;
        const created = new Date(t.createdAt).toISOString().slice(0, 10);
        return created === day && t.completed;
      }).length;
      return { day, count };
    });

    return { total, completed, pct, perDay };
  }, [tasks]);

  return (
    <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg rounded-xl p-4 shadow-md">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Estadísticas</h3>
      <div className="text-sm text-gray-700 dark:text-gray-200 mb-2">
        <div>Total: <strong>{stats.total}</strong></div>
        <div>Completadas: <strong>{stats.completed}</strong> ({stats.pct}%)</div>
      </div>

      <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300">
        {stats.perDay.map((d) => (
          <div key={d.day} className="flex items-center gap-2">
            <div className="w-20">{d.day}</div>
            <div className="flex-1 bg-gray-200 dark:bg-zinc-700 rounded-full h-2">
              <div style={{ width: `${Math.min(100, d.count * 20)}%` }} className="bg-indigo-500 h-2 rounded-full" />
            </div>
            <div className="w-8 text-right">{d.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
