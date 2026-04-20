"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase";
import { revalidatePath } from "next/cache";

import { ActionResponse } from "./types";

export async function loginAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse | never> {
  // "never" because redirect() throws an internal error to stop execution
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
  redirect("/");
}

export async function logoutAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse | never> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
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

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to add notes." };

  const { data, error } = await supabase
    .from("notes")
    .insert({ user_id: user.id, title, content })
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

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to edit notes." };

  const { error } = await supabase
    .from("notes")
    .update({ title, content })
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
): Promise<ActionResponse> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to create a new folder." };

  const { error } = await supabase
    .from("folders")
    .insert({ name: folderName, user_id: user.id });

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

// TO DO: GOOGLE AUTH
