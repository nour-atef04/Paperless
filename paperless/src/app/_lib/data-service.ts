import { ITEMS_PER_PAGE } from "./constants";
import { createSupabaseServerClient } from "./supabase";
import {
  Folder,
  NoteWithDetails,
  SortOption,
  UserProfile
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
    .select("full_name, avatar_url, interests")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) return null;

  return {
    name: profile.full_name,
    image: profile.avatar_url,
    email: user.email,
    id: user.id,
    interests: profile.interests,
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
    { count: "exact" },
  );
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
  pageNumber: number = 1,
): Promise<{ notes: NoteWithDetails[]; count: number } | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // fetch user's interests
  const { data: profile } = await supabase
    .from("profiles")
    .select("interests")
    .eq("id", user.id)
    .single();

  const userInterestsArray = profile?.interests || [];

  const from = (pageNumber - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // only public notes
  let supabaseQuery = getAllNotes(supabase)
    .neq("user_id", user.id)
    .eq("public", true);

  // if user has specified interests, overlap notes with them
  if (userInterestsArray.length > 0 && !query) {
    supabaseQuery = supabaseQuery.overlaps("tags", userInterestsArray);
  }

  if (query) {
    // in case the user typed "#react" instead of "react"
    const cleanQuery = query.replace("#", "").trim().toLowerCase();

    // 'cs' checks if the array CONTAINS the specific string
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${cleanQuery}}`,
    );
  }

  supabaseQuery = applySorting(supabaseQuery, sort);
  supabaseQuery = supabaseQuery.range(from, to);

  let { data, count, error } = await supabaseQuery;
  if (error) throw new Error(error.message);

  // if personalized feed is empty, fetch all
  if (userInterestsArray.length > 0 && !query && (!data || data.length === 0)) {
    let fallbackQuery = getAllNotes(supabase)
      .neq("user_id", user.id)
      .eq("public", true);

    fallbackQuery = applySorting(fallbackQuery, sort);
    fallbackQuery = fallbackQuery.range(from, to);

    const fallbackResult = await fallbackQuery;
    if (fallbackResult.error) throw new Error(fallbackResult.error.message);

    // overwrite our initial empty data with the fallback data
    data = fallbackResult.data;
    count = fallbackResult.count;
  }

  return { notes: data as NoteWithDetails[], count: count || 0 };
}

export async function getMyNotes(
  query?: string,
  sort?: SortOption,
  folderId?: string,
  pageNumber: number = 1,
): Promise<{ notes: NoteWithDetails[]; count: number } | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const from = (pageNumber - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // all notes (public and private)
  let supabaseQuery = getAllNotes(supabase).eq("user_id", user.id);

  if (folderId) {
    supabaseQuery = supabaseQuery.eq("folder_id", folderId);
  }

  if (query) {
    // in case the user typed "#react" instead of "react"
    const cleanQuery = query.replace("#", "").trim().toLowerCase();

    // 'cs' checks if the array CONTAINS the specific string
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${cleanQuery}}`,
    );
  }

  supabaseQuery = applySorting(supabaseQuery, sort);
  supabaseQuery = supabaseQuery.range(from, to);

  const { data, count, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return { notes: data as NoteWithDetails[], count: count || 0 };
}

export async function getSavedNotes(
  query?: string,
  sort?: SortOption,
  folderId?: string,
  pageNumber: number = 1,
): Promise<{ notes: NoteWithDetails[]; count: number } | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const from = (pageNumber - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

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
        user_id,
        folder_id
      )
    `,
      { count: "exact" },
    )
    .eq("user_saves.user_id", user.id);

  if (folderId) {
    supabaseQuery = supabaseQuery.eq("user_saves.folder_id", folderId);
  }

  if (query) {
    // in case the user typed "#react" instead of "react"
    const cleanQuery = query.replace("#", "").trim().toLowerCase();

    // 'cs' checks if the array CONTAINS the specific string
    supabaseQuery = supabaseQuery.or(
      `title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${cleanQuery}}`,
    );
  }

  supabaseQuery = applySorting(supabaseQuery, sort);
  supabaseQuery = supabaseQuery.range(from, to);

  const { data, count, error } = await supabaseQuery;
  if (error) throw new Error(error.message);
  return { notes: data as NoteWithDetails[], count: count || 0 };
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
    user_saves ( user_id ),
    folders (
        id,
        name,
        public
      )
    `,
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
  let supabaseQuery = getAllNotes(supabase)
    .eq("user_id", id)
    .eq("public", true);

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

export async function getMyFolders(
  query?: string,
  page?: string,
): Promise<Folder[] | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  let supabaseQuery = supabase
    .from("folders")
    .select("*")
    .eq("user_id", user.id)
    .order("name", { ascending: true });

  if (page === "my-notes") {
    supabaseQuery = supabaseQuery.eq("folder_type", "personal");
  } else if (page === "saved") {
    supabaseQuery = supabaseQuery.eq("folder_type", "saved");
  }

  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%`);
  }

  const { data, error } = await supabaseQuery;

  if (error) throw new Error(error.message);
  return data as Folder[];
}

export async function getFoldersByUserId(
  id: string,
  query?: string,
): Promise<Folder[] | null> {
  const supabase = await createSupabaseServerClient();

  // only public folders
  let supabaseQuery = supabase
    .from("folders")
    .select("*")
    .eq("user_id", id)
    .eq("public", true)
    .order("name", { ascending: true });

  if (query) {
    supabaseQuery = supabaseQuery.or(`name.ilike.%${query}%`);
  }

  const { data, error } = await supabaseQuery;
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
