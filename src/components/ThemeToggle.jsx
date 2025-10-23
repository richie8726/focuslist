export default function ThemeToggle({ dark, setDark }) {
  return (
    <button onClick={() => setDark(!dark)} className="p-2 rounded-full bg-gray-100 dark:bg-zinc-800">
      {dark ? '🌙' : '☀️'}
    </button>
  )
}
