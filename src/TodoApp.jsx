import { useState } from "react";

function TodoApp() {
  const [tasks, setTasks] = useState([]); // lista de tareas
  const [newTask, setNewTask] = useState(""); // input para nueva tarea

  // Agregar tarea
  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    const task = {
      id: Date.now(),
      text: newTask,
      completed: false,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  };

  // Marcar como completada
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Eliminar tarea
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", textAlign: "center" }}>
      <h1>ToDo App ✅</h1>

      {/* Formulario */}
      <form onSubmit={addTask}>
        <input
          type="text"
          placeholder="Nueva tarea..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Agregar</button>
      </form>

      {/* Lista de tareas */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ margin: "8px 0" }}>
            <span
              onClick={() => toggleTask(task.id)}
              style={{
                textDecoration: task.completed ? "line-through" : "none",
                cursor: "pointer",
              }}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: "8px" }}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;
