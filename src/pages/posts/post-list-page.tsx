import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Plus, Search, Pencil, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeletePost, usePostStats, usePosts } from "@/hooks/use-post";
import type { Post } from "@/types/post.types";
import { DeletePostModal } from "@/components/posts/delete-post-modal";

function PostCard({ post, index, onView, onEdit, onDelete }: { post: Post; index: number; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="animate-scale-in rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)]" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="mb-4 flex items-start gap-3">
        {post.cover_image ? (
          <img src={post.cover_image} alt={post.title} className="h-12 w-12 rounded-xl object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 text-white"><FileText className="h-5 w-5" /></div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold">{post.title}</p>
          <p className="truncate text-xs text-muted-foreground">/{post.slug}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{post.excerpt ?? "Özet yok"}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onView} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 py-1.5 text-xs hover:border-brand-blue/50 hover:text-brand-blue"><Eye className="h-3.5 w-3.5" />View</button>
        <button onClick={onEdit} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 py-1.5 text-xs hover:border-brand-green/50 hover:text-brand-green"><Pencil className="h-3.5 w-3.5" />Edit</button>
        <button onClick={onDelete} className="flex items-center justify-center rounded-lg border border-border/60 px-2.5 py-1.5 hover:border-red-400/60 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

export default function PostListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);

  const searchParam = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort");
  const pageParam = Number(searchParams.get("page") ?? "1");
  const sort = sortParam === "oldest" || sortParam === "title_asc" || sortParam === "title_desc" ? sortParam : "newest";
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

  const { data, isLoading } = usePosts({ search: searchParam, sort, page, pageSize: 9 });
  const { data: stats } = usePostStats();
  const deleteMutation = useDeletePost();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Post silindi.");
    } catch {
      toast.error("Post silinemedi.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">{stats?.total ?? 0} post bulundu</p>
        </div>
        <Button onClick={() => navigate("/posts/create")} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Post ara..." className="pl-9" />
        </div>
        <Select value={sort} onValueChange={(v) => { const next = new URLSearchParams(searchParams); next.set("sort", v); next.set("page", "1"); setSearchParams(next); }}>
          <SelectTrigger className="w-44"><ArrowUpDown className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="title_asc">Title A-Z</SelectItem>
            <SelectItem value="title_desc">Title Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : !data?.data.length ? (
        <div className="rounded-2xl border border-dashed border-border/50 bg-card/50 py-20 text-center"><p className="text-lg font-semibold">Post bulunamadı</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.data.map((item, i) => <PostCard key={item.id} post={item} index={i} onView={() => navigate(`/posts/${item.id}`)} onEdit={() => navigate(`/posts/${item.id}/edit`)} onDelete={() => setDeleteTarget(item)} />)}
        </div>
      )}

      <DeletePostModal open={!!deleteTarget} post={deleteTarget} loading={deleteMutation.isPending} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
