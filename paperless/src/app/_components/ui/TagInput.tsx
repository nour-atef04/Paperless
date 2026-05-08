"use client";

import React, { useState, KeyboardEvent } from "react";
import toast from "react-hot-toast";

type TagInputProps = {
  initialTags?: string[];
  maxTags?: number;
  label: string;
  name: string; // "interests" or "tags"
  placeholder?: string;
};

export default function TagInput({
  initialTags = [],
  maxTags = 10,
  label,
  name,
  placeholder = "Press Enter to add...",
}: TagInputProps) {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  const remaining = maxTags - tags.length;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = inputValue.trim().toLowerCase();

      if (!value) return;

      if (tags.includes(value)) {
        toast.error("Already added!");
        return;
      }

      if (tags.length >= maxTags) {
        toast.error(`Maximum of ${maxTags} reached.`);
        return;
      }

      setTags([...tags, value]);
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span
          className={`text-xs font-medium ${
            remaining === 0 ? "text-red-500" : "text-brand-light"
          }`}
        >
          {remaining} remaining
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-brand/10 text-brand flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-brand-dark cursor-pointer rounded-full p-0.5 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        )}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={remaining === 0}
          placeholder={remaining === 0 ? "Limit reached" : placeholder}
          className="focus:border-brand focus:ring-brand w-full rounded-md border border-gray-200 p-2 text-sm focus:ring-1 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
        />

        {/* hidden inputs to send to FormData */}
        {tags.map((tag) => (
          <input key={tag} type="hidden" name={name} value={tag} />
        ))}
      </div>
    </div>
  );
}