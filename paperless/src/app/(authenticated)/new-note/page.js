"use client";

import PanelTitle from "@/app/_components/ui/PanelTitle";
import { postNewNote } from "@/app/_lib/actions";
import { useActionState, useState } from "react";

export default function NewNotePage() {
  const [state, formAction, isPending] = useActionState(postNewNote, null);

  return (
    <form
      action={formAction}
      className="bg-surface flex h-full flex-col rounded-md shadow-sm"
    >
      <PanelTitle level={1}>
        <label htmlFor="new-note-title" className="sr-only">
          New Note Title
        </label>
        <input
          required
          name="new-note-title"
          id="new-note-title"
          placeholder="Untitled Note"
          className="border-brand-light/20 placeholder:text-brand-light/40 focus-visible:border-brand-light w-full border-b bg-transparent p-6 text-4xl font-semibold transition-colors duration-200 focus-visible:outline-none"
        />
      </PanelTitle>
      <div className="flex-1">
        <label htmlFor="new-note-content" className="sr-only">
          New Note Content
        </label>
        <textarea
          required
          name="new-note-content"
          id="new-note-content"
          placeholder="Start writing..."
          className="placeholder:text-brand-light/40 h-full w-full resize-none bg-transparent p-6 text-lg leading-relaxed focus-visible:outline-none"
        />
      </div>
      <button
        disabled={isPending}
        className={`${isPending ? "btn-disabled" : "btn-primary"} rounded-b-md p-3`}
      >
        Post Note
      </button>
    </form>
  );
}
