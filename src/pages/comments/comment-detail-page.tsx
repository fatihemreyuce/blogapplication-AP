import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Trash2,
  MessageSquareText,
  UserCircle2,
  FileText,
  Reply,
  CircleDashed,
  Calendar,
} from "lucide-react";
import { useComment, useDeleteComment } from "@/hooks/use-comment";
import { DeleteCommentModal } from "@/components/comments/delete-comment-modal";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";

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
      <div className="text-sm font-medium text-foreground break-all">{value ?? "—"}</div>
    </div>
  );
}

export default function CommentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const { data: comment, isLoading } = useComment(id ?? "");
  const deleteMutation = useDeleteComment();

  const handleDelete = async () => {
    if (!comment) return;
    try {
      await deleteMutation.mutateAsync(comment.id);
      toast.success("Yorum silindi.");
      navigate("/comments");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setShowDelete(false);
    }
  };

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;

  if (!comment) {
    return (
      <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center">
        <p className="text-lg font-semibold">Yorum bulunamadi</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/comments")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Comments
        </button>
        <button onClick={() => setShowDelete(true)} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-red-500 hover:bg-red-500/10">
          <Trash2 className="h-4 w-4" />
          Sil
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
        <div className="h-20 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-violet-500/20" />
        <div className="-mt-8 flex items-center gap-4 px-6 pb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted ring-4 ring-card">
            <MessageSquareText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold">
              <AnimatedGradientText>Comment Detail</AnimatedGradientText>
            </h1>
            <p className="truncate text-sm text-muted-foreground">{comment.id}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={FileText} label="Post" value={comment.post ? `${comment.post.title} (/${comment.post.slug})` : comment.post_id} />
        <InfoCard icon={UserCircle2} label="Author ID" value={comment.author_id} />
        <InfoCard icon={CircleDashed} label="Status" value={comment.status} />
        <InfoCard icon={Reply} label="Parent ID" value={comment.parent_id ?? "Ana yorum"} />
        <InfoCard icon={MessageSquareText} label="Content" value={comment.content} />
        <InfoCard
          icon={Calendar}
          label="Olusturma Tarihi"
          value={new Date(comment.created_at).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </div>

      <DeleteCommentModal
        open={showDelete}
        comment={comment}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
