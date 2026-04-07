import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { BookOpen, Plus, Search, Pencil, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDeleteSeries, useSeries, useSeriesStats } from "@/hooks/use-series";
import type { Series } from "@/types/series.types";
import { DeleteSeriesModal } from "@/components/series/delete-series-modal";

function SeriesCard({ series, index, onView, onEdit, onDelete }: { series: Series; index: number; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="animate-scale-in rounded-2xl border border-border/50 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(59,130,246,0.12)]" style={{ animationDelay: `${index * 50}ms` }}>
      <div className="mb-4 flex items-start gap-3">
        {series.cover_image ? (
          <img src={series.cover_image} alt={series.title} className="h-12 w-12 rounded-xl object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 text-white"><BookOpen className="h-5 w-5" /></div>
        )}
        <div className="min-w-0">
          <p className="truncate font-semibold">{series.title}</p>
          <p className="truncate text-xs text-muted-foreground">/{series.slug}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">{series.description ?? "Açıklama yok"}</p>
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

export default function SeriesListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteTarget, setDeleteTarget] = useState<Series | null>(null);

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

  const { data, isLoading } = useSeries({ search: searchParam, sort, page, pageSize: 9 });
  const { data: stats } = useSeriesStats();
  const deleteMutation = useDeleteSeries();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success("Seri silindi.");
    } catch {
      toast.error("Seri silinemedi.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Series</h1>
          <p className="mt-1 text-sm text-muted-foreground">{stats?.total ?? 0} seri bulundu</p>
        </div>
        <Button onClick={() => navigate("/series/create")} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
          <Plus className="h-4 w-4" />
          New Series
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Seri ara..." className="pl-9" />
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
        <div className="rounded-2xl border border-dashed border-border/50 bg-card/50 py-20 text-center"><p className="text-lg font-semibold">Seri bulunamadı</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.data.map((item, i) => <SeriesCard key={item.id} series={item} index={i} onView={() => navigate(`/series/${item.id}`)} onEdit={() => navigate(`/series/${item.id}/edit`)} onDelete={() => setDeleteTarget(item)} />)}
        </div>
      )}

      <DeleteSeriesModal open={!!deleteTarget} series={deleteTarget} loading={deleteMutation.isPending} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}
