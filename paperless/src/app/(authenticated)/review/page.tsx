import Panel from "@/app/_components/ui/Panel";
import PanelTitle from "@/app/_components/ui/PanelTitle";
import PracticeClient from "@/app/_components/ui/PracticeClient";
import { getSavedQuestions } from "@/app/_lib/data-service";
import { Question } from "@/app/_lib/types";
import Link from "next/link";
import { FaBrain } from "react-icons/fa6";

// Helper function to randomly shuffle an array (for shuffling qns)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const metadata = {
  title: "Targeted Review",
};

export default async function ReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ noteId?: string; shuffle?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const { noteId } = resolvedSearchParams;

  const isShuffle = resolvedSearchParams?.shuffle === "true";

  const {
    formattedQuestions: questions,
    savedIds,
    availableNotes,
  } = await getSavedQuestions(noteId);

  const finalQuestions = isShuffle ? shuffleArray(questions) : questions;

  if (!finalQuestions || finalQuestions.length === 0) {
    return (
      <div className="mx-auto max-w-3xl py-12">
        <Panel className="flex flex-col items-center p-12 text-center">
          <div className="bg-brand-light/10 mb-4 rounded-full p-4">
            <FaBrain className="text-brand h-8 w-8" />
          </div>
          <PanelTitle level={2}>
            {noteId ? "No questions found!" : "You're all caught up!"}
          </PanelTitle>
          <p className="text-brand-light mt-2 mb-6">
            {noteId
              ? "You don't have any saved questions for this specific note."
              : "You don't have any saved questions to review right now."}{" "}
          </p>
          <Link
            href={noteId ? "/review" : "/"}
            className="btn-primary rounded-full px-6 py-2"
          >
            {noteId ? "Clear Filter" : "Go study some notes"}
          </Link>
        </Panel>
      </div>
    );
  }

  return (
    <PracticeClient
      mode="review"
      questions={finalQuestions}
      title="Targeted Review"
      initialSavedIds={savedIds}
      notes={availableNotes}
    />
  );
}
