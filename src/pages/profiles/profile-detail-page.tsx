import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  User,
  Calendar,
  AlignLeft,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteProfileModal } from "@/components/profile/delete-profile-modal";
import { useProfile, useDeleteProfile } from "@/hooks/use-profile";
import type { Profile } from "@/types/profile.types";
import { cn } from "@/lib/utils";
import { getRoleConfig, heroStripGradientPair } from "@/lib/profile-role";

/* ── Avatar ───────────────────────────────────────────── */
function ProfileAvatar({ profile }: { profile: Profile }) {
  const name = profile.full_name ?? profile.username ?? "?";
  const initials = name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase();
  if (profile.avatar_url) {
    return <img src={profile.avatar_url} alt={name} className="h-24 w-24 rounded-2xl object-cover shadow-lg" />;
  }
  return (
    <div
      className="flex h-24 w-24 items-center justify-center rounded-2xl text-3xl font-bold text-white shadow-lg"
      style={{ background: getRoleConfig(profile.role).gradient }}
    >
      {initials}
    </div>
  );
}

/* ── Info card ────────────────────────────────────────── */
function InfoCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  delay: string;
}) {
  return (
    <div
      className="animate-scale-in rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-sm"
      style={{ animationDelay: delay }}
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="text-sm font-medium text-foreground">
        {value ?? <span className="text-muted-foreground/50 italic">—</span>}
      </div>
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <div className="h-24 w-24 animate-pulse rounded-2xl bg-muted" />
        <div className="space-y-3 flex-1">
          <div className="h-7 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-40 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────── */
export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

  const { data: profile, isLoading, error } = useProfile(id ?? "");
  const deleteMutation = useDeleteProfile();

  const handleDelete = async () => {
    if (!profile) return;
    try {
      await deleteMutation.mutateAsync(profile.id);
      toast.success("Profil silindi.");
      navigate("/profiles");
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setShowDelete(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      {/* ── Top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/profiles")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Profiles
        </button>

        {profile && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/profiles/${profile.id}/edit`)}
              className="gap-2 rounded-xl"
            >
              <Pencil className="h-4 w-4" />
              Düzenle
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDelete(true)}
              className="gap-2 rounded-xl border-red-300/40 text-red-500 hover:bg-red-500/5 hover:border-red-400/60 dark:border-red-800/40"
            >
              <Trash2 className="h-4 w-4" />
              Sil
            </Button>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <DetailSkeleton />
      ) : error || !profile ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 py-20 text-center">
          <p className="text-lg font-semibold text-foreground">Profil bulunamadı</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Bu ID ile kayıt mevcut değil.
          </p>
        </div>
      ) : (
        <>
          {/* ── Hero section ── */}
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
            {/* top gradient strip */}
            <div
              className="h-24 w-full"
              style={{
                background: `linear-gradient(135deg, ${heroStripGradientPair(profile.role)})`,
                opacity: 0.15,
              }}
            />
            <div className="absolute left-4 right-4 top-8 flex items-end gap-3 sm:left-6 sm:right-auto sm:gap-5">
              <div className="shrink-0 rounded-2xl ring-4 ring-card">
                <ProfileAvatar profile={profile} />
              </div>
              <div className="min-w-0 flex-1 pb-1">
                <h1 className="line-clamp-2 text-lg font-bold text-foreground sm:text-xl">
                  {profile.full_name ?? profile.username}
                </h1>
                <p className="truncate text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>
            {/* badges top-right */}
            <div className="absolute right-3 top-3 flex flex-wrap gap-1.5 sm:right-5 sm:top-4 sm:gap-2">
              <span
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
                  getRoleConfig(profile.role).bg,
                  getRoleConfig(profile.role).text,
                )}
              >
                <ShieldCheck className="mr-1 h-3 w-3" />
                {getRoleConfig(profile.role).label}
              </span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold",
                  profile.active
                    ? "bg-brand-green/10 text-brand-green"
                    : "bg-muted text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    profile.active ? "bg-brand-green" : "bg-muted-foreground/40",
                  )}
                />
                {profile.active ? "Aktif" : "Pasif"}
              </span>
            </div>
            {/* spacer for overlapping avatar */}
            <div className="h-12" />
          </div>

          {/* ── Info grid ── */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              icon={User}
              label="Tam Ad"
              value={profile.full_name}
              delay="0ms"
            />
            <InfoCard
              icon={User}
              label="Kullanıcı Adı"
              value={`@${profile.username}`}
              delay="50ms"
            />
            <InfoCard
              icon={User}
              label="ID"
              value={<span className="font-mono text-xs">{profile.id}</span>}
              delay="100ms"
            />
            <InfoCard
              icon={AlignLeft}
              label="Bio"
              value={profile.bio}
              delay="150ms"
            />
            <InfoCard
              icon={Calendar}
              label="Kayıt Tarihi"
              value={new Date(profile.created_at).toLocaleDateString("tr-TR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              delay="200ms"
            />
          </div>
        </>
      )}

      {/* ── Delete modal ── */}
      <DeleteProfileModal
        open={showDelete}
        profile={profile ?? null}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
