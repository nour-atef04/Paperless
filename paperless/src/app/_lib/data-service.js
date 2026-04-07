import { createSupabaseServerClient } from "./supabase";

export async function getUserId() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return user.id;
}

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
    folders(name),
    profiles!user_id (
      full_name,
      avatar_url
    ),
    user_saves ( user_id )
  `,
  );
}

function applySorting(queryBuilder, sort) {
  switch (sort) {
    case "oldest":
      return queryBuilder.order("created_at", { ascending: true });
    case "most-relevant":
      // TO DO: advanced PostgreSQL Full-Text Search
      // For now, defaulting "relevant" to "latest"
      return queryBuilder.order("created_at", { ascending: false });
    case "latest":
    default:
      // Always fall back to latest if no sort is provided
      return queryBuilder.order("created_at", { ascending: false });
  }
}

export async function getDashboardNotes(query, sort) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let supabaseQuery = getAllNotes(supabase).neq("user_id", user.id);

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%, content.ilike.%${query}%`,
    );
  }

  supabaseQuery = applySorting(supabaseQuery, sort);

  const { data, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return data;
}

export async function getMyNotes(query, sort, folderId) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let supabaseQuery = getAllNotes(supabase).eq("user_id", user.id);

  if (folderId) {
    supabaseQuery = supabaseQuery.eq("folder_id", folderId);
  }

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%, content.ilike.%${query}%`,
    );
  }

  supabaseQuery = applySorting(supabaseQuery, sort);

  const { data, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return data;
}

export async function getSavedNotes(query, sort) {
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
    .eq("user_saves.user_id", user.id);

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%, content.ilike.%${query}%`,
    );
  }

  supabaseQuery = applySorting(supabaseQuery, sort);

  const { data, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return data;
}

export async function getNoteById(id) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notes")
    .select(
      `
      *,
      profiles!user_id (
      full_name,
      avatar_url
    ),
    user_saves ( user_id )`,
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function getMyFolders() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function getFolderName(id) {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("folders")
    .select("name")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.name || null;
}
