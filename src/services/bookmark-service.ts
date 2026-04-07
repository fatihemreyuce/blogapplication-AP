import { supabase } from "@/lib/supabase";
import type {
  Bookmark,
  BookmarkListParams,
  BookmarkListResult,
  BookmarkStats,
  CreateBookmarkDto,
  UpdateBookmarkDto,
} from "@/types/bookmark.types";
import { parseBookmarkKey } from "@/types/bookmark.types";

const SORT_MAP: Record<
  NonNullable<BookmarkListParams["sort"]>,
  { column: "created_at"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
};

export const bookmarkService = {
  async list(params: BookmarkListParams = {}): Promise<BookmarkListResult> {
    const { search, sort = "newest", page = 1, pageSize = 9 } = params;
    let query = supabase
      .from("bookmarks")
      .select("*, post:posts(id,title,slug)", { count: "exact" });

    if (search?.trim()) {
      query = query.or(
        `user_id.ilike.%${search}%,post_id.ilike.%${search}%`,
      );
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
      data: (data ?? []) as Bookmark[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<BookmarkStats> {
    const { count, error } = await supabase
      .from("bookmarks")
      .select("*", { count: "exact", head: true });
    if (error) throw new Error(error.message);
    return { total: count ?? 0 };
  },

  async getById(id: string): Promise<Bookmark> {
    const parsed = parseBookmarkKey(id);
    if (!parsed) throw new Error("Geçersiz bookmark anahtarı.");
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*, post:posts(id,title,slug)")
      .eq("user_id", parsed.user_id)
      .eq("post_id", parsed.post_id)
      .single();
    if (error) throw new Error(error.message);
    return data as Bookmark;
  },

  async create(bookmark: CreateBookmarkDto): Promise<Bookmark> {
    const { data, error } = await supabase
      .from("bookmarks")
      .insert(bookmark)
      .select("*, post:posts(id,title,slug)")
      .single();
    if (error) throw new Error(error.message);
    return data as Bookmark;
  },

  async update(id: string, bookmark: UpdateBookmarkDto): Promise<Bookmark> {
    const parsed = parseBookmarkKey(id);
    if (!parsed) throw new Error("Geçersiz bookmark anahtarı.");
    const { data, error } = await supabase
      .from("bookmarks")
      .update(bookmark)
      .eq("user_id", parsed.user_id)
      .eq("post_id", parsed.post_id)
      .select("*, post:posts(id,title,slug)")
      .single();
    if (error) throw new Error(error.message);
    return data as Bookmark;
  },

  async remove(id: string): Promise<void> {
    const parsed = parseBookmarkKey(id);
    if (!parsed) throw new Error("Geçersiz bookmark anahtarı.");
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", parsed.user_id)
      .eq("post_id", parsed.post_id);
    if (error) throw new Error(error.message);
  },
};
