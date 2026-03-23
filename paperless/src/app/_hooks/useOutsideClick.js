import { useEffect, useRef } from "react";

export function useOutsideClick(handler) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      // if click, and the click was NOT inside referenced element
      if (ref.current && !ref.current.contains(e.target)) {
        handler();
      }
    }

    function handleKeyDown(e) {
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