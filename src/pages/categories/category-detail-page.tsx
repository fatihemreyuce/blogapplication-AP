import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  FolderOpen,
  Link2,
  AlignLeft,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategory, useDeleteCategory } from "@/hooks/use-category";
import { DeleteCategoryModal } from "@/components/category/delete-category-modal";

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
      <div className="text-sm font-medium text-foreground">{value ?? "—"}</div>
    </div>
  );
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const { data: category, isLoading } = useCategory(id ?? "");
  const deleteMutation = useDeleteCategory();

  const handleDelete = async () => {
    if (!category) return;
    try {
      await deleteMutation.mutateAsync(category.id);
      toast.success("Kategori silindi.");
      navigate("/categories");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setShowDelete(false);
    }
  };

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;

  if (!category) {
    return (
      <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center">
        <p className="text-lg font-semibold">Kategori bulunamadi</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Categories
        </button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate(`/categories/${category.id}/edit`)}>
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
          {category.cover_image ? (
            <img src={category.cover_image} alt={category.name} className="h-20 w-20 rounded-2xl object-cover ring-4 ring-card" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted ring-4 ring-card">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-sm text-muted-foreground">/{category.slug}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <InfoCard icon={FolderOpen} label="Kategori Adi" value={category.name} />
        <InfoCard icon={Link2} label="Slug" value={`/${category.slug}`} />
        <InfoCard icon={AlignLeft} label="Aciklama" value={category.description} />
        <InfoCard
          icon={Calendar}
          label="Olusturma Tarihi"
          value={new Date(category.created_at).toLocaleDateString("tr-TR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
      </div>

      <DeleteCategoryModal
        open={showDelete}
        category={category}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
