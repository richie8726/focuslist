import React, { useEffect, useState } from "react";

const BACKGROUND_KEY = "focuslist_background_v1";

const backgrounds = [
  {
    name: "Oficina minimalista",
    url: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Ambiente de trabajo cálido",
    url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Espacio moderno y ordenado",
    url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "Amanecer inspirador",
    url: "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function BackgroundSelector() {
  const [selected, setSelected] = useState(
    localStorage.getItem(BACKGROUND_KEY) || backgrounds[0].url
  );

  useEffect(() => {
    document.body.style.backgroundImage = `url("${selected}")`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.transition = "background-image 0.6s ease-in-out";
    localStorage.setItem(BACKGROUND_KEY, selected);
  }, [selected]);

  return (
    <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg rounded-xl p-4 shadow-md">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Fondos de enfoque
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
          </button>
        ))}
      </div>
    </div>
  );
}
