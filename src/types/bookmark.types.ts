export interface Bookmark {
  user_id: string;
  post_id: string;
  created_at: string;
  post?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

export function makeBookmarkKey(userId: string, postId: string) {
  return `${userId}_${postId}`;
}

export function parseBookmarkKey(key: string) {
  const idx = key.indexOf("_");
  if (idx < 0) return null;
  const user_id = key.slice(0, idx);
  const post_id = key.slice(idx + 1);
  if (!user_id || !post_id) return null;
  return { user_id, post_id };
}

export interface CreateBookmarkDto {
  user_id: string;
  post_id: string;
}

export type UpdateBookmarkDto = Partial<CreateBookmarkDto>;

export interface BookmarkListParams {
  search?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}

export interface BookmarkListResult {
  data: Bookmark[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface BookmarkStats {
  total: number;
}
