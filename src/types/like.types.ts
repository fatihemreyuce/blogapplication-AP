export interface Like {
  user_id: string;
  post_id: string;
  created_at: string;
  post?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

export interface CreateLikeDto {
  user_id: string;
  post_id: string;
}

export type UpdateLikeDto = Partial<CreateLikeDto>;

export interface LikeListParams {
  search?: string;
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}

export interface LikeListResult {
  data: Like[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LikeStats {
  total: number;
}

export function makeLikeKey(userId: string, postId: string) {
  return `${userId}_${postId}`;
}

export function parseLikeKey(key: string) {
  const idx = key.indexOf("_");
  if (idx < 0) return null;
  const user_id = key.slice(0, idx);
  const post_id = key.slice(idx + 1);
  if (!user_id || !post_id) return null;
  return { user_id, post_id };
}
