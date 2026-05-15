import { generatePracticeQuiz } from "@/app/_lib/actions";
import { getNoteById } from "@/app/_lib/data-service";
import PracticeClient from "@/app/_components/ui/PracticeClient";

export default async function PracticePage({ params, searchParams }) {
  // throw new Error("Testing error boundary!");
  const { id } = await params;

  const resolvedSearchParams = await searchParams;
  const count = Number(resolvedSearchParams?.count) || 3;
  const type = (resolvedSearchParams?.type as string) || "mixed";
  const focusArea = (resolvedSearchParams?.focusArea as string) || "";

  const { title, content } = await getNoteById(id);

  const questions = (await generatePracticeQuiz(content, {
    count,
    type,
    focusArea,
  })) as {
    id: string;
    type: "mcq" | "written";
    question: string;
    correctAnswerOrRubric: string;
    options?: string[];
  }[];

  return (
    <div className="mx-auto max-w-3xl py-8">
      <PracticeClient questions={questions} title={title} />
    </div>
  );
}
