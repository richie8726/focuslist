import React, { useState, useEffect } from "react";
import TodoApp from "./TodoApp";

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem("darkMode");
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className="min-h-screen transition-colors duration-500 bg-transparent flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
            FocusList
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:scale-105 transition-transform"
          >
            {darkMode ? "🌞 Día" : "🌙 Noche"}
          </button>
        </header>
        <main>
          <TodoApp />
        </main>
      </div>
    </div>
  );
}
