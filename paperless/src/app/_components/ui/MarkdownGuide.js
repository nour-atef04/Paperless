"use client";

import { useState } from "react";
import { FaInfoCircle, FaTimes } from "react-icons/fa";
import Modal from "./Modal";

export default function MarkdownGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-brand-light hover:text-brand focus-visible:ring-brand flex cursor-pointer items-center justify-center rounded-full p-2 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        aria-expanded={isOpen}
        aria-label="Open Markdown Formatting Guide"
      >
        <FaInfoCircle />
        {/* <span>Formatting Guide</span> */}
      </button>

      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          isOpen={isOpen}
          title="Markdown Guide"
        >
          <ul className="text-brand-light space-y-2 text-sm">
            <li>
              <strong>**Bold**</strong> &rarr;{" "}
              <span className="text-brand font-bold">Bold</span>
            </li>
            <li>
              <em>*Italic*</em> &rarr;{" "}
              <span className="text-brand italic">Italic</span>
            </li>
            <li>
              ~~Strikethrough~~ &rarr;{" "}
              <span className="text-brand line-through">Strikethrough</span>
            </li>
            <li>
              ## Subheading &rarr;{" "}
              <span className="text-brand text-base font-bold">Subheading</span>
            </li>
            <li>
              &gt; Quote &rarr;{" "}
              <span className="border-brand border-l-2 pl-1 italic">Quote</span>
            </li>
            <li>- List item &rarr; &bull; List item</li>
            <li>
              [Link](url) &rarr;{" "}
              <span className="text-blue-500 underline">Link</span>
            </li>
          </ul>
        </Modal>
      )}
    </>
  );
}
