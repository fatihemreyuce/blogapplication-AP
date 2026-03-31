import { supabase } from "@/lib/supabase";
import type {
  CreateSeriesDto,
  Series,
  SeriesListParams,
  SeriesListResult,
  SeriesStats,
  UpdateSeriesDto,
} from "@/types/series.types";

const SORT_MAP: Record<
  NonNullable<SeriesListParams["sort"]>,
  { column: "created_at" | "title"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  title_asc: { column: "title", ascending: true },
  title_desc: { column: "title", ascending: false },
};

export const seriesService = {
  async list(params: SeriesListParams = {}): Promise<SeriesListResult> {
    const { search, sort = "newest", page = 1, pageSize = 9 } = params;
    let query = supabase.from("series").select("*", { count: "exact" });

    if (search?.trim()) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,description.ilike.%${search}%`);
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
      data: (data ?? []) as Series[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<SeriesStats> {
    const { count, error } = await supabase.from("series").select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return { total: count ?? 0 };
  },

  async getById(id: string): Promise<Series> {
    const { data, error } = await supabase.from("series").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);
    return data as Series;
  },

  async create(series: CreateSeriesDto): Promise<Series> {
    const payload = { ...series, id: crypto.randomUUID() };
    const { data, error } = await supabase.from("series").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data as Series;
  },

  async update(id: string, series: UpdateSeriesDto): Promise<Series> {
    const { data, error } = await supabase.from("series").update(series).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    return data as Series;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("series").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
