import TaskItem from "./TaskItem"

function TaskList() {
  const tasks = [
    { id: 1, text: "Aprender React ⚛️", done: false },
    { id: 2, text: "Configurar Tailwind 🎨", done: true },
    { id: 3, text: "Construir FocusList ✅", done: false },
  ]

  return (
    <main className="max-w-md mx-auto mt-8 p-4">
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task.id} text={task.text} done={task.done} />
        ))}
      </ul>
    </main>
  )
}

export default TaskList
