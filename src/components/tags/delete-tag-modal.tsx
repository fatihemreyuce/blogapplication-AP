import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Hash, ShieldAlert, Trash2, X } from "lucide-react";
import type { Tag } from "@/types/tags.types";
import { cn } from "@/lib/utils";

interface DeleteTagModalProps {
  open: boolean;
  tag: Tag | null;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteTagModal({
  open,
  tag,
  loading = false,
  onConfirm,
  onCancel,
}: DeleteTagModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const [shaking, setShaking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const target = tag?.slug ?? "";
  const isMatch = confirmText === target;

  useEffect(() => {
    if (open) {
      setConfirmText("");
      setTimeout(() => inputRef.current?.focus(), 120);
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  if (!open || !tag) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && onCancel()} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
        <div className="relative bg-red-500/8 px-6 pb-5 pt-6">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-red-500 via-rose-500 to-red-600" />
          <button
            onClick={onCancel}
            disabled={loading}
            className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/15">
              <ShieldAlert className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Bu işlem geri alınamaz</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Tag kaydını kalıcı olarak sileceksiniz.</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isMatch) {
              setShaking(true);
              setTimeout(() => setShaking(false), 450);
              return;
            }
            onConfirm();
          }}
          className="space-y-5 px-6 pb-6 pt-5"
        >
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue">
              <Hash className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{tag.name}</p>
              <p className="text-xs text-muted-foreground font-mono">/{tag.slug}</p>
            </div>
          </div>

          <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-500">
              <AlertTriangle className="h-3.5 w-3.5" />
              Dikkat
            </p>
            <p className="text-sm text-foreground/80">Bu tag artık içeriklerde kullanılamaz hale gelir.</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Onaylamak için <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">{target}</code> yazın:
            </label>
            <input
              ref={inputRef}
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={target}
              disabled={loading}
              style={shaking ? { animation: "shake 0.45s ease both" } : undefined}
              className={cn(
                "w-full rounded-xl border bg-muted/30 px-3 py-2.5 font-mono text-sm outline-none",
                isMatch
                  ? "border-brand-green/60 focus:ring-2 focus:ring-brand-green/20"
                  : "border-border/60 focus:ring-2 focus:ring-brand-blue/20",
              )}
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onCancel} className="rounded-xl border border-border/60 px-4 py-2 text-sm">
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!isMatch || loading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" />
              {loading ? "Siliniyor..." : "Kalıcı olarak sil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
