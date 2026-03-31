import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Users,
  UserCheck,
  ShieldCheck,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Filter,
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
import { DeleteProfileModal } from "@/components/profile/delete-profile-modal";
import {
  useProfiles,
  useProfileStats,
  useDeleteProfile,
} from "@/hooks/use-profile";
import type { Profile, ProfileRole } from "@/types/profile.types";
import { cn } from "@/lib/utils";

/* ── Role config ──────────────────────────────────────── */
const ROLE_CONFIG: Record<
  ProfileRole,
  { label: string; gradient: string; bg: string; text: string }
> = {
  admin: {
    label: "Admin",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    bg: "bg-brand-green/10",
    text: "text-brand-green",
  },
  editor: {
    label: "Editor",
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    bg: "bg-brand-blue/10",
    text: "text-brand-blue",
  },
  viewer: {
    label: "Viewer",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    bg: "bg-brand-purple/10",
    text: "text-brand-purple",
  },
};

/* ── Avatar initials ──────────────────────────────────── */
function ProfileAvatar({
  profile,
  size = "md",
}: {
  profile: Profile;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = { sm: "h-9 w-9 text-sm", md: "h-12 w-12 text-base", lg: "h-16 w-16 text-xl" };
  const name = profile.full_name ?? profile.username ?? "?";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
  const gradient = ROLE_CONFIG[profile.role].gradient;

  if (profile.avatar_url) {
    return (
      <img
        src={profile.avatar_url}
        alt={name}
        className={cn("rounded-xl object-cover", sizeClasses[size])}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl font-bold text-white",
        sizeClasses[size],
      )}
      style={{ background: gradient }}
    >
      {initials}
    </div>
  );
}

/* ── Role badge ───────────────────────────────────────── */
function RoleBadge({ role }: { role: ProfileRole }) {
  const c = ROLE_CONFIG[role];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        c.bg,
        c.text,
      )}
    >
      {c.label}
    </span>
  );
}

