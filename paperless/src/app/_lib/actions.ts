"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase";
import { revalidatePath } from "next/cache";

import { ActionResponse } from "./types";

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

export async function updateProfileAction(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to edit profile." };

  const fullName = formData.get("fullName") as string;
  const avatarFile = formData.get("avatar") as File | null;

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

  const updatePayload: any = { full_name: fullName };
  if (avatarUrl) {
    updatePayload.avatar_url = avatarUrl;
  }

  const { error: updateError } = await supabase
    .from("profiles")
    .update(updatePayload)
    .eq("id", user.id);

  if (updateError) throw new Error("Failed to update profile");
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

// TO DO: GOOGLE AUTH
