import { createSupabaseServerClient } from "./supabase";

export async function getNotes(query) {
  const supabase = createSupabaseServerClient();

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
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
