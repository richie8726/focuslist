function TaskItem({ task, toggleTask, deleteTask }) {
  return (
    <li className="flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition px-4 py-3 rounded-lg mb-2">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={()=> toggleTask(task.id)}
          className="h-4 w-4 accent-blue-500 cursor-pointer"
        />
        <span className={ task.completed ? "line-through text-gray-400" : "text-gray-800" }>
          {task.text}
        </span>
      </div>
      <button
        onClick={()=> deleteTask(task.id)}
        className="text-red-500 hover:text-red-700 transition"
      >
        ✕
      </button>
    </li>
  );
}

export default TaskItem;
