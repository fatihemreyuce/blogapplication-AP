import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowUpDown, Eye, Heart, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";
import { TiltCard } from "@/components/magicui/tilt-card";
import { DeleteLikeModal } from "@/components/likes/delete-like-modal";
import { useDeleteLike, useLikeStats, useLikes } from "@/hooks/use-like";
import { makeLikeKey, type Like } from "@/types/like.types";

function LikeCard({
  like,
  index,
  onView,
  onEdit,
  onDelete,
}: {
  like: Like;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <TiltCard className="animate-card-in">
      <div className="rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300" style={{ animationDelay: `${index * 45}ms` }}>
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
            <Heart className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{like.post?.title ?? like.post_id}</p>
            <p className="truncate text-xs text-muted-foreground">{like.user_id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onView} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 py-1.5 text-xs hover:border-brand-blue/50 hover:text-brand-blue"><Eye className="h-3.5 w-3.5" />Görüntüle</button>
          <button onClick={onEdit} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 py-1.5 text-xs hover:border-brand-green/50 hover:text-brand-green"><Pencil className="h-3.5 w-3.5" />Düzenle</button>
          <button onClick={onDelete} className="flex items-center justify-center rounded-lg border border-border/60 px-2.5 py-1.5 hover:border-red-400/60 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </TiltCard>
  );
}

export default function LikeListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Like | null>(null);

  const searchParam = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort");
  const pageParam = Number(searchParams.get("page") ?? "1");
  const sort = sortParam === "oldest" ? "oldest" : "newest";
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

  const { data, isLoading } = useLikes({ search: searchParam, sort, page, pageSize: 9 });
  const { data: stats } = useLikeStats();
  const deleteMutation = useDeleteLike();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(makeLikeKey(deleteTarget.user_id, deleteTarget.post_id));
      toast.success("Beğeni silindi.");
    } catch {
      toast.error("Beğeni silinemedi.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold"><AnimatedGradientText>Beğeniler</AnimatedGradientText></h1>
          <p className="mt-1 text-sm text-muted-foreground">{stats?.total ?? 0} beğeni bulundu</p>
        </div>
        <Button onClick={() => navigate("/likes/create")} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
          <Plus className="h-4 w-4" />
          Yeni Beğeni
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Beğeni ara..." className="pl-9" />
        </div>
        <Select value={sort} onValueChange={(v) => { const next = new URLSearchParams(searchParams); next.set("sort", v); next.set("page", "1"); setSearchParams(next); }}>
          <SelectTrigger className="w-44"><ArrowUpDown className="mr-2 h-4 w-4" /><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">En Yeni</SelectItem>
            <SelectItem value="oldest">En Eski</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted" />)}</div>
      ) : !data?.data.length ? (
        <div className="rounded-2xl border border-dashed border-border/50 bg-card/50 py-20 text-center"><p className="text-lg font-semibold">Beğeni bulunamadı</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.data.map((item, i) => {
            const key = makeLikeKey(item.user_id, item.post_id);
            return <LikeCard key={key} like={item} index={i} onView={() => navigate(`/likes/${key}`)} onEdit={() => navigate(`/likes/${key}/edit`)} onDelete={() => setDeleteTarget(item)} />;
          })}
        </div>
      )}

      <DeleteLikeModal open={!!deleteTarget} like={deleteTarget} loading={deleteMutation.isPending} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
