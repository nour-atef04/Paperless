"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase";
import { revalidatePath } from "next/cache";

export async function loginAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email");
  const password = formData.get("password");

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

export async function logoutAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  redirect("/login");
}

export async function toggleSaveNote(noteId) {
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

  let wasSaved;

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

export async function postNewNote(prevState, formData) {
  const title = formData.get("new-note-title");
  const content = formData.get("new-note-content");

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

export async function deleteNote(noteId) {
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

export async function editNote(prevState, formData) {
  const id = formData.get("note-id");
  const title = formData.get("new-note-title");
  const content = formData.get("new-note-content");

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

export async function createFolder(folderName) {
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

export async function deleteFolder(folderId) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to create a new folder." };

  const { error } = await supabase.from("folders").delete().eq("id", folderId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/my-notes");
  return { success: true };
}

// TO DO: GOOGLE AUTH
