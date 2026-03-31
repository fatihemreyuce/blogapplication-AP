import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Hash, Link2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteTag, useTag } from "@/hooks/use-tags";
import { DeleteTagModal } from "@/components/tags/delete-tag-modal";

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
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

export default function TagDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const { data: tag, isLoading } = useTag(id ?? "");
  const deleteMutation = useDeleteTag();

  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  if (!tag) return <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center"><p className="text-lg font-semibold">Tag bulunamadi</p></div>;

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate("/tags")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Tags
        </button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => navigate(`/tags/${tag.id}/edit`)}>
            <Pencil className="h-4 w-4" /> Duzenle
          </Button>
          <Button variant="outline" className="gap-2 text-red-500 hover:text-red-500" onClick={() => setShowDelete(true)}>
            <Trash2 className="h-4 w-4" /> Sil
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 text-white">
            <Hash className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{tag.name}</h1>
            <p className="text-sm text-muted-foreground">/{tag.slug}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={Hash} label="Tag Adı" value={tag.name} />
          <InfoCard icon={Link2} label="Slug" value={`/${tag.slug}`} />
          <InfoCard
            icon={Calendar}
            label="Olusturma Tarihi"
            value={new Date(tag.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
          />
        </div>
      </div>

      <DeleteTagModal
        open={showDelete}
        tag={tag}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDelete(false)}
        onConfirm={async () => {
          try {
            await deleteMutation.mutateAsync(tag.id);
            toast.success("Tag silindi.");
            navigate("/tags");
          } catch {
            toast.error("Tag silinemedi.");
          } finally {
            setShowDelete(false);
          }
        }}
      />
    </div>
  );
}
