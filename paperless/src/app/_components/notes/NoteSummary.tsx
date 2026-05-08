"use client";

import { useState, useTransition } from "react";
import { generateNoteSummary } from "@/app/_lib/actions";
import toast from "react-hot-toast";
import { FaWandMagicSparkles } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";

type NoteSummaryProps = {
  noteId: string;
  content: string;
  initialSummary?: string | null;
  isOwner: boolean;
};

export default function NoteSummary({
  noteId,
  content,
  initialSummary,
  isOwner,
}: NoteSummaryProps) {
  const [isPending, startTransition] = useTransition();
  const [showSummary, setShowSummary] = useState(true);

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generateNoteSummary(noteId, content);

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Summary generated!");
      }
    });
  };

  if (!initialSummary && !isOwner) return null;

  return (
    <div className="bg-brand-light/5 border-brand-light/20 mb-8 rounded-xl border p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-brand-dark flex items-center gap-2 font-semibold">
          <FaWandMagicSparkles className="text-brand" />
          AI Summary
        </h3>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* "Generate" on mobile, "Generate AI Summary" on desktop */}
          {!initialSummary && isOwner && (
            <button
              onClick={handleGenerate}
              disabled={isPending}
              className="text-brand hover:bg-brand/10 rounded-md px-3 py-1 text-sm font-medium transition-colors hover:cursor-pointer disabled:opacity-50"
            >
              {isPending ? (
                "Generating..."
              ) : (
                <>
                  Generate <span className="hidden sm:inline">AI Summary</span>
                </>
              )}
            </button>
          )}

          {initialSummary && (
            <>
              {/* "↻" on mobile, "↻ Refresh" on desktop (only for owners) */}
              {isOwner && (
                <button
                  onClick={handleGenerate}
                  disabled={isPending}
                  className="text-brand-light hover:text-brand flex items-center gap-1 text-sm transition-colors hover:cursor-pointer disabled:opacity-50"
                  aria-label="Refresh summary"
                >
                  <span className={isPending ? "animate-spin" : ""}>↻</span>
                  <span className="hidden underline sm:inline">
                    {isPending ? "Refreshing..." : "Refresh"}
                  </span>
                </button>
              )}
              
              {/* "Show/Hide" on mobile, "Show/Hide summary" on desktop */}
              <button
                onClick={() => setShowSummary(!showSummary)}
                className="text-brand-light hover:text-brand text-sm underline transition-colors hover:cursor-pointer"
                aria-controls="summary-content"
              >
                {showSummary ? "Hide" : "Show"}{" "}
                <span className="hidden sm:inline">summary</span>
              </button>
            </>
          )}
        </div>
      </div>

      {!initialSummary ? (
        <p className="text-brand-light text-sm italic">
          {isPending
            ? "The AI is reading your note..."
            : "No summary generated yet."}
        </p>
      ) : showSummary ? (
        <div
          id="summary-content"
          className="animate-slide text-brand-dark prose prose-sm max-w-none text-sm"
        >
          <ReactMarkdown>{initialSummary}</ReactMarkdown>
        </div>
      ) : null}
    </div>
  );
}
