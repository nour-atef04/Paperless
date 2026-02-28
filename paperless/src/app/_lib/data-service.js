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

function getAllNotes(supabase) {
  return supabase.from("notes").select(
    `
    *,
    profiles!user_id (
      full_name,
      avatar_url
    ),
    user_saves ( user_id )
  `,
  );
}

export async function getDashboardNotes(query) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let supabaseQuery = getAllNotes(supabase)
    .neq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%, content.ilike.%${query}%`,
    );
  }

  const { data, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return data;
}

export async function getMyNotes(query) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let supabaseQuery = getAllNotes(supabase)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%, content.ilike.%${query}%`,
    );
  }

  const { data, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return data;
}

export async function getSavedNotes(query) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let supabaseQuery = supabase
    .from("notes")
    .select(
      `
      *,
      profiles!user_id (
        full_name,
        avatar_url
      ),
      user_saves!inner (
        user_id
      )
    `,
    )
    .eq("user_saves.user_id", user.id)
    .order("created_at", { ascending: false });

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%, content.ilike.%${query}%`,
    );
  }

  const { data, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return data;
}

export async function getNoteById(id) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}
