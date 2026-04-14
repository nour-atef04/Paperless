import { useEffect, useRef } from "react";

export function useOutsideClick<T extends HTMLElement = HTMLElement>(handler: ()=>void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      // if click, and the click was NOT inside referenced element
      // "as Node" since contains requires a DOM Node
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handler();
      }
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [handler]);

  return ref;
}