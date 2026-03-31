import { supabase } from "@/lib/supabase";
import type {
  CreatePostDto,
  Post,
  PostListParams,
  PostListResult,
  PostSeriesLinkInput,
  PostStats,
  UpdatePostDto,
} from "@/types/post.types";

const SORT_MAP: Record<
  NonNullable<PostListParams["sort"]>,
  { column: "created_at" | "title"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  title_asc: { column: "title", ascending: true },
  title_desc: { column: "title", ascending: false },
};

export const postService = {
  async syncPostTags(postId: string, tagIds: string[]) {
    const { error: deleteError } = await supabase.from("post_tags").delete().eq("post_id", postId);
    if (deleteError) throw new Error(deleteError.message);
    if (!tagIds.length) return;

    const payload = tagIds.map((tagId) => ({ post_id: postId, tag_id: tagId }));
    const { error: insertError } = await supabase.from("post_tags").insert(payload);
    if (insertError) throw new Error(insertError.message);
  },

  async syncPostSeries(postId: string, links: PostSeriesLinkInput[]) {
    const { error: deleteError } = await supabase.from("post_series").delete().eq("post_id", postId);
    if (deleteError) throw new Error(deleteError.message);
    if (!links.length) return;

    const payload = links.map((link) => ({
      post_id: postId,
      series_id: link.series_id,
      order_num: link.order_num,
    }));
    const { error: insertError } = await supabase.from("post_series").insert(payload);
    if (insertError) throw new Error(insertError.message);
  },

  async list(params: PostListParams = {}): Promise<PostListResult> {
    const { search, sort = "newest", page = 1, pageSize = 9 } = params;
    let query = supabase.from("posts").select("*", { count: "exact" });

    if (search?.trim()) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,excerpt.ilike.%${search}%`);
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
      data: (data ?? []) as Post[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<PostStats> {
    const { count, error } = await supabase.from("posts").select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return { total: count ?? 0 };
  },

  async getById(id: string): Promise<Post> {
    const { data, error } = await supabase.from("posts").select("*").eq("id", id).single();
    if (error) throw new Error(error.message);

    const [tagsRes, seriesRes] = await Promise.all([
      supabase.from("post_tags").select("tag_id").eq("post_id", id),
      supabase.from("post_series").select("series_id,order_num").eq("post_id", id).order("order_num", { ascending: true }),
    ]);

    if (tagsRes.error) throw new Error(tagsRes.error.message);
    if (seriesRes.error) throw new Error(seriesRes.error.message);

    return {
      ...(data as Post),
      tag_ids: (tagsRes.data ?? []).map((row) => row.tag_id),
      series_links: (seriesRes.data ?? []).map((row) => ({
        series_id: row.series_id,
        order_num: row.order_num,
      })),
    } as Post;
  },

  async create(post: CreatePostDto): Promise<Post> {
    const { tag_ids = [], series_links = [], ...postPayload } = post;
    const payload = { ...postPayload, id: crypto.randomUUID() };
    const { data, error } = await supabase.from("posts").insert(payload).select().single();
    if (error) throw new Error(error.message);
    await this.syncPostTags(data.id, tag_ids);
    await this.syncPostSeries(data.id, series_links);
    return data as Post;
  },

  async update(id: string, post: UpdatePostDto): Promise<Post> {
    const { tag_ids, series_links, ...postPayload } = post;
    const { data, error } = await supabase.from("posts").update(postPayload).eq("id", id).select().single();
    if (error) throw new Error(error.message);
    if (tag_ids) await this.syncPostTags(id, tag_ids);
    if (series_links) await this.syncPostSeries(id, series_links);
    return data as Post;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
