import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Bookmark, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCreateBookmark } from "@/hooks/use-bookmark";
import { usePosts } from "@/hooks/use-post";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";

export default function BookmarkCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateBookmark();
  const { data: postsData, isLoading: postsLoading } = usePosts({ page: 1, pageSize: 100, sort: "newest" });
  const [form, setForm] = useState({
    post_id: "",
  });

  const isPending = createMutation.isPending;
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const currentUserId = (await supabase.auth.getUser()).data.user?.id;
      if (!currentUserId) {
        toast.error("Oturum bulunamadi. Lutfen tekrar giris yapin.");
        return;
      }
      await createMutation.mutateAsync({
        user_id: currentUserId,
        post_id: form.post_id.trim(),
      });
      toast.success("Bookmark olusturuldu.");
      navigate("/bookmarks");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Olusturulamadi.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/bookmarks")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Bookmarks
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Yeni Bookmark Olustur</h1>
        <p className="mt-1 text-sm text-muted-foreground">Yeni bookmark kaydı ekleyin.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">User</Label>
                <div className="h-11 rounded-xl border border-border/60 bg-muted/30 px-3 text-sm flex items-center text-muted-foreground">
                  Oturumdaki kullanici (auth.uid)
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
            <Button type="button" variant="outline" onClick={() => navigate("/bookmarks")} disabled={isPending}>Iptal</Button>
            <Button type="submit" disabled={isPending || !form.post_id} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Kaydediliyor...</> : <><Bookmark className="h-4 w-4" />Kaydet<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
