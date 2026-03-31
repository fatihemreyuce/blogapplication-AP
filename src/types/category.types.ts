export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  cover_image: string | null;
  created_at: string;
}

export type CreateCategoryDto = Omit<Category, "id" | "created_at">;
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export interface CategoryListParams {
  search?: string;
  sort?: "newest" | "oldest" | "name_asc" | "name_desc";
  page?: number;
  pageSize?: number;
}

export interface CategoryListResult {
  data: Category[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CategoryStats {
  total: number;
  withCover: number;
}