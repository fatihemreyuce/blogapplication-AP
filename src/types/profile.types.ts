
export type ProfileRole = "admin" | "editor" | "viewer";

export interface Profile {
  id: string;
  username: string;
  email: string | null;
  password: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  role: ProfileRole;
  active: boolean;
  created_at: string;
}

export interface ProfileInsert {
  id?: string;
  username: string;
  email?: string | null;
  password?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  role?: ProfileRole;
  active?: boolean;
}

export interface ProfileUpdate {
  username?: string;
  email?: string | null;
  password?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  role?: ProfileRole;
  active?: boolean;
}

export interface ProfileListParams {
  search?: string;
  role?: "all" | ProfileRole;
  active?: "all" | "active" | "inactive";
  page?: number;
  pageSize?: number;
}

export interface ProfileListResult {
  data: Profile[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProfileStats {
  total: number;
  active: number;
  admins: number;
}