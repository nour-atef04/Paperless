"use client";

import { useActionState } from "react";
import PanelTitle from "./PanelTitle";

// TO DO: HANDLE ERRORS

export default function NoteForm({ serverAction, note }) {
  const [state, formAction, isPending] = useActionState(serverAction, null);

  const editMode = !!note;

  return (
    <form
      action={formAction}
      className="bg-surface flex h-full flex-col rounded-md shadow-sm"
    >
      <PanelTitle level={1}>
        {editMode && <input type="hidden" name="note-id" value={note.id} />}
        <label htmlFor="new-note-title" className="sr-only">
          {editMode ? "Edit" : "New"} Note Title
        </label>
        <input
          defaultValue={editMode ? note.title : ""}
          required
          name="new-note-title"
          id="new-note-title"
          placeholder="Untitled Note"
          className="text-brand border-brand-light/20 placeholder:text-brand-light/40 focus-visible:border-brand-light w-full border-b bg-transparent p-6 text-4xl font-semibold transition-colors duration-200 focus-visible:outline-none"
        />
      </PanelTitle>
      <div className="flex-1">
        <label htmlFor="new-note-content" className="sr-only">
          {editMode ? "Edit" : "New"} Note Content
        </label>
        <textarea
          defaultValue={editMode ? note.content : ""}
          required
          name="new-note-content"
          id="new-note-content"
          placeholder="Start writing... (Markdown is supported! Use **bold**, *italics*, ## Subheadings)"
          className="placeholder:text-brand-light/40 h-full w-full resize-none bg-transparent p-6 text-lg leading-relaxed whitespace-pre-wrap focus-visible:outline-none"
        />
      </div>

      {/* {state?.message && (
        <p className="p-2 text-center text-sm text-red-500">{state.message}</p>
      )} */}

      <button
        type="submit"
        disabled={isPending}
        className={`${isPending ? "btn-disabled" : "btn-primary"} rounded-b-md p-3`}
      >
        {editMode
          ? isPending
            ? "Saving Changes..."
            : "Save Changes"
          : isPending
            ? "Posting Note..."
            : "Post Note"}
      </button>
    </form>
  );
}
