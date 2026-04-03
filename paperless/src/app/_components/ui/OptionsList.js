"use client";

import { useOutsideClick } from "@/app/_hooks/useOutsideClick";

export default function OptionsList({ closeMenu, options }) {
  const ref = useOutsideClick(closeMenu);

  return (
    <div
      ref={ref}
      role="menu"
      className="bg-surface absolute top-10 right-3 z-10 flex gap-2 rounded-sm border border-gray-200 py-2 text-sm shadow"
    >
      {options.map((option, index) => (
        <button
          key={index}
          role="menuitem"
          className="text-brand z-10 w-full cursor-pointer rounded-sm px-4 text-left text-sm transition-colors hover:underline"
          onClick={(e) => {
            e.preventDefault();
            option.onClick();
            closeMenu();
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
