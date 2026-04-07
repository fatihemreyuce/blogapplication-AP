import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Pencil, Trash2, Bookmark, UserCircle2, FileText, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useBookmark, useDeleteBookmark } from "@/hooks/use-bookmark";
import { DeleteBookmarkModal } from "@/components/bookmarks/delete-bookmark-modal";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { makeBookmarkKey } from "@/types/bookmark.types";

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-medium break-all text-foreground">{value ?? "—"}</div>
    </div>
  );
}

export default function BookmarkDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const { data: bookmark, isLoading } = useBookmark(id ?? "");
  const deleteMutation = useDeleteBookmark();

  const handleDelete = async () => {
    if (!bookmark) return;
    try {
      await deleteMutation.mutateAsync(makeBookmarkKey(bookmark.user_id, bookmark.post_id));
      toast.success("Bookmark silindi.");
      navigate("/bookmarks");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setShowDelete(false);
    }
  };

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  if (!bookmark) return <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center"><p className="text-lg font-semibold">Bookmark bulunamadi</p></div>;

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button onClick={() => navigate("/bookmarks")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Bookmarks
        </button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate(`/bookmarks/${makeBookmarkKey(bookmark.user_id, bookmark.post_id)}/edit`)}>
            <Pencil className="h-4 w-4" />
            Duzenle
          </Button>
          <Button variant="outline" className="gap-2 text-red-500 hover:text-red-500" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" />
            Sil
          </Button>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
        <div className="h-20 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-violet-500/20" />
        <div className="-mt-8 flex items-center gap-4 px-6 pb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted ring-4 ring-card">
            <Bookmark className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold"><AnimatedGradientText>Bookmark Detail</AnimatedGradientText></h1>
            <p className="truncate text-sm text-muted-foreground">{bookmark.post?.title ?? makeBookmarkKey(bookmark.user_id, bookmark.post_id)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={UserCircle2} label="User ID" value={bookmark.user_id} />
        <InfoCard icon={FileText} label="Post" value={bookmark.post ? `${bookmark.post.title} (/${bookmark.post.slug})` : bookmark.post_id} />
        <InfoCard
          icon={Calendar}
          label="Created At"
          value={new Date(bookmark.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
        />
      </div>

      <DeleteBookmarkModal open={showDelete} bookmark={bookmark} loading={deleteMutation.isPending} onConfirm={handleDelete} onCancel={() => setShowDelete(false)} />
    </div>
  );
}
