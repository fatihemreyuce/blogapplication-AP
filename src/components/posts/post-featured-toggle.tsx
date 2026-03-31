import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type PostFeaturedToggleProps = {
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
};

export function PostFeaturedToggle({
  checked,
  onChange,
  disabled,
}: PostFeaturedToggleProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className={cn("h-4 w-4", checked ? "text-brand-purple" : "text-muted-foreground")} />
          <div>
            <p className="text-sm font-medium text-foreground">Öne Çıkarılmış</p>
            <p className="text-xs text-muted-foreground">
              {checked ? "Bu yazı öne çıkan içeriklerde görünecek." : "Normal içerik olarak listelenecek."}
            </p>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 focus:outline-none",
            checked ? "bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500" : "bg-muted",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <span
            className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
              checked ? "translate-x-6" : "translate-x-1",
            )}
          />
        </button>
      </div>
    </div>
  );
}
