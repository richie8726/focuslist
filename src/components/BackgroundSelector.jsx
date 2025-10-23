import React, { useEffect, useState } from "react";

const BACKGROUND_KEY = "focuslist_background_v1";

const backgrounds = [
  {
    name: "Minimalista claro",
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Oscuro elegante",
    url: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Bosque relajante",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Atardecer cálido",
    url: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80",
  },
];


export default function BackgroundSelector() {
  const [selected, setSelected] = useState(
    localStorage.getItem(BACKGROUND_KEY) || backgrounds[0].url
  );

  useEffect(() => {
    // Aplica la imagen de fondo directamente al body
    document.body.style.backgroundImage = `url("${selected}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.transition = "background-image 0.6s ease-in-out";
    localStorage.setItem(BACKGROUND_KEY, selected);
  }, [selected]);

  return (
    <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg rounded-xl p-4 shadow-md mt-6">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Fondo de la lista
      </h3>
      <div className="flex flex-col gap-2">
        {backgrounds.map((bg) => (
          <button
            key={bg.url}
            onClick={() => setSelected(bg.url)}
            className={`text-left px-3 py-2 rounded-lg transition border ${
              selected === bg.url
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30"
                : "border-transparent hover:bg-gray-100 dark:hover:bg-zinc-700"
            }`}
          >
            <div className="font-medium text-gray-800 dark:text-gray-100">
              {bg.name}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {bg.url.split("/")[2]}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
