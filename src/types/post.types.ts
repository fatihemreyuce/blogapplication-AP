export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author_id: string | null;
  category_id: string | null;
  status: string;
  published_at: string | null;
  scheduled_at: string | null;
  reading_time: number | null;
  views: number | null;
  is_featured: boolean | null;
  meta_description: string | null;
  og_image: string | null;
  tag_ids?: string[];
  series_links?: PostSeriesLinkInput[];
  created_at: string;
  updated_at: string | null;
}

export interface PostSeriesLinkInput {
  series_id: string;
  order_num: number;
}

export interface CreatePostDto {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image?: string | null;
  author_id?: string | null;
  category_id?: string | null;
  status: string;
  published_at?: string | null;
  scheduled_at?: string | null;
  reading_time?: number | null;
  views?: number | null;
  is_featured?: boolean | null;
  meta_description?: string | null;
  og_image?: string | null;
  tag_ids?: string[];
  series_links?: PostSeriesLinkInput[];
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

export interface PostListParams {
  search?: string;
  sort?: "newest" | "oldest" | "title_asc" | "title_desc";
  page?: number;
  pageSize?: number;
}

export interface PostListResult {
  data: Post[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PostStats {
  total: number;
}
