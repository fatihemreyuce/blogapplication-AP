import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Search,
  Plus,
  FolderOpen,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DeleteCategoryModal } from "@/components/category/delete-category-modal";
import {
  useCategories,
  useCategoryStats,
  useDeleteCategory,
} from "@/hooks/use-category";
import type { Category } from "@/types/category.types";
import { cn } from "@/lib/utils";

function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | undefined;
  gradient: string;
}) {
  return (
    <div className="animate-scale-in relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: gradient }}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">{value ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  index,
  onView,
  onEdit,
  onDelete,
}: {
  category: Category;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="animate-scale-in group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.12)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
      <div className="p-5">
        <div className="flex items-start gap-3">
          {category.cover_image ? (
            <img src={category.cover_image} alt={category.name} className="h-12 w-12 rounded-xl object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              <FolderOpen className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{category.name}</h3>
            <p className="truncate text-xs text-muted-foreground">/{category.slug}</p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{category.description ?? "Aciklama yok"}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="rounded-full bg-brand-blue/10 px-2.5 py-0.5 text-xs font-medium text-brand-blue">
            Category
          </span>
          <span className={cn("text-xs", category.cover_image ? "text-brand-green" : "text-muted-foreground")}>
            {category.cover_image ? "Kapak var" : "Kapak yok"}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={onView} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 py-1.5 text-xs hover:border-brand-blue/50 hover:text-brand-blue">
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <button onClick={onEdit} className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 py-1.5 text-xs hover:border-brand-green/50 hover:text-brand-green">
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button onClick={onDelete} className="flex items-center justify-center rounded-lg border border-border/60 px-2.5 py-1.5 hover:border-red-400/60 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="px-2 text-sm text-muted-foreground">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function CategoryListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchParam = searchParams.get("q") ?? "";
  const sortParam = searchParams.get("sort");
  const pageParam = Number(searchParams.get("page") ?? "1");

  const sort = sortParam === "oldest" || sortParam === "name_asc" || sortParam === "name_desc" ? sortParam : "newest";
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const [searchInput, setSearchInput] = useState(searchParam);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const t = setTimeout(() => {
      const nextSearch = searchInput.trim();
      const current = searchParams.get("q") ?? "";
      if (nextSearch === current) return;
      const next = new URLSearchParams(searchParams);
      if (nextSearch) next.set("q", nextSearch);
      else next.delete("q");
      next.set("page", "1");
      setSearchParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput, searchParams, setSearchParams]);

  const params = { search: searchParam, sort, page, pageSize: 9 } as const;
  const { data, isLoading } = useCategories(params);
  const { data: stats } = useCategoryStats();
  const deleteMutation = useDeleteCategory();

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.name} silindi.`);
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">{data?.total ?? 0} kategori bulundu</p>
        </div>
        <Button
          onClick={() => navigate("/categories/create")}
          className="gap-2 rounded-xl border-0 text-white"
          style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}
        >
          <Plus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <StatCard icon={FolderOpen} label="Total Categories" value={stats?.total} gradient="linear-gradient(135deg,#3b82f6,#8b5cf6)" />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Kategori ara..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 rounded-xl border-border/60 bg-card pl-9"
          />
        </div>
        <Select
          value={sort}
          onValueChange={(v) => {
            const next = new URLSearchParams(searchParams);
            next.set("sort", v);
            next.set("page", "1");
            setSearchParams(next);
          }}
        >
          <SelectTrigger className="h-10 w-44 rounded-xl border-border/60 bg-card">
            <ArrowUpDown className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="name_asc">Name A-Z</SelectItem>
            <SelectItem value="name_desc">Name Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : !data?.data.length ? (
        <div className="rounded-2xl border border-dashed border-border/50 bg-card/50 py-20 text-center">
          <p className="text-lg font-semibold text-foreground">Kategori bulunamadi</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.data.map((category, i) => (
            <CategoryCard
              key={category.id}
              category={category}
              index={i}
              onView={() => navigate(`/categories/${category.id}`)}
              onEdit={() => navigate(`/categories/${category.id}/edit`)}
              onDelete={() => setDeleteTarget(category)}
            />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={data.totalPages}
          onChange={(p) => {
            const next = new URLSearchParams(searchParams);
            next.set("page", String(p));
            setSearchParams(next);
          }}
        />
      )}

      <DeleteCategoryModal
        open={!!deleteTarget}
        category={deleteTarget}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
