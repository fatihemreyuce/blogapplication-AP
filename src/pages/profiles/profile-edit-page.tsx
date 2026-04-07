import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  User,
  AlignLeft,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProfile, useUpdateProfile } from "@/hooks/use-profile";
import type { ProfileRole } from "@/types/profile.types";
import { cn } from "@/lib/utils";
import { AvatarUploader } from "@/components/profile/avatar-uploader";

/* ── Shared sub-components ────────────────────────────── */
function Field({
  label,
  icon: Icon,
  required,
  children,
  hint,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        {label}
        {required && <span className="text-brand-green">*</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ActiveToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none",
        value ? "" : "bg-muted",
      )}
      style={value ? { background: "linear-gradient(90deg, #10b981, #3b82f6)" } : undefined}
      aria-checked={value}
      role="switch"
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
          value ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );
}

function SectionHeader({ title, delay }: { title: string; delay: string }) {
  return (
    <div className="animate-slide-in-left flex items-center gap-3" style={{ animationDelay: delay }}>
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
        {title}
      </span>
      <span className="h-px flex-1 bg-border/50" />
    </div>
  );
}

function AvatarPreview({ url, name }: { url: string; name: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "?";
  return (
    <div className="flex items-center gap-3">
      {url ? (
        <img
          src={url}
          alt="avatar"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          className="h-14 w-14 rounded-xl object-cover ring-2 ring-border"
        />
      ) : (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-xl text-lg font-bold text-white ring-2 ring-border"
          style={{ background: "linear-gradient(135deg,#10b981,#3b82f6)" }}
        >
          {initials}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-foreground">{name || "Ad Soyad"}</p>
        <p className="text-xs text-muted-foreground">Avatar önizleme</p>
      </div>
    </div>
  );
}

/* ── Page skeleton ────────────────────────────────────── */
function FormSkeleton() {
  return (
    <div className="space-y-6 rounded-2xl border border-border/50 bg-card p-8">
      <div className="h-14 w-48 animate-pulse rounded-xl bg-muted" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-24 w-full animate-pulse rounded-xl bg-muted" />
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────── */
export default function ProfileEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: profile, isLoading } = useProfile(id ?? "");
  const updateMutation = useUpdateProfile();

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    bio: "",
    avatar_url: "",
    role: "viewer" as ProfileRole,
    active: true,
  });
  const [ready, setReady] = useState(false);

  /* Pre-fill form once profile loads */
  useEffect(() => {
    if (profile && !ready) {
      setForm({
        full_name: profile.full_name ?? "",
        username: profile.username,
        bio: profile.bio ?? "",
        avatar_url: profile.avatar_url ?? "",
        role: profile.role,
        active: profile.active,
      });
      setReady(true);
    }
  }, [profile, ready]);

  const set = (key: keyof typeof form) => (value: string | boolean) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          username: form.username,
          full_name: form.full_name || null,
          bio: form.bio || null,
          avatar_url: form.avatar_url || null,
          role: form.role,
          active: form.active,
        },
      });
      toast.success("Profil güncellendi.");
      navigate(`/profiles/${id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Güncellenemedi.");
    }
  };

  const isPending = updateMutation.isPending;

  return (
    <div className="animate-fade-in space-y-6 p-1">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profiles")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Profiles
        </button>
        <span className="text-muted-foreground/40">/</span>
        <button
          onClick={() => navigate(`/profiles/${id}`)}
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          {profile?.full_name ?? profile?.username ?? "…"}
        </button>
        <span className="text-muted-foreground/40">/</span>
        <span className="text-sm font-medium text-foreground">Düzenle</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Profili Düzenle</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kullanicinin profil bilgilerini duzenliyorsunuz.
        </p>
      </div>

      {isLoading ? (
        <FormSkeleton />
      ) : !profile ? (
        <div className="rounded-2xl border border-dashed border-border/50 bg-card py-20 text-center">
          <p className="text-lg font-semibold text-foreground">Profil bulunamadı</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
            {/* top accent */}
            <div
              className="h-1"
              style={{ background: "linear-gradient(90deg,#10b981,#3b82f6,#8b5cf6)" }}
            />

            <div className="space-y-8 p-6 sm:p-8">
              {/* Avatar preview */}
              <div className="animate-scale-in">
                <AvatarPreview url={form.avatar_url} name={form.full_name || form.username} />
              </div>

              {/* Basic info */}
              <div className="space-y-4">
                <SectionHeader title="Temel Bilgiler" delay="0ms" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Tam Ad" icon={User}>
                    <Input
                      placeholder="John Doe"
                      value={form.full_name}
                      onChange={(e) => set("full_name")(e.target.value)}
                      disabled={isPending}
                      className="h-11 rounded-xl border-border/60 bg-muted/30 focus-visible:ring-brand-blue/30"
                    />
                  </Field>
                  <Field label="Kullanıcı Adı" icon={User} required>
                    <Input
                      placeholder="johndoe"
                      value={form.username}
                      onChange={(e) => set("username")(e.target.value)}
                      required
                      disabled={isPending}
                      className="h-11 rounded-xl border-border/60 bg-muted/30 focus-visible:ring-brand-blue/30"
                    />
                  </Field>
                  <Field label="Avatar" icon={User} hint="Surukle-birak veya dosya secerek yukleyin">
                    <AvatarUploader
                      value={form.avatar_url}
                      onChange={(url) => set("avatar_url")(url)}
                      disabled={isPending}
                    />
                  </Field>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <SectionHeader title="Detaylar" delay="60ms" />
                <Field label="Bio" icon={AlignLeft}>
                  <textarea
                    placeholder="Kullanıcı hakkında kısa bir açıklama…"
                    value={form.bio}
                    onChange={(e) => set("bio")(e.target.value)}
                    disabled={isPending}
                    rows={3}
                    className={cn(
                      "w-full resize-none rounded-xl border border-border/60 bg-muted/30 px-3 py-2.5 text-sm text-foreground",
                      "placeholder:text-muted-foreground/50 outline-none",
                      "focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20",
                      "transition-all duration-200 disabled:opacity-50",
                    )}
                  />
                </Field>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <SectionHeader title="Ayarlar" delay="120ms" />
                <div className="flex flex-wrap items-end gap-6">
                  <Field label="Rol" icon={ShieldCheck} required>
                    <Select
                      value={form.role}
                      onValueChange={(v) => set("role")(v)}
                      disabled={isPending}
                    >
                      <SelectTrigger className="h-11 w-44 rounded-xl border-border/60 bg-muted/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <div className="flex items-center gap-3 pb-0.5">
                    <ActiveToggle value={form.active} onChange={(v) => set("active")(v)} />
                    <span className="text-sm font-medium text-foreground/80">
                      {form.active ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-border/40 bg-muted/20 px-6 py-4 sm:px-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/profiles/${id}`)}
                disabled={isPending}
                className="rounded-xl"
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="gap-2 rounded-xl border-0 text-white"
                style={{
                  background: "linear-gradient(135deg,#10b981,#3b82f6,#8b5cf6)",
                  backgroundSize: "200% auto",
                  animation: isPending ? "none" : "shimmer 3s linear infinite",
                  boxShadow: isPending ? "none" : "0 4px 16px rgba(59,130,246,0.35)",
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Kaydediliyor…
                  </>
                ) : (
                  <>
                    Değişiklikleri Kaydet
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
