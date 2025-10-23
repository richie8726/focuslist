import React, { useMemo, useState } from "react";

/**
 * props:
 * - tasks: array
 * - onSelectDate(dateStr) : dateStr = 'YYYY-MM-DD'
 * - clearSelection()
 */

function isoDate(iso) {
  if (!iso) return null;
  return new Date(iso).toISOString().slice(0, 10);
}

export default function CalendarPanel({ tasks = [], onSelectDate, clearSelection }) {
  // build counts by date (using dueDate if present, else createdAt)
  const dateCounts = useMemo(() => {
    const map = {};
    tasks.forEach(t => {
      const key = isoDate(t.dueDate || t.createdAt);
      if (!key) return;
      map[key] = (map[key] || 0) + 1;
    });
    // convert to array sorted by date desc
    return Object.keys(map)
      .sort((a, b) => b.localeCompare(a))
      .map(d => ({ date: d, count: map[d] }));
  }, [tasks]);

  const [picker, setPicker] = useState("");

  const onPick = (e) => {
    const v = e.target.value; // yyyy-mm-dd
    setPicker(v);
    if (v) onSelectDate(v);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Calendario</h3>
        <button onClick={clearSelection} className="text-xs text-gray-500 dark:text-gray-400">
          Limpiar
        </button>
      </div>

      <input
        type="date"
        value={picker}
        onChange={onPick}
        className="w-full mb-3 px-3 py-2 rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
      />

      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        Fechas con tareas:
      </div>

      <ul className="text-sm space-y-2 max-h-40 overflow-auto">
        {dateCounts.length === 0 && (
          <li className="text-gray-500">No hay fechas</li>
        )}
        {dateCounts.map((d) => (
          <li key={d.date} className="flex items-center justify-between">
            <button
              onClick={() => {
                setPicker(d.date);
                onSelectDate(d.date);
              }}
              className="text-left"
            >
              <div className="font-medium text-gray-800 dark:text-gray-100">
                {new Date(d.date).toLocaleDateString()}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {d.count} tarea(s)
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
