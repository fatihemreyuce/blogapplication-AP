import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, FileText, Link2, Loader2, AlignLeft, ImageIcon, User, Text, Tag, CalendarClock, Eye, Sparkles, Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePost, useUpdatePost } from "@/hooks/use-post";
import { useCategories } from "@/hooks/use-category";
import { useTags } from "@/hooks/use-tags";
import { useSeries } from "@/hooks/use-series";
import { useProfiles } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PostSeriesLinkInput } from "@/types/post.types";
import { PostTagSelector } from "@/components/posts/post-tag-selector";
import { PostImageUploader } from "@/components/posts/post-image-uploader";
import { PostFeaturedToggle } from "@/components/posts/post-featured-toggle";

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function PostEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: post, isLoading } = usePost(id ?? "");
  const updateMutation = useUpdatePost();
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    author_id: "",
    category_id: "",
    status: "draft",
    published_at: "",
    scheduled_at: "",
    reading_time: "",
    views: "",
    is_featured: false,
    meta_description: "",
    og_image: "",
    tag_ids: [] as string[],
    series_links: [] as PostSeriesLinkInput[],
  });
  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));
  const isPending = updateMutation.isPending;
  const { data: categoriesData } = useCategories({ page: 1, pageSize: 100 });
  const { data: tagsData } = useTags({ page: 1, pageSize: 200 });
  const { data: seriesData } = useSeries({ page: 1, pageSize: 100 });
  const { data: profilesData } = useProfiles({ page: 1, pageSize: 200 });

  useEffect(() => {
    if (post && !ready) {
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt ?? "",
        content: post.content ?? "",
        cover_image: post.cover_image ?? "",
        author_id: post.author_id ?? "",
        category_id: post.category_id ?? "",
        status: post.status ?? "draft",
        published_at: post.published_at ? post.published_at.slice(0, 16) : "",
        scheduled_at: post.scheduled_at ? post.scheduled_at.slice(0, 16) : "",
        reading_time: post.reading_time?.toString() ?? "",
        views: post.views?.toString() ?? "",
        is_featured: post.is_featured ?? false,
        meta_description: post.meta_description ?? "",
        og_image: post.og_image ?? "",
        tag_ids: post.tag_ids ?? [],
        series_links: post.series_links ?? [],
      });
      setReady(true);
    }
  }, [post, ready]);

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  if (!post) return <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center"><p className="text-lg font-semibold">Post bulunamadı</p></div>;

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <button onClick={() => navigate(`/posts/${id}`)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Post Detail</button>
      <div><h1 className="text-2xl font-bold">Post Düzenle</h1><p className="mt-1 text-sm text-muted-foreground">Mevcut post bilgilerini güncelleyin.</p></div>
      <form onSubmit={async (e) => {
        e.preventDefault();
        if (!id) return;
        try {
          await updateMutation.mutateAsync({
            id,
            data: {
              title: form.title.trim(),
              slug: toSlug(form.slug || form.title),
              excerpt: form.excerpt.trim() || null,
              content: form.content.trim() || null,
              cover_image: form.cover_image.trim() || null,
              author_id: form.author_id.trim() || null,
              category_id: form.category_id.trim() || null,
              status: form.status,
              published_at: form.published_at || null,
              scheduled_at: form.scheduled_at || null,
              reading_time: form.reading_time ? Number(form.reading_time) : null,
              views: form.views ? Number(form.views) : null,
              is_featured: form.is_featured,
              meta_description: form.meta_description.trim() || null,
              og_image: form.og_image.trim() || null,
              tag_ids: form.tag_ids,
              series_links: form.series_links,
            },
          });
          toast.success("Post güncellendi.");
          navigate(`/posts/${id}`);
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Güncellenemedi.");
        }
      }}>
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="space-y-5 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-muted-foreground" />Başlık</Label><Input value={form.title} onChange={(e) => set("title")(e.target.value)} required disabled={isPending} /></div>
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5 text-muted-foreground" />Slug</Label><Input value={form.slug} onChange={(e) => set("slug")(e.target.value)} required disabled={isPending} /></div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />Kapak Görseli</Label>
                <PostImageUploader
                  value={form.cover_image}
                  onChange={(url) => set("cover_image")(url)}
                  disabled={isPending}
                  label="Kapak görselini sürükle bırak ya da seç"
                  bucket="post-covers"
                  folder="covers"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" />Yazar</Label>
                <Select value={form.author_id || "none"} onValueChange={(v) => set("author_id")(v === "none" ? "" : v)} disabled={isPending}>
                  <SelectTrigger><SelectValue placeholder="Yazar seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Yazar yok</SelectItem>
                    {(profilesData?.data ?? []).map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        <div className="flex items-center gap-2">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="h-5 w-5 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500">
                              <User className="h-3 w-3 text-white" />
                            </div>
                          )}
                          <span>{(profile.full_name ?? profile.username)} (@{profile.username})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-muted-foreground" />Kategori</Label>
                <Select value={form.category_id || "none"} onValueChange={(v) => set("category_id")(v === "none" ? "" : v)} disabled={isPending}>
                  <SelectTrigger><SelectValue placeholder="Kategori seçin" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Kategori yok</SelectItem>
                    {(categoriesData?.data ?? []).map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-violet-500">
                            <Tag className="h-3 w-3 text-white" />
                          </div>
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-muted-foreground" />Status</Label>
                <Select value={form.status} onValueChange={(v) => set("status")(v)} disabled={isPending}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">draft</SelectItem>
                    <SelectItem value="published">published</SelectItem>
                    <SelectItem value="scheduled">scheduled</SelectItem>
                    <SelectItem value="archived">archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />Published At</Label><Input type="datetime-local" value={form.published_at} onChange={(e) => set("published_at")(e.target.value)} disabled={isPending} /></div>
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />Scheduled At</Label><Input type="datetime-local" value={form.scheduled_at} onChange={(e) => set("scheduled_at")(e.target.value)} disabled={isPending} /></div>
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><Text className="h-3.5 w-3.5 text-muted-foreground" />Reading Time (dk)</Label><Input type="number" min="0" value={form.reading_time} onChange={(e) => set("reading_time")(e.target.value)} disabled={isPending} /></div>
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><Eye className="h-3.5 w-3.5 text-muted-foreground" />Views</Label><Input type="number" min="0" value={form.views} onChange={(e) => set("views")(e.target.value)} disabled={isPending} /></div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />OG Görseli</Label>
                <PostImageUploader
                  value={form.og_image}
                  onChange={(url) => set("og_image")(url)}
                  disabled={isPending}
                  label="OG görselini sürükle bırak ya da seç"
                  bucket="post-covers"
                  folder="og"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-muted-foreground" />Etiketler</Label>
                <PostTagSelector
                  options={tagsData?.data ?? []}
                  selectedIds={form.tag_ids}
                  onChange={(nextIds) => setForm((f) => ({ ...f, tag_ids: nextIds }))}
                  disabled={isPending}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1.5"><FileText className="h-3.5 w-3.5 text-muted-foreground" />Seri Bağlantıları</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setForm((f) => ({ ...f, series_links: [...f.series_links, { series_id: "", order_num: f.series_links.length + 1 }] }))}
                  disabled={isPending}
                >
                  <Plus className="mr-1 h-3.5 w-3.5" /> Ekle
                </Button>
              </div>
              <div className="space-y-2">
                {form.series_links.map((link, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_130px_48px] gap-2">
                    <Select
                      value={link.series_id || "none"}
                      onValueChange={(v) =>
                        setForm((f) => {
                          const next = [...f.series_links];
                          next[idx] = { ...next[idx], series_id: v === "none" ? "" : v };
                          return { ...f, series_links: next };
                        })
                      }
                      disabled={isPending}
                    >
                      <SelectTrigger><SelectValue placeholder="Seri seçin" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Seri yok</SelectItem>
                        {(seriesData?.data ?? []).map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            <div className="flex items-center gap-2">
                              {s.cover_image ? (
                                <img src={s.cover_image} alt={s.title} className="h-5 w-5 rounded object-cover" />
                              ) : (
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-emerald-500 to-blue-500">
                                  <BookOpen className="h-3 w-3 text-white" />
                                </div>
                              )}
                              <span>{s.title}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={link.order_num}
                      onChange={(e) =>
                        setForm((f) => {
                          const next = [...f.series_links];
                          next[idx] = { ...next[idx], order_num: Number(e.target.value) || 1 };
                          return { ...f, series_links: next };
                        })
                      }
                      disabled={isPending}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setForm((f) => ({ ...f, series_links: f.series_links.filter((_, i) => i !== idx) }))}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Text className="h-3.5 w-3.5 text-muted-foreground" />Özet</Label>
              <textarea value={form.excerpt} onChange={(e) => set("excerpt")(e.target.value)} rows={2} disabled={isPending} className={cn("w-full resize-none rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 text-sm outline-none", "focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20")} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />İçerik</Label>
              <textarea value={form.content} onChange={(e) => set("content")(e.target.value)} rows={8} disabled={isPending} className={cn("w-full resize-y rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 text-sm outline-none", "focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20")} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Sparkles className="h-3.5 w-3.5 text-muted-foreground" />Meta Description</Label>
              <textarea value={form.meta_description} onChange={(e) => set("meta_description")(e.target.value)} rows={3} disabled={isPending} className={cn("w-full resize-none rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 text-sm outline-none", "focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20")} />
            </div>
            <PostFeaturedToggle
              checked={form.is_featured}
              onChange={(value) => setForm((f) => ({ ...f, is_featured: value }))}
              disabled={isPending}
            />
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate(`/posts/${id}`)} disabled={isPending}>İptal</Button>
            <Button type="submit" disabled={isPending} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Kaydediliyor...</> : <>Değişiklikleri Kaydet<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
