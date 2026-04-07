export type CommentStatus = "pending" | "approved" | "spam" | "rejected";

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  status: CommentStatus;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  post?: {
    id: string;
    title: string;
    slug: string;
  } | null;
}

export interface CreateCommentDto {
  post_id: string;
  author_id: string;
  content: string;
  status: CommentStatus;
  parent_id?: string | null;
}

export type UpdateCommentDto = Partial<CreateCommentDto>;

export interface CommentListParams {
  search?: string;
  status?: CommentStatus | "all";
  sort?: "newest" | "oldest";
  page?: number;
  pageSize?: number;
}

export interface CommentListResult {
  data: Comment[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CommentStats {
  total: number;
  approved: number;
  pending: number;
}
