import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, BookOpen, Link2, Loader2, AlignLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateSeries } from "@/hooks/use-series";
import { cn } from "@/lib/utils";
import { SeriesCoverUploader } from "@/components/series/series-cover-uploader";

const toSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

export default function SeriesCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateSeries();
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", cover_image: "", author_id: "" });
  const isPending = createMutation.isPending;

  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <button onClick={() => navigate("/series")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Series</button>
      <div><h1 className="text-2xl font-bold">Yeni Seri Oluştur</h1><p className="mt-1 text-sm text-muted-foreground">Seri bilgilerini girerek yeni kayıt ekleyin.</p></div>
      <form onSubmit={async (e) => {
        e.preventDefault();
        try {
          await createMutation.mutateAsync({
            title: form.title.trim(),
            slug: toSlug(form.slug || form.title),
            description: form.description.trim() || null,
            cover_image: form.cover_image.trim() || null,
            author_id: form.author_id.trim() || null,
          });
          toast.success("Seri oluşturuldu.");
          navigate("/series");
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Oluşturulamadı.");
        }
      }}>
        <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="space-y-5 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5 text-muted-foreground" />Başlık</Label><Input value={form.title} onChange={(e) => { const title = e.target.value; set("title")(title); if (!slugTouched) set("slug")(toSlug(title)); }} required disabled={isPending} /></div>
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><Link2 className="h-3.5 w-3.5 text-muted-foreground" />Slug</Label><Input value={form.slug} onChange={(e) => { setSlugTouched(true); set("slug")(e.target.value); }} required disabled={isPending} /></div>
              <div className="space-y-1.5"><Label className="text-sm font-medium">Kapak Resmi (opsiyonel)</Label><SeriesCoverUploader value={form.cover_image} onChange={(url) => set("cover_image")(url)} disabled={isPending} /></div>
              <div className="space-y-1.5"><Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-muted-foreground" />Author ID (opsiyonel)</Label><Input value={form.author_id} onChange={(e) => set("author_id")(e.target.value)} disabled={isPending} /></div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />Açıklama</Label>
              <textarea value={form.description} onChange={(e) => set("description")(e.target.value)} rows={4} disabled={isPending} className={cn("w-full resize-none rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 text-sm outline-none", "focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20")} />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate("/series")} disabled={isPending}>İptal</Button>
            <Button type="submit" disabled={isPending} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Kaydediliyor...</> : <>Seriyi Kaydet<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
