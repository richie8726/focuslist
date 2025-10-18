import TaskItem from "./TaskItem";

const tasks = [
  { id: 1, text: "Terminar FocusList", done: false },
  { id: 2, text: "Hacer deploy en GitHub Pages", done: false },
];

function TaskList() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Tus Tareas</h2>
      <ul className="space-y-3">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
