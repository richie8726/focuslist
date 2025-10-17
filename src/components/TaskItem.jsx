function TaskItem({ text, done }) {
  return (
    <li
      className={`flex items-center justify-between p-3 rounded-lg shadow-sm mb-2
        ${done ? "bg-green-100 text-green-800 line-through" : "bg-white"}
      `}
    >
      <span>{text}</span>
      <button className="text-sm text-red-500 hover:text-red-700 transition">
        ❌
      </button>
    </li>
  )
}

export default TaskItem
