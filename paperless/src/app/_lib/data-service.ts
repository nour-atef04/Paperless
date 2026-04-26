import { createSupabaseServerClient } from "./supabase";
import {
  Folder,
  Note,
  NoteWithDetails,
  Profile,
  SortOption,
  UserProfile,
} from "./types";

export async function getUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return user.id;
}

export async function getUserProfile(): Promise<UserProfile | null> {
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

  if (error || !profile) return null;

  return {
    name: profile.full_name,
    image: profile.avatar_url,
    email: user.email,
    id: user.id,
  };
}

export async function getUserProfileById(
  id: string,
): Promise<Omit<UserProfile, "email"> | null> {
  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch public profile:", error);
    return null;
  }

  if (!profile) return null;

return {
    name: profile.full_name,
    image: profile.avatar_url,
    id: id, 
  };
}

function getAllNotes(supabase: any) {
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
  )
}

function applySorting(queryBuilder: any, sort?: SortOption) {
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

export async function getDashboardNotes(
  query?: string,
  sort?: SortOption,
): Promise<NoteWithDetails[] | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // only public notes
  let supabaseQuery = getAllNotes(supabase).neq("user_id", user.id).eq("public", true);

  if (query) {
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%, content.ilike.%${query}%`,
    );
  }

  supabaseQuery = applySorting(supabaseQuery, sort);

  const { data, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return data as NoteWithDetails[];
}

export async function getMyNotes(
  query?: string,
  sort?: SortOption,
  folderId?: string,
): Promise<NoteWithDetails[] | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // all notes (public and private)
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
  return data as NoteWithDetails[];
}

export async function getSavedNotes(
  query?: string,
  sort?: SortOption,
): Promise<NoteWithDetails[] | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // all notes (public and private)
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
  return data as NoteWithDetails[];
}

// added RLS in supabase to only view private notes if yours, or any public note
export async function getNoteById(id: string): Promise<NoteWithDetails | null> {
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
  return data as NoteWithDetails;
}

export async function getNotesByUserId(
  id: string,
  query?: string,
  sort?: SortOption,
  folderId?: string,
): Promise<NoteWithDetails[] | null> {
  const supabase = await createSupabaseServerClient();

  // only public notes
  let supabaseQuery = getAllNotes(supabase).eq("user_id", id).eq("public", true);

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
  return data as NoteWithDetails[];
}

export async function getMyFolders(): Promise<Folder[] | null> {
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
  return data as Folder[];
}

export async function getFoldersByUserId(id: string): Promise<Folder[] | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("folders")
    .select("*")
    .eq("user_id", id)
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data as Folder[];
}

export async function getFolderName(id: string): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("folders")
    .select("name")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.name || null;
}
