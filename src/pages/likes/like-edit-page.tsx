import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, FileText, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLike, useUpdateLike } from "@/hooks/use-like";
import { usePosts } from "@/hooks/use-post";
import { makeLikeKey } from "@/types/like.types";

export default function LikeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: like, isLoading } = useLike(id ?? "");
  const { data: postsData, isLoading: postsLoading } = usePosts({ page: 1, pageSize: 100, sort: "newest" });
  const updateMutation = useUpdateLike();
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({ post_id: "" });

  useEffect(() => {
    if (like && !ready) {
      setForm({ post_id: like.post_id });
      setReady(true);
    }
  }, [like, ready]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateMutation.mutateAsync({ id, data: { post_id: form.post_id.trim() } });
      toast.success("Beğeni güncellendi.");
      if (like) navigate(`/likes/${makeLikeKey(like.user_id, form.post_id.trim())}`);
      else navigate("/likes");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Güncellenemedi.");
    }
  };

  const isPending = updateMutation.isPending;
  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  if (!like) return <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center"><p className="text-lg font-semibold">Beğeni bulunamadı</p></div>;

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/likes")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Beğeniler
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Beğeni Düzenle</h1>
        <p className="mt-1 text-sm text-muted-foreground">Beğeni kaydını güncelleyin.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">Kullanıcı</Label>
                <div className="h-11 rounded-xl border border-border/60 bg-muted/30 px-3 text-sm flex items-center text-muted-foreground">
                  {like.user_id}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium"><FileText className="h-3.5 w-3.5 text-muted-foreground" />Gönderi</Label>
                <Select value={form.post_id} onValueChange={(value) => setForm((f) => ({ ...f, post_id: value }))} disabled={isPending || postsLoading}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60 bg-muted/30"><SelectValue placeholder={postsLoading ? "Gönderiler yükleniyor..." : "Gönderi seç"} /></SelectTrigger>
                  <SelectContent>
                    {(postsData?.data ?? []).map((post) => (
                      <SelectItem key={post.id} value={post.id}>{post.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate(`/likes/${id}`)} disabled={isPending}>İptal</Button>
            <Button type="submit" disabled={isPending || !form.post_id} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Kaydediliyor...</> : <><Heart className="h-4 w-4" />Kaydet<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
