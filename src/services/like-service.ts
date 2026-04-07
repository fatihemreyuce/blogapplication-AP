import { supabase } from "@/lib/supabase";
import type {
  CreateLikeDto,
  Like,
  LikeListParams,
  LikeListResult,
  LikeStats,
  UpdateLikeDto,
} from "@/types/like.types";
import { parseLikeKey } from "@/types/like.types";

const SORT_MAP: Record<
  NonNullable<LikeListParams["sort"]>,
  { column: "created_at"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
};

export const likeService = {
  async list(params: LikeListParams = {}): Promise<LikeListResult> {
    const { search, sort = "newest", page = 1, pageSize = 9 } = params;
    let query = supabase
      .from("likes")
      .select("*, post:posts(id,title,slug)", { count: "exact" });

    if (search?.trim()) {
      query = query.or(`user_id.ilike.%${search}%,post_id.ilike.%${search}%`);
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
      data: (data ?? []) as Like[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<LikeStats> {
    const { count, error } = await supabase
      .from("likes")
      .select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return { total: count ?? 0 };
  },

  async getById(id: string): Promise<Like> {
    const parsed = parseLikeKey(id);
    if (!parsed) throw new Error("Geçersiz like anahtarı.");
    const { data, error } = await supabase
      .from("likes")
      .select("*, post:posts(id,title,slug)")
      .eq("user_id", parsed.user_id)
      .eq("post_id", parsed.post_id)
      .single();
    if (error) throw new Error(error.message);
    return data as Like;
  },

  async create(like: CreateLikeDto): Promise<Like> {
    const { data, error } = await supabase
      .from("likes")
      .insert(like)
      .select("*, post:posts(id,title,slug)")
      .single();
    if (error) throw new Error(error.message);
    return data as Like;
  },

  async update(id: string, like: UpdateLikeDto): Promise<Like> {
    const parsed = parseLikeKey(id);
    if (!parsed) throw new Error("Geçersiz like anahtarı.");
    const { data, error } = await supabase
      .from("likes")
      .update(like)
      .eq("user_id", parsed.user_id)
      .eq("post_id", parsed.post_id)
      .select("*, post:posts(id,title,slug)")
      .single();
    if (error) throw new Error(error.message);
    return data as Like;
  },

  async remove(id: string): Promise<void> {
    const parsed = parseLikeKey(id);
    if (!parsed) throw new Error("Geçersiz like anahtarı.");
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", parsed.user_id)
      .eq("post_id", parsed.post_id);
    if (error) throw new Error(error.message);
  },
};
