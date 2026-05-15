"use client";

import { generateNoteSummary } from "@/app/_lib/actions";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import toast from "react-hot-toast";
import { FaSpinner } from "react-icons/fa";
import { FaBrain, FaWandMagicSparkles } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";

type AIToolsPanelProps = {
  noteId: string;
  content: string;
  initialSummary?: string | null;
  isOwner: boolean;
};

export default function AIToolsPanel({
  noteId,
  content,
  initialSummary,
  isOwner,
}: AIToolsPanelProps) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isNavigating, startNavigation] = useTransition();

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

  const showSummarySection = initialSummary || isOwner;

  const handleQuizNavigation = () => {
    startNavigation(() => {
      router.push(`/notes/${noteId}/practice`);
    });
  };

  return (
    <div className="bg-brand-light/5 border-brand-light/20 mb-8 flex flex-col gap-4 rounded-xl border p-5">
      {/* --- AI SUMMARY --- */}
      {showSummarySection && (
        <>
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-brand-dark flex items-center gap-2 font-semibold">
                <FaWandMagicSparkles className="text-brand" />
                AI Summary
              </h3>

              <div className="flex items-center gap-3 sm:gap-4">
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
                        Generate{" "}
                        <span className="hidden sm:inline">AI Summary</span>
                      </>
                    )}
                  </button>
                )}

                {initialSummary && (
                  <>
                    {isOwner && (
                      <button
                        onClick={handleGenerate}
                        disabled={isPending}
                        className="text-brand-light hover:text-brand flex items-center gap-1 text-sm transition-colors hover:cursor-pointer disabled:opacity-50"
                      >
                        <span className={isPending ? "animate-spin" : ""}>
                          ↻
                        </span>
                        <span className="hidden underline sm:inline">
                          {isPending ? "Refreshing..." : "Refresh"}
                        </span>
                      </button>
                    )}
                    <button
                      onClick={() => setShowSummary(!showSummary)}
                      className="text-brand-light hover:text-brand text-sm underline transition-colors hover:cursor-pointer"
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
              <div className="animate-slide-up text-brand-dark prose prose-sm max-w-none text-sm">
                <ReactMarkdown>{initialSummary}</ReactMarkdown>
              </div>
            ) : null}
          </div>

          {/* --- DIVIDER --- */}
          <hr className="border-brand-light/20 my-1" />
        </>
      )}
      {/* --- PRACTICE QUIZ --- */}
      <div className="flex flex-col justify-between">
        <div className="flex justify-between">
          <h3 className="text-brand-dark flex items-center gap-2 font-semibold">
            <FaBrain className="text-brand" />
            Active Recall
          </h3>
          <button
            onClick={handleQuizNavigation}
            disabled={isNavigating}
            className="text-brand hover:bg-brand/10 border-brand-light flex items-center gap-2 rounded-md border px-3 py-1 text-sm font-medium transition-colors hover:cursor-pointer disabled:cursor-wait disabled:opacity-70"
          >
            {isNavigating ? (
              <>
                <FaSpinner className="animate-spin" />
                <span className="hidden md:block">Loading Quiz...</span>
              </>
            ) : (
              "Quiz Me"
            )}
          </button>
        </div>

        <p className="text-brand-light animate-slide-up mt-1 text-xs sm:text-sm">
          Test your knowledge with an AI-generated quiz based on this note.
        </p>
      </div>
    </div>
  );
}
