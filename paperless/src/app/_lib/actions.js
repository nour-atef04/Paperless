"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase";
import { revalidatePath } from "next/cache";

export async function loginAction(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  {
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
  if (!user) throw new Error("You must be logged in to save notes.");

  const { data, error: fetchError } = await supabase
    .from("user_saves")
    .select("*")
    .match({ user_id: user.id, note_id: noteId })
    .maybeSingle();
  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!data) {
    const { error: insertError } = await supabase
      .from("user_saves")
      .insert({ user_id: user.id, note_id: noteId });

    if (insertError) {
      throw new Error(insertError.message);
    }
  } else {
    const { error: deleteError } = await supabase
      .from("user_saves")
      .delete()
      .match({ user_id: user.id, note_id: noteId });
    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  revalidatePath("/notes");
  revalidatePath("/saved");
}

// TO DO: GOOGLE AUTH
