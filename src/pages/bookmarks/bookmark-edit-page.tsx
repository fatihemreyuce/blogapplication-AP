import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Bookmark, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBookmark, useUpdateBookmark } from "@/hooks/use-bookmark";
import { usePosts } from "@/hooks/use-post";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function BookmarkEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: bookmark, isLoading } = useBookmark(id ?? "");
  const { data: postsData, isLoading: postsLoading } = usePosts({ page: 1, pageSize: 100, sort: "newest" });
  const updateMutation = useUpdateBookmark();
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({
    post_id: "",
  });

  useEffect(() => {
    if (bookmark && !ready) {
      setForm({
        post_id: bookmark.post_id,
      });
      setReady(true);
    }
  }, [bookmark, ready]);

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          post_id: form.post_id.trim(),
        },
      });
      toast.success("Bookmark guncellendi.");
      navigate(`/bookmarks/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Guncellenemedi.");
    }
  };

  const isPending = updateMutation.isPending;
  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  if (!bookmark) return <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center"><p className="text-lg font-semibold">Bookmark bulunamadi</p></div>;

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/bookmarks")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Bookmarks
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bookmark Duzenle</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bookmark kaydını guncelleyin.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">User</Label>
                <div className="h-11 rounded-xl border border-border/60 bg-muted/30 px-3 text-sm flex items-center text-muted-foreground">
                  {bookmark.user_id}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium"><FileText className="h-3.5 w-3.5 text-muted-foreground" />Post</Label>
                <Select value={form.post_id} onValueChange={set("post_id")} disabled={isPending || postsLoading}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60 bg-muted/30">
                    <SelectValue placeholder={postsLoading ? "Postlar yükleniyor..." : "Post seç"} />
                  </SelectTrigger>
                  <SelectContent>
                    {(postsData?.data ?? []).map((post) => (
                      <SelectItem key={post.id} value={post.id}>
                        {post.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate(`/bookmarks/${id}`)} disabled={isPending}>Iptal</Button>
            <Button type="submit" disabled={isPending || !form.post_id} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Kaydediliyor...</> : <><Bookmark className="h-4 w-4" />Kaydet<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
