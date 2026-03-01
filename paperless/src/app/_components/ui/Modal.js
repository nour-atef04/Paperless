"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";

export default function Modal({ isOpen, onClose, title, children }) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef(null);

  // 1. Wait until the component is mounted on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const dialog = dialogRef.current;
    if (isOpen) {
      dialog?.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog?.close();
      document.body.style.overflow = "unset";
    }
  }, [isOpen, mounted]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) onClose();
  };

  // 2. Do not render anything on the server
  if (!mounted) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      className="bg-surface m-auto w-full max-w-[90vw] flex-col rounded-lg border-none p-0 shadow-2xl outline-none backdrop:bg-black/30 backdrop:backdrop-blur-xs open:flex md:max-w-lg"
    >
      <div className="border-brand-light/20 flex items-center justify-between border-b p-4">
        <h3 className="text-brand text-xl font-semibold">{title}</h3>
        <button onClick={onClose} className="text-brand p-1" aria-label="Close">
          <IoClose size={24} />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
    </dialog>,
    document.body,
  );
}
