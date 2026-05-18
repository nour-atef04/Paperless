import { generatePracticeQuiz } from "@/app/_lib/actions";
import { getNoteById } from "@/app/_lib/data-service";
import PracticeClient from "@/app/_components/ui/PracticeClient";

import type { Metadata } from "next";
import { Question } from "@/app/_lib/types";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  const note = await getNoteById(id);

  if (!note) {
    return { title: "Note Not Found" };
  }

  return {
    title: `Practice: ${note.title}`,
    description: `Practice ${note.title} on Paperless.`,
  };
}

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
  })) as Question[];

  return (
    <div className="mx-auto max-w-3xl py-8">
      <PracticeClient noteId={id} questions={questions} title={title} />
    </div>
  );
}
