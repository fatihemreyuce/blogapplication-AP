import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, MessageSquareText, UserCircle2, FileText, Reply, CircleDashed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComment, useUpdateComment } from "@/hooks/use-comment";
import { cn } from "@/lib/utils";

export default function CommentEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: comment, isLoading } = useComment(id ?? "");
  const updateMutation = useUpdateComment();
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState({
    post_id: "",
    author_id: "",
    content: "",
    status: "pending",
    parent_id: "",
  });

  useEffect(() => {
    if (comment && !ready) {
      setForm({
        post_id: comment.post_id,
        author_id: comment.author_id,
        content: comment.content,
        status: comment.status,
        parent_id: comment.parent_id ?? "",
      });
      setReady(true);
    }
  }, [comment, ready]);

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
          author_id: form.author_id.trim(),
          content: form.content.trim(),
          status: form.status as "pending" | "approved" | "spam" | "rejected",
          parent_id: form.parent_id.trim() || null,
        },
      });
      toast.success("Yorum guncellendi.");
      navigate(`/comments/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Guncellenemedi.");
    }
  };

  const isPending = updateMutation.isPending;

  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  }

  if (!comment) {
    return (
      <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center">
        <p className="text-lg font-semibold">Yorum bulunamadi</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/comments")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Comments
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Yorumu Duzenle</h1>
        <p className="mt-1 text-sm text-muted-foreground">Yorum bilgilerini guncelleyin.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                  Post ID
                </Label>
                <Input
                  value={form.post_id}
                  onChange={(e) => set("post_id")(e.target.value)}
                  required
                  disabled={isPending}
                  className="h-11 rounded-xl border-border/60 bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <UserCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Author ID
                </Label>
                <Input
                  value={form.author_id}
                  onChange={(e) => set("author_id")(e.target.value)}
                  required
                  disabled={isPending}
                  className="h-11 rounded-xl border-border/60 bg-muted/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <CircleDashed className="h-3.5 w-3.5 text-muted-foreground" />
                  Status
                </Label>
                <Select value={form.status} onValueChange={set("status")}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60 bg-muted/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                    <SelectItem value="spam">spam</SelectItem>
                    <SelectItem value="rejected">rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <Reply className="h-3.5 w-3.5 text-muted-foreground" />
                  Parent ID (opsiyonel)
                </Label>
                <Input
                  value={form.parent_id}
                  onChange={(e) => set("parent_id")(e.target.value)}
                  disabled={isPending}
                  className="h-11 rounded-xl border-border/60 bg-muted/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <MessageSquareText className="h-3.5 w-3.5 text-muted-foreground" />
                Comment Content
              </Label>
              <textarea
                value={form.content}
                onChange={(e) => set("content")(e.target.value)}
                rows={5}
                required
                disabled={isPending}
                className={cn(
                  "w-full resize-none rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 text-sm outline-none",
                  "focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20",
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate(`/comments/${id}`)} disabled={isPending}>
              Iptal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 border-0 text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  Degisiklikleri Kaydet
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
