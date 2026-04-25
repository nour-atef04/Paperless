export type ActionResponse = {
  error?: string;
  success?: boolean;
  redirectTo?: string;
  fields?: {
    // for previous form values
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export type Profile = {
  id: string;
  full_name: string;
  avatar_url?: string;
  created_at?: string;
};

export type Note = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  created_at?: string;
  updated_at?: string;
  folder_id?: string;
};

export type Folder = {
  id: string;
  user_id: string;
  name: string;
  created_at?: string;
};

export type UserSave = {
  user_id: string;
  note_id: string;
  created_at?: string;
};

export type NoteWithDetails = Note & {
  folders: Pick<Folder, "name"> | null;
  profiles: Pick<Profile, "full_name" | "avatar_url" | "id"> | null;
  user_saves: Pick<UserSave, "user_id">[];
};

export type SortOption = "latest" | "oldest" | "most-relevant" | string;

export type PageRoute = "dashboard" | "my-notes" | "saved" | "profile";

export type PageSearchParams = Promise<{
  query?: string;
  sort?: SortOption;
  folder?: string;
}>;

export type UserProfile = {
  name: string;
  image?: string | null;
  email?: string;
  id: string;
};
