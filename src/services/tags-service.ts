import { supabase } from "@/lib/supabase";
import type {
  Tag,
  TagListParams,
  TagListResult,
  TagStats,
  CreateTagDto,
  UpdateTagDto,
} from "@/types/tags.types";

const SORT_MAP: Record<
  NonNullable<TagListParams["sort"]>,
  { column: "created_at" | "name"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  name_asc: { column: "name", ascending: true },
  name_desc: { column: "name", ascending: false },
};

export const tagsService = {
  async list(params: TagListParams = {}): Promise<TagListResult> {
    const { search, sort = "newest", page = 1, pageSize = 12 } = params;
    let query = supabase.from("tags").select("*", { count: "exact" });

    if (search?.trim()) {
      query = query.or(`name.ilike.%${search}%,slug.ilike.%${search}%`);
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
      data: (data ?? []) as Tag[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<TagStats> {
    const { count, error } = await supabase.from("tags").select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return { total: count ?? 0 };
  },

  async getById(id: string): Promise<Tag> {
    const { data, error } = await supabase.from("tags").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data as Tag;
  },

  async create(tag: CreateTagDto): Promise<Tag> {
    const payload = { ...tag, id: crypto.randomUUID() };
    const { data, error } = await supabase.from("tags").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data as Tag;
  },

  async update(id: string, tag: UpdateTagDto): Promise<Tag> {
    const { data, error } = await supabase.from("tags").update(tag).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as Tag;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("tags").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
