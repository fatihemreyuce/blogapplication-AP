import { supabase } from "@/lib/supabase";
import type {
  Category,
  CategoryListParams,
  CategoryListResult,
  CategoryStats,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category.types";

const SORT_MAP: Record<
  NonNullable<CategoryListParams["sort"]>,
  { column: "created_at" | "name"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  name_asc: { column: "name", ascending: true },
  name_desc: { column: "name", ascending: false },
};

export const categoryService = {
  async list(params: CategoryListParams = {}): Promise<CategoryListResult> {
    const { search, sort = "newest", page = 1, pageSize = 9 } = params;
    let query = supabase.from("categories").select("*", { count: "exact" });

    if (search?.trim()) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const sortConfig = SORT_MAP[sort];

    const { data, error, count } = await query
      .order(sortConfig.column, { ascending: sortConfig.ascending })
      .range(from, to);

    if (error) throw new Error(error.message);

    const total = count ?? 0;
    return {
      data: (data ?? []) as Category[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<CategoryStats> {
    const [totalRes, withCoverRes] = await Promise.all([
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }).not("cover_image", "is", null),
    ]);

    return {
      total: totalRes.count ?? 0,
      withCover: withCoverRes.count ?? 0,
    };
  },

  async getById(id: string): Promise<Category> {
    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data as Category;
  },

  async create(category: CreateCategoryDto): Promise<Category> {
    const payload = { ...category, id: crypto.randomUUID() };
    const { data, error } = await supabase.from("categories").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data as Category;
  },

  async update(id: string, category: UpdateCategoryDto): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Category;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
