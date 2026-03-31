export interface Series {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  author_id: string | null;
  created_at: string;
}

export type CreateSeriesDto = Omit<Series, "id" | "created_at">;
export type UpdateSeriesDto = Partial<CreateSeriesDto>;

export interface SeriesListParams {
  search?: string;
  sort?: "newest" | "oldest" | "title_asc" | "title_desc";
  page?: number;
  pageSize?: number;
}

export interface SeriesListResult {
  data: Series[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SeriesStats {
  total: number;
}