/* ── Stat card ────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  gradient,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | undefined;
  gradient: string;
  delay: string;
}) {
  return (
    <div
      className="animate-scale-in relative overflow-hidden rounded-2xl border border-border/50 bg-card p-5"
      style={{ animationDelay: delay }}
    >
      {/* bg glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10"
        style={{ background: gradient, filter: "blur(20px)" }}
      />
      <div className="flex items-center gap-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl"
          style={{ background: gradient, boxShadow: `0 4px 14px rgba(0,0,0,0.15)` }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {value ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Skeleton card ────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
      <div className="h-1.5 w-full animate-pulse bg-muted" />
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 animate-pulse rounded-xl bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
          <div className="h-6 w-14 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="flex gap-2 pt-1">
          <div className="h-8 flex-1 animate-pulse rounded-lg bg-muted" />
          <div className="h-8 flex-1 animate-pulse rounded-lg bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}

/* ── Profile card ─────────────────────────────────────── */
function ProfileCard({
  profile,
  index,
  onView,
  onEdit,
  onDelete,
}: {
  profile: Profile;
  index: number;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const roleConf = ROLE_CONFIG[profile.role];
  return (
    <div
      className="animate-scale-in group relative overflow-hidden rounded-2xl border border-border/50 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-[0_8px_32px_rgba(59,130,246,0.12)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Role-based top strip */}
      <div className="h-1.5 w-full" style={{ background: roleConf.gradient }} />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3">
          <ProfileAvatar profile={profile} size="md" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">
              {profile.full_name ?? profile.username}
            </h3>
            <p className="truncate text-xs text-muted-foreground">
              @{profile.username}
            </p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground/80">
              ID: {profile.id}
            </p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {profile.bio ?? "Biyografi yok"}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex items-center justify-between">
          <RoleBadge role={profile.role} />
          <span className="flex items-center gap-1.5 text-xs">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                profile.active ? "bg-brand-green" : "bg-muted-foreground/40",
              )}
            />
            <span
              className={cn(
                profile.active ? "text-brand-green" : "text-muted-foreground",
              )}
            >
              {profile.active ? "Active" : "Inactive"}
            </span>
          </span>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={onView}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background/50 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-brand-blue"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          <button
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/60 bg-background/50 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-brand-green/40 hover:bg-brand-green/5 hover:text-brand-green"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center rounded-lg border border-border/60 bg-background/50 px-2.5 py-1.5 text-muted-foreground transition-all duration-200 hover:border-red-400/40 hover:bg-red-500/5 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Pagination ───────────────────────────────────────── */
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

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all hover:border-brand-blue/40 hover:text-brand-blue disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-all",
            p === page
              ? "text-white"
              : "border border-border/60 text-muted-foreground hover:border-brand-blue/40 hover:text-brand-blue",
          )}
          style={
            p === page
              ? {
                  background:
                    "linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)",
                }
              : undefined
          }
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-all hover:border-brand-blue/40 hover:text-brand-blue disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* ── Main page ────────────────────────────────────────── */
export default function ProfileListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const roleFilterParam = searchParams.get("role");
  const statusFilterParam = searchParams.get("status");
  const pageParam = Number(searchParams.get("page") ?? "1");
  const searchParam = searchParams.get("q") ?? "";

  const roleFilter: "all" | ProfileRole =
    roleFilterParam === "admin" || roleFilterParam === "editor" || roleFilterParam === "viewer"
      ? roleFilterParam
      : "all";
  const statusFilter: "all" | "active" | "inactive" =
    statusFilterParam === "active" || statusFilterParam === "inactive"
      ? statusFilterParam
      : "all";
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const [searchInput, setSearchInput] = useState(searchParam);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  /* keep input in sync with URL q param */
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  /* debounce search -> URL */
  useEffect(() => {
    const t = setTimeout(() => {
      const nextSearch = searchInput.trim();
      const currentSearch = searchParams.get("q") ?? "";
      if (nextSearch === currentSearch) return;

      const next = new URLSearchParams(searchParams);
      if (nextSearch) next.set("q", nextSearch);
      else next.delete("q");
      next.set("page", "1");
      setSearchParams(next, { replace: true });
    }, 380);
    return () => clearTimeout(t);
  }, [searchInput, searchParams, setSearchParams]);

  const filters = { search: searchParam, role: roleFilter, active: statusFilter, page, pageSize: 9 };
  const { data, isLoading } = useProfiles(filters);
  const { data: stats } = useProfileStats();
  const deleteMutation = useDeleteProfile();

  const normalizedSearch = searchParam.trim().toLowerCase();
  const visibleProfiles = (data?.data ?? []).filter((profile) => {
    const matchesSearch =
      !normalizedSearch ||
      profile.username.toLowerCase().includes(normalizedSearch) ||
      (profile.full_name ?? "").toLowerCase().includes(normalizedSearch) ||
      (profile.bio ?? "").toLowerCase().includes(normalizedSearch);

    const matchesRole = roleFilter === "all" || profile.role === roleFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" ? profile.active : !profile.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      toast.success(`${deleteTarget.full_name ?? deleteTarget.username} silindi.`);
    } catch {
      toast.error("Silinemedi.");
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="animate-fade-in space-y-6 p-1">
      {/* ── Page header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Profiles</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Yukleniyor..." : `${visibleProfiles.length} profil bulundu`}
          </p>
        </div>
        <Button
          onClick={() => navigate("/profiles/create")}
          className="gap-2 rounded-xl border-0 text-white"
          style={{
            background: "linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)",
            boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
          }}
        >
          <Plus className="h-4 w-4" />
          New Profile
        </Button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Profiles"
          value={stats?.total}
          gradient="linear-gradient(135deg, #3b82f6, #8b5cf6)"
          delay="0ms"
        />
        <StatCard
          icon={UserCheck}
          label="Active"
          value={stats?.active}
          gradient="linear-gradient(135deg, #10b981, #3b82f6)"
          delay="60ms"
        />
        <StatCard
          icon={ShieldCheck}
          label="Admins"
          value={stats?.admins}
          gradient="linear-gradient(135deg, #8b5cf6, #10b981)"
          delay="120ms"
        />
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Profil ara…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-10 rounded-xl border-border/60 bg-card pl-9 focus-visible:ring-brand-blue/30"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select
            value={roleFilter}
            onValueChange={(v) => {
              const nextRole = v as "all" | ProfileRole;
              const next = new URLSearchParams(searchParams);
              if (nextRole === "all") next.delete("role");
              else next.set("role", nextRole);
              next.set("page", "1");
              setSearchParams(next);
            }}
          >
            <SelectTrigger className="h-10 w-36 rounded-xl border-border/60 bg-card focus:ring-brand-blue/30">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Roller</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => {
              const nextStatus = v as "all" | "active" | "inactive";
              const next = new URLSearchParams(searchParams);
              if (nextStatus === "all") next.delete("status");
              else next.set("status", nextStatus);
              next.set("page", "1");
              setSearchParams(next);
            }}
          >
            <SelectTrigger className="h-10 w-36 rounded-xl border-border/60 bg-card focus:ring-brand-blue/30">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="active">Aktif</SelectItem>
              <SelectItem value="inactive">Pasif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : !visibleProfiles.length ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/50 border-dashed bg-card/50 py-20 text-center">
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6)", opacity: 0.7 }}
          >
            <Users className="h-7 w-7 text-white" />
          </div>
          <p className="text-lg font-semibold text-foreground">Profil bulunamadı</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtrelerinizi değiştirin ya da yeni bir profil ekleyin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleProfiles.map((profile, i) => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              index={i}
              onView={() => navigate(`/profiles/${profile.id}`)}
              onEdit={() => navigate(`/profiles/${profile.id}/edit`)}
              onDelete={() => setDeleteTarget(profile)}
            />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {data && data.totalPages > 1 && (
        <div className="pt-2">
          <Pagination
            page={page}
            totalPages={data.totalPages}
            onChange={(nextPage) => {
              const next = new URLSearchParams(searchParams);
              next.set("page", String(nextPage));
              setSearchParams(next);
            }}
          />
        </div>
      )}

      {/* ── Delete modal ── */}
      <DeleteProfileModal
        open={!!deleteTarget}
        profile={deleteTarget}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
