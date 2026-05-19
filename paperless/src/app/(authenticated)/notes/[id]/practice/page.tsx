import { generatePracticeQuiz } from "@/app/_lib/actions";
import { getNoteById } from "@/app/_lib/data-service";
import PracticeClient from "@/app/_components/ui/PracticeClient";

import type { Metadata } from "next";
import { Question } from "@/app/_lib/types";
import PracticeClientLoader from "@/app/_components/ui/PracticeClientLoader";

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
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const { title, content } = await getNoteById(id);

  return (
    <div className="mx-auto max-w-3xl py-8">
      <PracticeClientLoader
        noteId={id}
        title={title}
        content={content}
        count={Number(resolvedSearchParams?.count) || 3}
        type={(resolvedSearchParams?.type as string) || "mixed"}
        focusArea={(resolvedSearchParams?.focusArea as string) || ""}
      />
    </div>
  );
}
