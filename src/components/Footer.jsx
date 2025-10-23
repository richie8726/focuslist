export default function Footer({ count }) {
  return (
    <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
      <div>{count} tareas pendientes</div>
      <div className="text-xs">Focuslist • Hecho con ❤️ — Richie</div>
    </div>
  );
}
