import React from "react";

export default function CategorySelector({ onSelect }) {
  const categories = [
    { key: "", label: "Todas" },
    { key: "work", label: "💼 Trabajo" },
    { key: "home", label: "🏠 Casa" },
    { key: "personal", label: "🧠 Personal" },
  ];

  return (
    <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg rounded-xl p-4 shadow-md">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">Categorías</h3>
      <div className="flex flex-col gap-2">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => onSelect && onSelect(c.key)}
            className="text-left px-3 py-2 rounded-lg transition border border-transparent hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
