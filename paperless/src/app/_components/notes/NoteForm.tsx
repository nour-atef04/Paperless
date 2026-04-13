"use client";

import { useActionState, useEffect } from "react";
import PanelTitle from "../ui/PanelTitle";
import MarkdownGuide from "../ui/MarkdownGuide";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Note, NoteWithDetails } from "@/app/_lib/types";
import { ActionResponse } from "@/app/_lib/actions";

type NoteFormProps = {
  serverAction: (
    prevState: ActionResponse | null,
    formData: FormData,
  ) => Promise<ActionResponse>;
  note?: Note;
};

export default function NoteForm({ serverAction, note }: NoteFormProps) {
  const [state, formAction, isPending] = useActionState(serverAction, null);
  const router = useRouter();
  const editMode = !!note;

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
    } else if (state.success) {
      toast.success(editMode ? "Note updated!" : "Note created!");
      if (state.redirectTo) {
        router.push(state.redirectTo);
      }
    }
  }, [state, editMode, router]);

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
      <div className="relative flex flex-1 flex-col">
        <label htmlFor="new-note-content" className="sr-only">
          {editMode ? "Edit" : "New"} Note Content
        </label>
        <textarea
          defaultValue={editMode ? note.content : ""}
          required
          name="new-note-content"
          id="new-note-content"
          placeholder="Start writing... (Try **bold** or *italics*)"
          className="placeholder:text-brand-light/40 h-full w-full resize-none bg-transparent px-10 py-6 text-lg leading-relaxed whitespace-pre-wrap focus-visible:outline-none"
        />
        {/* {state?.message && (
          <span className="p-4 text-center text-sm text-red-700">
            {state.message}
          </span>
        )} */}
        <div className="absolute right-4 bottom-4 z-10">
          <MarkdownGuide />
        </div>
      </div>

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
