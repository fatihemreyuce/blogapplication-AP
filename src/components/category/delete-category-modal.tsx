import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X, Trash2, ShieldAlert, FolderOpen } from "lucide-react";
import type { Category } from "@/types/category.types";
import { cn } from "@/lib/utils";

function MiniCategoryCover({ category }: { category: Category }) {
  if (category.cover_image) {
    return (
      <img
        src={category.cover_image}
        alt={category.name}
        className="h-10 w-10 rounded-xl object-cover"
      />
    );
  }
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
      <FolderOpen className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function WarnRow({ text }: { text: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-foreground/80">
      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500/15">
        <X className="h-2.5 w-2.5 text-red-500" strokeWidth={3} />
      </span>
      {text}
    </li>
  );
}

interface DeleteCategoryModalProps {
  open: boolean;
  category: Category | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteCategoryModal({
  open,
  category,
  loading = false,
  onConfirm,
  onCancel,
}: DeleteCategoryModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const target = category?.slug ?? "";
  const isMatch = confirmText === target;

  useEffect(() => {
    if (open) {
      setConfirmText("");
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 120);
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open && !loading) onCancel();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, loading, onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMatch) {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      return;
    }
    onConfirm();
  };

  if (!open || !category) return null;

  return (
    <>
      <style>{`
        @keyframes modal-in {
          from { opacity:0; transform:scale(0.94) translateY(8px); }
          to   { opacity:1; transform:scale(1)    translateY(0);   }
        }
        @keyframes overlay-in {
          from { opacity:0; backdrop-filter:blur(0px); }
          to   { opacity:1; backdrop-filter:blur(6px); }
        }
        @keyframes danger-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); }
          50%     { box-shadow: 0 0 0 10px rgba(239,68,68,0.12); }
        }
        @keyframes shake {
          0%,100% { transform:translateX(0);    }
          20%     { transform:translateX(-6px);  }
          40%     { transform:translateX(6px);   }
          60%     { transform:translateX(-4px);  }
          80%     { transform:translateX(4px);   }
        }
      `}</style>

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "overlay-in 0.2s ease both" }}>
        <div className="absolute inset-0 bg-black/60" style={{ backdropFilter: "blur(6px)" }} onClick={() => !loading && onCancel()} />
        <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl" style={{ animation: "modal-in 0.25s cubic-bezier(0.23,1,0.32,1) both" }}>
          <div className="relative overflow-hidden bg-red-500/8 px-6 pb-5 pt-6">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />
            <button
              onClick={onCancel}
              disabled={loading}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative mb-4 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/15" style={{ animation: "danger-pulse 2.5s ease-in-out infinite" }}>
                <ShieldAlert className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Bu işlem geri alınamaz</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Kategoriyi kalıcı olarak silmek üzeresiniz.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-6 pt-5">
            <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3">
              <MiniCategoryCover category={category} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{category.name}</p>
                <p className="text-xs text-muted-foreground font-mono">/{category.slug}</p>
              </div>
              <span className="ml-auto shrink-0 rounded-full bg-red-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-red-500">
                SİLİNECEK
              </span>
            </div>

            <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-500">
                <AlertTriangle className="h-3.5 w-3.5" />
                Kalıcı olarak silinecekler
              </p>
              <ul className="space-y-2">
                <WarnRow text="Kategori kaydı ve açıklaması" />
                <WarnRow text="Kategoriye bağlı görünüm ilişkileri" />
                <WarnRow text="İlgili listeleme/filtre sonuçları" />
              </ul>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">
                Onaylamak için <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs font-semibold text-foreground">{target}</code> yazın:
              </label>
              <input
                ref={inputRef}
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={loading}
                autoComplete="off"
                spellCheck={false}
                placeholder={target}
                style={shaking ? { animation: "shake 0.45s ease both" } : undefined}
                className={cn(
                  "w-full rounded-xl border bg-muted/30 px-3 py-2.5 font-mono text-sm outline-none transition-all duration-200",
                  confirmText.length > 0 && !isMatch
                    ? "border-red-500/60 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-red-500"
                    : isMatch
                    ? "border-brand-green/60 focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 text-brand-green"
                    : "border-border/60 focus:border-brand-blue/60 focus:ring-2 focus:ring-brand-blue/20",
                )}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="rounded-xl border border-border/60 bg-background px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                disabled={!isMatch || loading}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all duration-200",
                  isMatch && !loading ? "opacity-100 shadow-[0_4px_16px_rgba(239,68,68,0.40)]" : "opacity-40 cursor-not-allowed",
                )}
                style={isMatch && !loading ? { background: "linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)" } : { background: "#6b7280" }}
              >
                <Trash2 className="h-4 w-4" />
                {loading ? "Siliniyor..." : "Evet, kalıcı olarak sil"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
