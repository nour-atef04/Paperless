"use client";

import { useOutsideClick } from "@/app/_hooks/useOutsideClick";

export default function OptionsList({ className, closeMenu, options }) {
  const ref = useOutsideClick(closeMenu);

  return (
    <div
      ref={ref}
      role="menu"
      className={`${className} bg-surface absolute z-10 flex min-w-40 flex-col rounded-sm border border-gray-200 py-2 text-sm shadow`}
    >
      {options.map((option, index) => (
        <button
          key={index}
          role="menuitem"
          className="text-brand z-10 cursor-pointer rounded-sm px-4 text-left text-sm whitespace-nowrap transition-colors hover:underline"
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
