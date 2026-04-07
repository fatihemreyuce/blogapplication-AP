import { supabase } from "@/lib/supabase";
import type {
  Comment,
  CommentListParams,
  CommentListResult,
  CommentStats,
  CreateCommentDto,
  UpdateCommentDto,
} from "@/types/comment.types";

const SORT_MAP: Record<
  NonNullable<CommentListParams["sort"]>,
  { column: "created_at"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
};

export const commentService = {
  async list(params: CommentListParams = {}): Promise<CommentListResult> {
    const { search, status = "all", sort = "newest", page = 1, pageSize = 9 } = params;
    let query = supabase
      .from("comments")
      .select("*, post:posts(id,title,slug)", { count: "exact" });

    if (search?.trim()) {
      query = query.or(
        `content.ilike.%${search}%,author_id.ilike.%${search}%,post_id.ilike.%${search}%`,
      );
    }

    if (status !== "all") {
      query = query.eq("status", status);
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
      data: (data ?? []) as Comment[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<CommentStats> {
    const [totalRes, approvedRes, pendingRes] = await Promise.all([
      supabase.from("comments").select("*", { count: "exact", head: true }),
      supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("comments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    if (totalRes.error) throw new Error(totalRes.error.message);
    if (approvedRes.error) throw new Error(approvedRes.error.message);
    if (pendingRes.error) throw new Error(pendingRes.error.message);

    return {
      total: totalRes.count ?? 0,
      approved: approvedRes.count ?? 0,
      pending: pendingRes.count ?? 0,
    };
  },

  async getById(id: string): Promise<Comment> {
    const { data, error } = await supabase
      .from("comments")
      .select("*, post:posts(id,title,slug)")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data as Comment;
  },

  async create(comment: CreateCommentDto): Promise<Comment> {
    const payload = { ...comment, id: crypto.randomUUID() };
    const { data, error } = await supabase.from("comments").insert(payload).select().single();
    if (error) throw new Error(error.message);
    return data as Comment;
  },

  async update(id: string, comment: UpdateCommentDto): Promise<Comment> {
    const { data, error } = await supabase
      .from("comments")
      .update(comment)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Comment;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
