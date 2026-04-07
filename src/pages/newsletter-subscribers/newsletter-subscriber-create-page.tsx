import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Loader2, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateNewsletterSubscriber } from "@/hooks/use-newsletter-subscriber";

export default function NewsletterSubscriberCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateNewsletterSubscriber();
  const [form, setForm] = useState({ email: "", is_active: "true" });
  const isPending = createMutation.isPending;
  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMutation.mutateAsync({
        email: form.email.trim(),
        is_active: form.is_active === "true",
      });
      toast.success("Abone oluşturuldu.");
      navigate("/newsletter-subscribers");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Oluşturulamadı.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/newsletter-subscribers")} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Bülten Aboneleri
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-foreground">Yeni Abone Oluştur</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bülten aboneliği için yeni e-posta ekleyin.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
          <div className="h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" />
          <div className="space-y-6 p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium"><Mail className="h-3.5 w-3.5 text-muted-foreground" />E-posta</Label>
                <Input type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} required disabled={isPending} className="h-11 rounded-xl border-border/60 bg-muted/30" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-sm font-medium"><ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />Durum</Label>
                <Select value={form.is_active} onValueChange={set("is_active")} disabled={isPending}>
                  <SelectTrigger className="h-11 rounded-xl border-border/60 bg-muted/30"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Aktif</SelectItem>
                    <SelectItem value="false">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
            <Button type="button" variant="outline" onClick={() => navigate("/newsletter-subscribers")} disabled={isPending}>İptal</Button>
            <Button type="submit" disabled={isPending || !form.email} className="gap-2 border-0 text-white" style={{ background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)" }}>
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Kaydediliyor...</> : <>Kaydet<ArrowRight className="h-4 w-4" /></>}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
