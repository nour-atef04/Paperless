"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";

import { MAX_INTERESTS, MAX_TAGS } from "./constants";
import { ActionResponse, FolderType, Question } from "./types";

import { z } from "zod";

export async function loginAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Please enter email and password" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true, redirectTo: "/" };
}

export async function signUpAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const firstName = formData.get("firstName")?.toString() || "";
  const lastName = formData.get("lastName")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  const previousFields = { firstName, lastName, email };

  if (!email || !password || !firstName || !lastName) {
    return { error: "Please fill out all fields.", fields: previousFields };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", fields: previousFields };
  }

  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { error: signUpError.message, fields: previousFields };
  }

  if (!authData.user) {
    return {
      error: "An unknown error occurred during sign up.",
      fields: previousFields,
    };
  }

  const fullName = `${firstName} ${lastName}`;

  const { error: insertError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    full_name: fullName,
  });

  if (insertError) {
    console.error("Profile creation error:", insertError);
    return {
      error: "Account created, but profile setup failed.",
      fields: previousFields,
    };
  }

  return { success: true, redirectTo: "/" };
}

export async function logoutAction() {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/login");
}

export async function toggleSaveNote(
  noteId: string,
): Promise<ActionResponse | boolean> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to save notes." };

  const { data, error: fetchError } = await supabase
    .from("user_saves")
    .select("*")
    .match({ user_id: user.id, note_id: noteId })
    .maybeSingle();
  if (fetchError) {
    return { error: fetchError.message };
  }

  let wasSaved: boolean;

  if (!data) {
    const { error: insertError } = await supabase
      .from("user_saves")
      .insert({ user_id: user.id, note_id: noteId });

    if (insertError) {
      return { error: insertError.message };
    } else {
      wasSaved = false;
    }
  } else {
    const { error: deleteError } = await supabase
      .from("user_saves")
      .delete()
      .match({ user_id: user.id, note_id: noteId });
    if (deleteError) {
      return { error: deleteError.message };
    } else {
      wasSaved = true;
    }
  }

  revalidatePath("/notes");
  revalidatePath("/saved");
  return wasSaved;
}

