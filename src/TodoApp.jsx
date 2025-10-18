import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskList from "./components/TaskList";
import Footer from "./components/Footer";

function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setTasks([
      ...tasks,
      { id: Date.now(), text: newTask, completed: false },
    ]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <Header />

        {/* Input */}
        <form onSubmit={addTask} className="flex mb-6">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Escribe una tarea..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded-r-lg hover:bg-blue-600 transition font-semibold"
          >
            +
          </button>
        </form>

        {/* Filtros */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilter("active")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              filter === "active" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
              filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Completadas
          </button>
        </div>

        {/* Lista de tareas */}
        <TaskList tasks={filteredTasks} toggleTask={toggleTask} deleteTask={deleteTask} />

        {/* Footer */}
        <Footer count={tasks.filter(t => !t.completed).length} />
      </div>
    </div>
  );
}

export default TodoApp;
