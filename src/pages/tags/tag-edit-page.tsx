import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Hash, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTag, useUpdateTag } from "@/hooks/use-tags";

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function TagEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: tag, isLoading } = useTag(id ?? "");
  const updateMutation = useUpdateTag();
  const [form, setForm] = useState({ name: "", slug: "" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (tag && !ready) {
      setForm({ name: tag.name, slug: tag.slug });
      setReady(true);
    }
  }, [tag, ready]);

  const isPending = updateMutation.isPending;
  if (isLoading) return <div className="h-64 animate-pulse rounded-2xl bg-muted" />;
  if (!tag) return <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center"><p className="text-lg font-semibold">Tag bulunamadi</p></div>;

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <button onClick={() => navigate(`/tags/${id}`)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tag Detail
      </button>
      <div>
        <h1 className="text-2xl font-bold">Tag Duzenle</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tag bilgilerini guncelleyin.</p>
      </div>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!id) return;
          try {
            await updateMutation.mutateAsync({ id, data: { name: form.name.trim(), slug: toSlug(form.slug || form.name) } });
            toast.success("Tag guncellendi.");
            navigate(`/tags/${id}`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Guncellenemedi.");
          }
        }}
      >
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-muted-foreground" />Tag Adı</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required disabled={isPending} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5 text-muted-foreground" />Slug</Label>
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required disabled={isPending} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate(`/tags/${id}`)} disabled={isPending}>Iptal</Button>
            <Button type="submit" disabled={isPending} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Kaydediliyor...</> : <>Degisiklikleri Kaydet<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