export async function postNewNote(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  const title = formData.get("new-note-title")?.toString();
  const content = formData.get("new-note-content")?.toString();

  const tags = formData
    .getAll("tags")
    .map((tag) => tag.toString().trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  if (tags.length > MAX_TAGS) {
    return {
      error: `notes can only have a maximum of ${MAX_TAGS} tags.`,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to add notes." };

  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: user.id, title, content, tags })
    .select();

  if (error) {
    return { error: error.message };
  }

  const noteId = data?.[0]?.id;
  if (!noteId) return { error: "Failed to retrieve the new note ID." };

  revalidatePath("/notes");
  return { success: true, redirectTo: `/notes/${noteId}` };
}

export async function deleteNote(noteId: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("notes")
    .delete()
    .match({ id: noteId, user_id: user.id });
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  return { success: true, redirectTo: "/my-notes" };
}

export async function editNote(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  const id = formData.get("note-id")?.toString();
  const title = formData.get("new-note-title")?.toString();
  const content = formData.get("new-note-content")?.toString();

  const tags = formData
    .getAll("tags")
    .map((tag) => tag.toString().trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  if (tags.length > MAX_TAGS) {
    return {
      error: `notes can only have a maximum of ${MAX_TAGS} tags.`,
    };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to edit notes." };

  const { error } = await supabase
    .from("notes")
    .update({ title, content, tags })
    .match({ id: id, user_id: user.id })
    .select();

  if (error) return { error: error.message };

  revalidatePath("/notes");
  revalidatePath(`/notes/${id}`);
  // redirect(`/notes/${id}`);
  return { success: true, redirectTo: `/notes/${id}` };
}

export async function createFolder(
  folderName: string,
  folderType: FolderType = "personal",
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to create a new folder." };

  const { error } = await supabase
    .from("folders")
    .insert([{ name: folderName, user_id: user.id, folder_type: folderType }]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-notes");

  return { success: true };
}

export async function deleteFolder(folderId: string): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to delete a folder." };

  const { error } = await supabase.from("folders").delete().eq("id", folderId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-notes");
  return { success: true };
}

export async function renameFolder(
  id: string,
  name: string,
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to rename a folder." };

  const { error } = await supabase
    .from("folders")
    .update({ name })
    .match({ id: id, user_id: user.id });

  if (error) return { error: error.message };

  revalidatePath("/my-notes");
  return { success: true };
}

export async function moveNote(
  noteId: string,
  newFolderId: string,
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to move a note." };

  const { error } = await supabase
    .from("notes")
    .update({ folder_id: newFolderId })
    .eq("id", noteId);

  if (error) return { error: error.message };

  revalidatePath("/my-notes");
  revalidatePath("/notes");
  return { success: true };
}

export async function moveSavedNote(
  noteId: string,
  newFolderId: string,
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to move a note." };

  const { error } = await supabase
    .from("user_saves")
    .update({ folder_id: newFolderId })
    .eq("note_id", noteId);

  if (error) return { error: error.message };

  revalidatePath("/saved");
  revalidatePath("/notes");
  return { success: true };
}

export async function copyNote(
  noteId: string,
  newFolderId: string,
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to copy a note." };

  // fetch original note
  const { data: originalNote, error: fetchError } = await supabase
    .from("notes")
    .select("*")
    .eq("id", noteId)
    .single();

  if (fetchError || !originalNote) return { error: "Original note not found." };

  // take out id and created_at to add new ones
  const { id, created_at, ...noteDataToCopy } = originalNote;

  // insert duplicate
  const { error: insertError } = await supabase.from("notes").insert({
    ...noteDataToCopy,
    folder_id: newFolderId,
    title: `${originalNote.title} (Copy)`,
  });

  if (insertError) return { error: insertError.message };

  revalidatePath("/my-notes");
  revalidatePath("/notes");
  return { success: true };
}

export async function updateProfileAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to edit profile." };

  const fullName = formData.get("fullName") as string;
  const avatarFile = formData.get("avatar") as File | null;

  const interestsArray = formData
    .getAll("interests")
    .map((interest) => interest.toString().trim())
    .filter((interest) => interest.length > 0);

  if (interestsArray.length > MAX_INTERESTS) {
    return {
      error: `You can only have a maximum of ${MAX_INTERESTS} interests.`,
    };
  }

  let avatarUrl = undefined;

  // if a new avatar was selected
  if (avatarFile && avatarFile.size > 0) {
    // create unique file name
    const fileExtension = avatarFile.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExtension}`;

    // upload to the 'avatars' bucket
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile, { upsert: true });

    if (uploadError) throw new Error("Failed to upload image");

    // get the public URL for the uploaded image
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(fileName);

    avatarUrl = publicUrl;
  }

  const updatePayload: any = { full_name: fullName, interests: interestsArray };
  if (avatarUrl) {
    updatePayload.avatar_url = avatarUrl;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", user.id);

  if (updateError) throw new Error("Failed to update profile");
  return { success: true };
}

export async function toggleNoteVisibility(
  noteId: string,
  makePublic: boolean,
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to toggle visibility." };

  // if making public -> generate summary for all to see
  if (makePublic) {
    const { data: note, error: fetchError } = await supabase
      .from("notes")
      .select("content, summary")
      .eq("id", noteId)
      .single();

    if (fetchError) throw new Error("Failed to fetch note details.");

    if (note && !note.summary) {
      await generateNoteSummary(noteId, note.content);
    }
  }

  const { error } = await supabase
    .from("notes")
    .update({ public: makePublic })
    .eq("id", noteId)
    .eq("user_id", user.id);
  if (error) return { error: "Failed to update visibility." };

  revalidatePath("/my-notes");
  revalidatePath("/dashboard");
  revalidatePath("/profile/[id]", "page");

  return { success: true };
}

export async function toggleFolderVisibility(
  folderId: string,
  makePublic: boolean,
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to toggle visibility." };

  const { error } = await supabase
    .from("folders")
    .update({ public: makePublic })
    .eq("id", folderId)
    .eq("user_id", user.id);
  if (error) return { error: "Failed to update visibility." };

  revalidatePath("/my-notes");
  revalidatePath("/dashboard");
  revalidatePath("/profile/[id]", "page");

  return { success: true };
}

// initialize the AI SDK
const openrouter = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY!, // ! for non-null assertion
});

export async function generateNoteSummary(noteId: string, content: string) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return { error: "Not authorized" };

    // don't summarize tiny notes
    if (content.length < 100) {
      return { error: "Note is too short to summarize." };
    }

    // call the AI Model
    const { text } = await generateText({
      model: openrouter("openai/gpt-oss-120b:free"),
      prompt: `Summarize the following note into concise, actionable bullet points. Keep it brief.\n\nNote content:\n${content}`,
    });

    const { error: dbError } = await supabase
      .from("notes")
      .update({ summary: text })
      .eq("id", noteId)
      .eq("user_id", user.id);

    if (dbError) throw new Error(dbError.message);

    revalidatePath(`/notes/${noteId}`);

    return { success: true, summary: text };
  } catch (error) {
    console.error("AI Summarization failed:", error);
    return { error: "Failed to generate summary. Please try again." };
  }
}

// const MODELS = [
//   "openrouter/free",
//   "deepseek/deepseek-chat-v3-0324:free",
//   "meta-llama/llama-3.3-70b-instruct:free",
// ];

// const MODELS = ["openai/gpt-oss-20b:free"];
const MODELS = [
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "openai/gpt-oss-20b:free",
  "openrouter/free",
];

// const GRADING_MODELS = ["google/gemma-3-4b-it:free", "openrouter/free"];
const GRADING_MODELS = [
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "openai/gpt-oss-20b:free",
  "openrouter/free",
];

async function callWithFallback(
  models: string[],
  prompt: string,
): Promise<string> {
  for (const modelId of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const { text } = await generateText({
          model: openrouter(modelId),
          prompt,
          maxRetries: 0,
        });
        return text;
      } catch (err) {
        console.warn(`Model ${modelId} attempt ${attempt + 1} failed`, err);
        if (attempt === 1) break;
      }
    }
  }
  throw new Error("All models failed.");
}

function extractJSON(text: string, type: "object" | "array"): string {
  const [open, close] = type === "object" ? ["{", "}"] : ["[", "]"];
  const start = text.indexOf(open);
  const end = text.lastIndexOf(close);
  if (start === -1 || end === -1)
    throw new Error(`No JSON ${type} found in response: ${text}`);
  return text.slice(start, end + 1);
}

export async function generatePracticeQuiz(
  content: string,
  options: { count: number; type: string; focusArea: string } = {
    count: 6,
    type: "mixed",
    focusArea: "",
  },
) {
  const { count, type, focusArea } = options;

  // calculate question types
  let typeInstructions = `- ${Math.ceil(count / 2)} multiple-choice questions (type: "mcq")\n- ${Math.floor(count / 2)} short written-answer questions (type: "written")`;
  if (type === "mcq_only")
    typeInstructions = `- ${count} multiple-choice questions (type: "mcq")`;
  if (type === "written_only")
    typeInstructions = `- ${count} short written-answer questions (type: "written")`;

  // add focus area (if provided by user)
  const focusInstruction = focusArea
    ? `\nCRITICAL CUSTOM INSTRUCTION: Focus specifically on testing the following area/topic: "${focusArea}"`
    : "";

  const text = await callWithFallback(
    MODELS,
    `You are a quiz generator. Given the following study notes, generate a practice quiz with exactly ${count} questions:
${typeInstructions}
${focusInstruction}

Return ONLY a valid JSON array with no markdown, no explanation, no backticks. Each object must follow this shape:
{
  "id": "q1",
  "type": "mcq" | "written",
  "question": "...",
  "options": ["...", "...", "...", "..."]  // plain text only, NO letter prefixes like "A.", "B.", "C.", "D."
  "correctAnswerOrRubric": "..."  // for mcq: MUST be the EXACT full text of the correct option, not a letter like "A" or "B"
}
For mcq: options is required, correctAnswerOrRubric is the exact correct option string.
For written: omit options, correctAnswerOrRubric is a grading rubric.

NOTES:
${content}`,
  );

  const clean = extractJSON(text, "array");
  return JSON.parse(clean);
}

export async function gradeWrittenAnswer(
  question: string,
  userAnswer: string,
  rubric: string,
) {
  const text = await callWithFallback(
    GRADING_MODELS,
    `You are a strict but fair grader. Grade the student's answer based on the rubric.

Return ONLY a valid JSON object with no markdown, no explanation, no backticks:
{
  "score": <integer 0-100>,
  "isPassing": <true if score >= 60>,
  "feedback": "<one or two sentences of constructive feedback>"
}

Question: ${question}
Rubric: ${rubric}
Student's answer: ${userAnswer}`,
  );

  const clean = extractJSON(text, "object");
  return JSON.parse(clean) as {
    score: number;
    isPassing: boolean;
    feedback: string;
  };
}

export async function saveQuestionAction(
  noteId: string | undefined,
  questionData: Question,
) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to save questions." };
  }

  const { error } = await supabase.from("saved_questions").insert({
    user_id: user.id,
    note_id: noteId || null,
    type: questionData.type,
    question: questionData.question,
    options: questionData.options || null,
    correct_answer_or_rubric: questionData.correctAnswerOrRubric,
  });

  if (error) {
    return { error: "Error saving question" };
  }

  revalidatePath("/review");
  return { success: true };
}

export async function removeSavedQuestionAction(questionId: string) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to remove questions." };
  }

  const { error } = await supabase
    .from("saved_questions")
    .delete()
    .match({ id: questionId, user_id: user.id });

  if (error) {
    return { error: "Error removing question" };
  }

  revalidatePath("/review");
  return { success: true };
}
// TO DO: GOOGLE AUTH
