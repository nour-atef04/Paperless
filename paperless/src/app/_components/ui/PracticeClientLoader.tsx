"use client";
import { useEffect, useState } from "react";
import { generatePracticeQuiz } from "@/app/_lib/actions";
import PracticeClient from "./PracticeClient";
import Panel from "./Panel";
import PanelTitle from "./PanelTitle";
import type { Question } from "@/app/_lib/types";

export default function PracticeClientLoader({
  noteId,
  title,
  content,
  count,
  type,
  focusArea,
}) {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = () => {
    setQuestions(null);
    setError(null);
    generatePracticeQuiz(content, { count, type, focusArea })
      .then(setQuestions)
      .catch(() => setError("Failed to generate quiz. Please try again."));
  };

  useEffect(() => {
    fetchQuiz();
  }, [count, type, focusArea]); // handles both initial load AND settings changes

  if (error)
    return (
      <Panel className="p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchQuiz}
          className="bg-brand mt-4 rounded-full px-6 py-2 text-sm text-white"
        >
          Retry
        </button>
      </Panel>
    );

  if (!questions)
    return (
      <Panel className="p-8 text-center">
        <PanelTitle level={2}>Generating your quiz</PanelTitle>
        <p className="text-brand-light mt-4 text-sm">
          Hang tight, building questions from your notes.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="bg-brand h-2 w-2 animate-bounce rounded-full"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </Panel>
    );

  return (
    <PracticeClient
      key={`${count}-${type}-${focusArea}`}
      mode="practice-new"
      noteId={noteId}
      questions={questions}
      title={title}
    />
  );
}
