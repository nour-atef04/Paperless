"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase";

export async function loginAction(prevState, formData) {
  {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { error: "Please enter email and password" };
    }

    const supabase = await createSupabaseServerClient();

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

export async function logoutAction(orevState, formData) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { error: error.message };
  }
  redirect("/login");
}

// TO DO: GOOGLE AUTH
