import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, AlignLeft, BookOpen, Calendar, ImageIcon, Link2, Pencil, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteSeries, useSeriesDetail } from "@/hooks/use-series";
import { DeleteSeriesModal } from "@/components/series/delete-series-modal";

function SectionHeader({ title, icon: Icon }: { title: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">{title}</span>
      <span className="h-px flex-1 bg-border/50" />
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode }) {
  return (
    <div className="animate-scale-in rounded-xl border border-border/50 bg-card p-4 transition-all duration-200 hover:border-border hover:shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className="text-sm font-medium text-foreground">{value ?? <span className="italic text-muted-foreground/50">—</span>}</div>
    </div>
  );
}

export default function SeriesDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);
  const { data: series, isLoading } = useSeriesDetail(id ?? "");
  const deleteMutation = useDeleteSeries();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-40 animate-pulse rounded-2xl bg-muted" />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-card/50 py-20 text-center">
        <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-lg font-semibold">Seri bulunamadı</p>
        <p className="mt-1 text-sm text-muted-foreground">Bu ID ile kayıt mevcut değil.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6 p-1">
      {/* Breadcrumb + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate("/series")}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Series
        </button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={() => navigate(`/series/${series.id}/edit`)}>
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
            background: series.cover_image
              ? `url(${series.cover_image}) center/cover no-repeat`
              : "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.15), rgba(139,92,246,0.15))",
          }}
        />
        {series.cover_image && <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-transparent to-card/80" />}

        <div className="absolute left-4 right-4 top-14 flex items-end gap-3 sm:left-6 sm:right-auto sm:gap-4">
          <div className="shrink-0 rounded-2xl ring-4 ring-card">
            {series.cover_image ? (
              <img src={series.cover_image} alt={series.title} className="h-16 w-16 rounded-2xl object-cover sm:h-20 sm:w-20" />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-white sm:h-20 sm:w-20"
                style={{ background: "linear-gradient(135deg, #10b981, #3b82f6)" }}
              >
                <BookOpen className="h-7 w-7 sm:h-9 sm:w-9" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <h1 className="line-clamp-2 text-lg font-bold text-foreground sm:text-xl">{series.title}</h1>
            <p className="truncate text-sm text-muted-foreground font-mono">/{series.slug}</p>
          </div>
        </div>

        <div className="h-12 sm:h-14" />
      </div>

      {/* Açıklama */}
      {series.description && (
        <div className="rounded-2xl border border-border/50 bg-card p-5">
          <SectionHeader title="Açıklama" icon={AlignLeft} />
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">{series.description}</p>
        </div>
      )}

      {/* Temel Bilgiler */}
      <div className="space-y-3">
        <SectionHeader title="Temel Bilgiler" icon={BookOpen} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <InfoCard icon={BookOpen} label="Başlık" value={series.title} />
          <InfoCard icon={Link2} label="Slug" value={<span className="font-mono">/{series.slug}</span>} />
          <InfoCard icon={User} label="Author ID" value={series.author_id ? <span className="font-mono text-xs">{series.author_id}</span> : null} />
          <InfoCard icon={Calendar} label="Oluşturma Tarihi" value={new Date(series.created_at).toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })} />
        </div>
      </div>

      {/* Kapak Görseli */}
      <div className="space-y-3">
        <SectionHeader title="Kapak Görseli" icon={ImageIcon} />
        <div className="rounded-xl border border-border/50 bg-card p-4">
          {series.cover_image ? (
            <div className="space-y-2">
              <div className="overflow-hidden rounded-lg border border-border/30">
                <img
                  src={series.cover_image}
                  alt="Kapak"
                  className="h-48 w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <p className="truncate text-xs font-mono text-muted-foreground/60">{series.cover_image}</p>
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/30">
              <div className="text-center">
                <ImageIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/50">Kapak görseli yok</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteSeriesModal
        open={showDelete}
        series={series}
        loading={deleteMutation.isPending}
        onCancel={() => setShowDelete(false)}
        onConfirm={async () => {
          try {
            await deleteMutation.mutateAsync(series.id);
            toast.success("Seri silindi.");
            navigate("/series");
          } catch {
            toast.error("Seri silinemedi.");
          } finally {
            setShowDelete(false);
          }
        }}
      />
    </div>
  );
}
