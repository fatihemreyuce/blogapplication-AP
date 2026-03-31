export interface Tag {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export type CreateTagDto = Omit<Tag, "id" | "created_at">;
export type UpdateTagDto = Partial<CreateTagDto>;

export interface TagListParams {
  search?: string;
  sort?: "newest" | "oldest" | "name_asc" | "name_desc";
  page?: number;
  pageSize?: number;
}

export interface TagListResult {
  data: Tag[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TagStats {
  total: number;
}
