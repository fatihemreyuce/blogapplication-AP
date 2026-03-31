import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, FolderOpen, Link2, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateCategory } from "@/hooks/use-category";
import { cn } from "@/lib/utils";

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export default function CategoryCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCategory();
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
  });

  const isPending = createMutation.isPending;

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleNameChange = (value: string) => {
    set("name")(value);
    if (!slugTouched) set("slug")(toSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        name: form.name.trim(),
        slug: toSlug(form.slug || form.name),
        description: form.description.trim() || null,
        cover_image: null,
      });
      toast.success("Kategori olusturuldu.");
      navigate("/categories");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Olusturulamadi.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/categories")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Categories
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Yeni Kategori Olustur</h1>
        <p className="mt-1 text-sm text-muted-foreground">Kategori bilgilerini doldurarak yeni kayit ekleyin.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <FolderOpen className="h-3.5 w-3.5 text-muted-foreground" />
                  Kategori Adi
                </Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  disabled={isPending}
                  className="h-11 rounded-xl border-border/60 bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium">
                  <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                  Slug
                </Label>
                <Input
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug")(e.target.value);
                  }}
                  required
                  disabled={isPending}
                  className="h-11 rounded-xl border-border/60 bg-muted/30"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-sm font-medium">
                <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                Aciklama
              </Label>
              <textarea
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                rows={4}
                disabled={isPending}
                className={cn(
                  "w-full resize-none rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 text-sm outline-none",
                  "focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20",
                )}
              />
            </div>

          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate("/categories")} disabled={isPending}>
              Iptal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 border-0 text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  Kategoriyi Kaydet
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
