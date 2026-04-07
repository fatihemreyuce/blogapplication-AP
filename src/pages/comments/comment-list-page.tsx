import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  MessageSquareText,
  Search,
  Trash2,
  Eye,
  ArrowUpDown,
  CircleDashed,
  CheckCheck,
  Clock3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useComments, useCommentStats, useDeleteComment } from "@/hooks/use-comment";
import type { Comment } from "@/types/comment.types";
import { DeleteCommentModal } from "@/components/comments/delete-comment-modal";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { TiltCard } from "@/components/magicui/tilt-card";
import { cn } from "@/lib/utils";

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
        status === "approved" && "bg-emerald-500/15 text-emerald-500",
        status === "pending" && "bg-amber-500/15 text-amber-500",
        status === "spam" && "bg-rose-500/15 text-rose-500",
        status === "rejected" && "bg-zinc-500/15 text-zinc-400",
      )}
    >
      {status}
    </span>
  );
}

function CommentCard({
  comment,
  index,
  onView,
  onDelete,
}: {
  comment: Comment;
  index: number;
  onView: () => void;
  onDelete: () => void;
}) {
  return (
    <TiltCard className="animate-card-in" >
      <div
        className="rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300"
        style={{ animationDelay: `${index * 45}ms` }}
      >
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{comment.id.slice(0, 8)}</p>
            <p className="truncate text-xs text-muted-foreground">
              Post: {comment.post?.title ?? comment.post_id}
            </p>
            <p className="truncate text-xs text-muted-foreground">{comment.author_id}</p>
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{comment.content}</p>
          </div>
          <StatusBadge status={comment.status} />
        </div>
        <div className="flex gap-2">
          <button onClick={onView} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 py-1.5 text-xs hover:border-brand-blue/50 hover:text-brand-blue"><Eye className="h-3.5 w-3.5" />View</button>
          <button onClick={onDelete} className="flex items-center justify-center rounded-lg border border-border/60 px-2.5 py-1.5 hover:border-red-400/60 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </TiltCard>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function CommentListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);

  const searchParam = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort");
  const statusParam = searchParams.get("status");
  const pageParam = Number(searchParams.get("page") ?? "1");
  const sort = sortParam === "oldest" ? "oldest" : "newest";
  const status =
    statusParam === "pending" ||
    statusParam === "approved" ||
    statusParam === "spam" ||
    statusParam === "rejected"
      ? statusParam
      : "all";
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const [searchInput, setSearchInput] = useState(searchParam);
  useEffect(() => setSearchInput(searchParam), [searchParam]);
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      const q = searchInput.trim();
      if (q) next.set("q", q);
      else next.delete("q");
      next.set("page", "1");
      setSearchParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput, searchParams, setSearchParams]);

  const { data, isLoading } = useComments({ search: searchParam, sort, status, page, pageSize: 9 });
  const { data: stats } = useCommentStats();
  const deleteMutation = useDeleteComment();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Yorum silindi.");
    } catch {
      toast.error("Yorum silinemedi.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            <AnimatedGradientText>Comments</AnimatedGradientText>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{stats?.total ?? 0} yorum bulundu</p>
          <p className="text-xs text-muted-foreground/80">Yorumlar front-end post detayindan otomatik gelir.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard icon={MessageSquareText} label="Total" value={stats?.total ?? 0} />
        <StatCard icon={CheckCheck} label="Approved" value={stats?.approved ?? 0} />
        <StatCard icon={Clock3} label="Pending" value={stats?.pending ?? 0} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Yorum ara..." className="pl-9" />
        </div>
        <Select value={status} onValueChange={(v) => { const next = new URLSearchParams(searchParams); if (v === "all") next.delete("status"); else next.set("status", v); next.set("page", "1"); setSearchParams(next); }}>
          <SelectTrigger className="w-48"><CircleDashed className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">pending</SelectItem>
            <SelectItem value="approved">approved</SelectItem>
            <SelectItem value="spam">spam</SelectItem>
            <SelectItem value="rejected">rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => { const next = new URLSearchParams(searchParams); next.set("sort", v); next.set("page", "1"); setSearchParams(next); }}>
          <SelectTrigger className="w-44"><ArrowUpDown className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : !data?.data.length ? (
        <div className="rounded-2xl border border-dashed border-border/50 bg-card/50 py-20 text-center"><p className="text-lg font-semibold">Yorum bulunamadi</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.data.map((item, i) => <CommentCard key={item.id} comment={item} index={i} onView={() => navigate(`/comments/${item.id}`)} onDelete={() => setDeleteTarget(item)} />)}
        </div>
      )}

      <DeleteCommentModal open={!!deleteTarget} comment={deleteTarget} loading={deleteMutation.isPending} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
