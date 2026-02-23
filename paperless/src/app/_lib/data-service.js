import { createSupabaseServerClient } from "./supabase";

export async function getUserProfile() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }
  return profile;
}

export async function getNotes(query) {
  const supabase = await createSupabaseServerClient();

  let supabaseQuery = supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%, content.ilike.%${query}%`,
    );
  }

  const { data, error } = await supabaseQuery;
  if (error) throw error;
  return data;
}

export async function getNoteById(id) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
