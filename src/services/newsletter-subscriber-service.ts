import { supabase } from "@/lib/supabase";
import type {
  CreateNewsletterSubscriberDto,
  NewsletterSubscriber,
  NewsletterSubscriberListParams,
  NewsletterSubscriberListResult,
  NewsletterSubscriberStats,
  UpdateNewsletterSubscriberDto,
} from "@/types/newsletter-subscriber.types";

const SORT_MAP: Record<
  NonNullable<NewsletterSubscriberListParams["sort"]>,
  { column: "created_at" | "email"; ascending: boolean }
> = {
  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
  email_asc: { column: "email", ascending: true },
  email_desc: { column: "email", ascending: false },
};

export const newsletterSubscriberService = {
  async list(
    params: NewsletterSubscriberListParams = {},
  ): Promise<NewsletterSubscriberListResult> {
    const { search, active = "all", sort = "newest", page = 1, pageSize = 9 } = params;
    let query = supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact" });

    if (search?.trim()) {
      query = query.ilike("email", `%${search}%`);
    }
    if (active === "active") query = query.eq("is_active", true);
    if (active === "inactive") query = query.eq("is_active", false);

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const sortConfig = SORT_MAP[sort];

    const { data, error, count } = await query
      .order(sortConfig.column, { ascending: sortConfig.ascending })
      .range(from, to);
    if (error) throw new Error(error.message);

    const total = count ?? 0;
    return {
      data: (data ?? []) as NewsletterSubscriber[],
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    };
  },

  async stats(): Promise<NewsletterSubscriberStats> {
    const [totalRes, activeRes] = await Promise.all([
      supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
      supabase
        .from("newsletter_subscribers")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true),
    ]);
    if (totalRes.error) throw new Error(totalRes.error.message);
    if (activeRes.error) throw new Error(activeRes.error.message);
    return {
      total: totalRes.count ?? 0,
      active: activeRes.count ?? 0,
    };
  },

  async getById(id: string): Promise<NewsletterSubscriber> {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data as NewsletterSubscriber;
  },

  async create(
    payload: CreateNewsletterSubscriberDto,
  ): Promise<NewsletterSubscriber> {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert({ ...payload, id: crypto.randomUUID(), is_active: payload.is_active ?? true })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as NewsletterSubscriber;
  },

  async update(
    id: string,
    payload: UpdateNewsletterSubscriberDto,
  ): Promise<NewsletterSubscriber> {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as NewsletterSubscriber;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
