import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  AlignLeft,
  Calendar,
  FileText,
  Link2,
  Pencil,
  Trash2,
  User,
  Text,
  Tag,
  Eye,
  Sparkles,
  ImageIcon,
  Clock,
  CalendarClock,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeletePost, usePost } from "@/hooks/use-post";
import { DeletePostModal } from "@/components/posts/delete-post-modal";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  draft: { label: "Taslak", bg: "bg-muted", text: "text-muted-foreground" },
  published: { label: "Yayında", bg: "bg-brand-green/10", text: "text-brand-green" },
  scheduled: { label: "Zamanlanmış", bg: "bg-brand-blue/10", text: "text-brand-blue" },
  archived: { label: "Arşivlenmiş", bg: "bg-brand-purple/10", text: "text-brand-purple" },
};

function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">{title}</span>
      <span className="h-px flex-1 bg-border/50" />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  wide,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={cn("animate-scale-in rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-sm", wide && "sm:col-span-2 lg:col-span-3")}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground">{value ?? <span className="italic text-muted-foreground/50">—</span>}</div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const { data: post, isLoading } = usePost(id ?? "");
  const deleteMutation = useDeletePost();

  if (isLoading) return <DetailSkeleton />;

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/50 py-20 text-center">
        <FileText className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-lg font-semibold">Post bulunamadı</p>
        <p className="mt-1 text-sm text-muted-foreground">Bu ID ile kayıt mevcut değil.</p>
      </div>
    );
  }

  const statusConf = STATUS_CONFIG[post.status] ?? STATUS_CONFIG.draft;

  return (
    <div className="animate-fade-in space-y-6 p-1">
      {/* Breadcrumb + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/posts")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Posts
        </button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={() => navigate(`/posts/${post.id}/edit`)}>
            <Pencil className="h-4 w-4" />
            Düzenle
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-xl border-red-300/40 text-red-500 hover:bg-red-500/5 hover:border-red-400/60"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="h-4 w-4" />
            Sil
          </Button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
        <div
          className="h-28 w-full"
          style={{
            background: post.cover_image
              ? `url(${post.cover_image}) center/cover no-repeat`
              : "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
          }}
        />
        {post.cover_image && <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-transparent to-card/80" />}

        <div className="absolute left-6 top-14 flex items-end gap-4">
          <div className="rounded-2xl ring-4 ring-card">
            {post.cover_image ? (
              <img src={post.cover_image} alt={post.title} className="h-20 w-20 rounded-2xl object-cover" />
            ) : (
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl text-white"
                style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}
              >
                <FileText className="h-9 w-9" />
              </div>
            )}
          </div>
          <div className="pb-1">
            <h1 className="text-xl font-bold text-foreground">{post.title}</h1>
            <p className="text-sm text-muted-foreground font-mono">/{post.slug}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute right-5 top-4 flex gap-2">
          <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold", statusConf.bg, statusConf.text)}>
            {statusConf.label}
          </span>
          {post.is_featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-purple/10 px-3 py-1 text-xs font-semibold text-brand-purple">
              <Sparkles className="h-3 w-3" />
              Öne Çıkan
            </span>
          )}
        </div>

        <div className="h-14" />
      </div>

      {/* Özet */}
      {post.excerpt && (
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <SectionHeader title="Özet" icon={Text} />
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{post.excerpt}</p>
        </div>
      )}

      {/* İçerik */}
      {post.content && (
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <SectionHeader title="İçerik" icon={AlignLeft} />
          <div className="mt-3 max-h-60 overflow-auto text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {post.content}
          </div>
        </div>
      )}

      {/* Temel Bilgiler */}
      <div className="space-y-3">
        <SectionHeader title="Temel Bilgiler" icon={FileText} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={User} label="Yazar" value={<span className="font-mono text-xs">{post.author_id ?? "—"}</span>} />
          <InfoCard icon={Tag} label="Kategori" value={<span className="font-mono text-xs">{post.category_id ?? "—"}</span>} />
          <InfoCard icon={Link2} label="Slug" value={<span className="font-mono">/{post.slug}</span>} />
        </div>
      </div>

      {/* Zamanlama */}
      <div className="space-y-3">
        <SectionHeader title="Zamanlama" icon={CalendarClock} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={Calendar} label="Yayın Tarihi" value={post.published_at ? new Date(post.published_at).toLocaleString("tr-TR") : null} />
          <InfoCard icon={CalendarClock} label="Zamanlanmış" value={post.scheduled_at ? new Date(post.scheduled_at).toLocaleString("tr-TR") : null} />
          <InfoCard icon={Calendar} label="Oluşturulma" value={new Date(post.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })} />
          <InfoCard icon={Clock} label="Güncellenme" value={post.updated_at ? new Date(post.updated_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" }) : null} />
        </div>
      </div>

      {/* İstatistikler */}
      <div className="space-y-3">
        <SectionHeader title="İstatistikler" icon={Eye} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/50 bg-card p-5 text-center">
            <Eye className="mx-auto mb-2 h-5 w-5 text-brand-blue" />
            <p className="text-2xl font-bold tabular-nums">{post.views ?? 0}</p>
            <p className="text-xs text-muted-foreground">Görüntülenme</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-5 text-center">
            <Clock className="mx-auto mb-2 h-5 w-5 text-brand-green" />
            <p className="text-2xl font-bold tabular-nums">{post.reading_time ?? 0} dk</p>
            <p className="text-xs text-muted-foreground">Okuma Süresi</p>
          </div>
          <div className="rounded-xl border border-border/50 bg-card p-5 text-center">
            <Sparkles className="mx-auto mb-2 h-5 w-5 text-brand-purple" />
            <p className="text-2xl font-bold">{post.is_featured ? "Evet" : "Hayır"}</p>
            <p className="text-xs text-muted-foreground">Öne Çıkan</p>
          </div>
        </div>
      </div>

      {/* Görseller */}
      <div className="space-y-3">
        <SectionHeader title="Görseller" icon={ImageIcon} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Kapak Fotosu */}
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Kapak Fotosu</span>
            </div>
            {post.cover_image ? (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-lg border border-border/30">
                  <img
                    src={post.cover_image}
                    alt="Kapak"
                    className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="truncate text-xs font-mono text-muted-foreground/60">{post.cover_image}</p>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground/50">Kapak fotosu yok</p>
                </div>
              </div>
            )}
          </div>

          {/* OG Görseli */}
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="mb-3 flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">OG Görseli</span>
            </div>
            {post.og_image ? (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-lg border border-border/30">
                  <img
                    src={post.og_image}
                    alt="OG Image"
                    className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <p className="truncate text-xs font-mono text-muted-foreground/60">{post.og_image}</p>
              </div>
            ) : (
              <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/30">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground/50">OG görseli yok</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO */}
      {post.meta_description && (
        <div className="space-y-3">
          <SectionHeader title="SEO & Meta" icon={BookOpen} />
          <div className="rounded-xl border border-border/50 bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Text className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Meta Açıklama</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">{post.meta_description}</p>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <DeletePostModal
        open={showDelete}
        post={post}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDelete(false)}
        onConfirm={async () => {
          try {
            await deleteMutation.mutateAsync(post.id);
            toast.success("Post silindi.");
            navigate("/posts");
          } catch {
            toast.error("Post silinemedi.");
          } finally {
            setShowDelete(false);
          }
        }}
      />
    </div>
  );
}
