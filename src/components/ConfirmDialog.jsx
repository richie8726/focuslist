import React from "react";

export default function ConfirmDialog({ open, title, description, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 bg-white dark:bg-zinc-900 rounded-lg p-5 w-full max-w-md shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-3 py-1 rounded bg-gray-100 dark:bg-zinc-800">Cancelar</button>
          <button onClick={onConfirm} className="px-3 py-1 rounded bg-red-500 text-white">Eliminar</button>
        </div>
      </div>
    </div>
  );
}
