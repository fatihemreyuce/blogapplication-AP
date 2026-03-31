import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Hash, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateTag } from "@/hooks/use-tags";

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function TagCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateTag();
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });
  const isPending = createMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({ name: form.name.trim(), slug: toSlug(form.slug || form.name) });
      toast.success("Tag olusturuldu.");
      navigate("/tags");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Olusturulamadi.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <button onClick={() => navigate("/tags")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Tags
      </button>
      <div>
        <h1 className="text-2xl font-bold">Yeni Tag Olustur</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tag adını ve slug bilgisini girin.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:p-8">
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-muted-foreground" />Tag Adı</Label>
              <Input
                value={form.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setForm((f) => ({ ...f, name, slug: slugTouched ? f.slug : toSlug(name) }));
                }}
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5 text-muted-foreground" />Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm((f) => ({ ...f, slug: e.target.value }));
                }}
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate("/tags")} disabled={isPending}>Iptal</Button>
            <Button type="submit" disabled={isPending} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Kaydediliyor...</> : <>Tag Kaydet<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
