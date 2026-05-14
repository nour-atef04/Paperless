"use client";

import { useState, useTransition } from "react";
import Panel from "@/app/_components/ui/Panel";
import PanelTitle from "@/app/_components/ui/PanelTitle";
import { gradeWrittenAnswer } from "@/app/_lib/actions";

type Question = {
  id: string;
  type: "mcq" | "written";
  question: string;
  options?: string[];
  correctAnswerOrRubric: string;
};

export default function PracticeClient({
  questions,
  title,
}: {
  questions: Question[];
  title: string;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    score?: number;
    text: string;
    isCorrect: boolean;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const currentQ = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  const handleSubmit = () => {
    if (!userAnswer) return;

    if (currentQ.type === "mcq") { 
      const correct = currentQ.correctAnswerOrRubric;

      // match exact text OR resolve a letter like A, B,... to the option at that index
      const resolvedCorrect =
        /^[A-D]$/.test(correct) && currentQ.options
          ? currentQ.options[correct.charCodeAt(0) - 65] // "A"->0, "B"->1, etc
          : correct;

      // correct mcq instantly
      const isCorrect = userAnswer === resolvedCorrect;
      setFeedback({
        isCorrect,
        text: isCorrect
          ? "Correct! Great job."
          : `Incorrect. The right answer was: ${resolvedCorrect}`,
      });
    } else {
      // send written answer to ai again
      startTransition(async () => {
        const result = await gradeWrittenAnswer(
          currentQ.question,
          userAnswer,
          currentQ.correctAnswerOrRubric,
        );
        setFeedback({
          score: result.score,
          isCorrect: result.isPassing,
          text: result.feedback,
        });
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    setUserAnswer("");
    setCurrentIndex((prev) => prev + 1);
  };

  if (isFinished) {
    return (
      <Panel className="p-8 text-center">
        <PanelTitle level={2}>Quiz Complete! 🎉</PanelTitle>
        <p className="text-brand-light mt-4">
          You&apos;ve finished the practice session for {title}.
        </p>
      </Panel>
    );
  }

  return (
    <Panel className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <PanelTitle level={2}>Practice: {title}</PanelTitle>
        <span className="text-brand text-sm font-medium">
          Question {currentIndex + 1} of {questions.length}
        </span>
      </div>

      <div className="bg-brand-light/5 mb-6 rounded-lg p-5">
        <p className="text-brand-dark text-lg font-medium">
          {currentQ.question}
        </p>
      </div>

      {/* --- MCQ INTERFACE --- */}
      {currentQ.type === "mcq" && (
        <div className="flex flex-col gap-3">
          {currentQ.options?.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                userAnswer === opt
                  ? "border-brand bg-brand/5"
                  : "border-brand-light/20 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="mcq-answer"
                value={opt}
                checked={userAnswer === opt}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={!!feedback}
                className="text-brand accent-brand h-4 w-4"
              />
              <span className="text-sm">{opt}</span>
            </label>
          ))}
        </div>
      )}

      {/* --- WRITTEN INTERFACE --- */}
      {currentQ.type === "written" && (
        <textarea
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          disabled={!!feedback || isPending}
          placeholder="Type your answer here..."
          className="border-brand-light/20 focus:border-brand focus:ring-brand min-h-37.5 w-full rounded-lg border p-4 text-sm focus:ring-1 focus:outline-none disabled:opacity-50"
        />
      )}

      {/* --- FEEDBACK AREA --- */}
      {feedback && (
        <div
          className={`mt-6 rounded-lg p-4 ${feedback.isCorrect ? "border border-green-200 bg-green-50" : "border border-red-200 bg-red-50"}`}
        >
          <h4
            className={`font-bold ${feedback.isCorrect ? "text-green-800" : "text-red-800"}`}
          >
            {currentQ.type === "written"
              ? `AI Score: ${feedback.score}/100`
              : feedback.isCorrect
                ? "Correct!"
                : "Needs Review"}
          </h4>
          <p
            className={`mt-1 text-sm ${feedback.isCorrect ? "text-green-700" : "text-red-700"}`}
          >
            {feedback.text}
          </p>
        </div>
      )}

      {/* --- CONTROLS --- */}
      <div className="mt-8 flex justify-end">
        {!feedback ? (
          <button
            onClick={handleSubmit}
            disabled={!userAnswer || isPending}
            className="bg-brand hover:bg-brand-light rounded-full px-6 py-2 text-sm font-medium text-white transition-all hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Grading..." : "Submit Answer"}
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="bg-brand hover:bg-brand-light rounded-full px-6 py-2 text-sm font-medium text-white transition-all hover:cursor-pointer"
          >
            Next Question →
          </button>
        )}
      </div>
    </Panel>
  );
}
