import { Check, Tag, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TagOption = {
  id: string;
  name: string;
  slug: string;
};

type PostTagSelectorProps = {
  options: TagOption[];
  selectedIds: string[];
  onChange: (nextIds: string[]) => void;
  disabled?: boolean;
};

export function PostTagSelector({
  options,
  selectedIds,
  onChange,
  disabled,
}: PostTagSelectorProps) {
  const toggle = (id: string) => {
    if (disabled) return;
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  const selectedTags = options.filter((tag) => selectedIds.includes(tag.id));

  return (
    <div className="space-y-2 rounded-xl border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground">
          {selectedTags.length > 0 ? `${selectedTags.length} etiket seçildi` : "Etiket seçimi"}
        </p>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={() => !disabled && onChange([])}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:opacity-50"
          >
            <X className="h-3 w-3" />
            Temizle
          </button>
        )}
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center gap-1 rounded-full bg-brand-blue/10 px-2.5 py-1 text-xs font-medium text-brand-blue"
            >
              <Tag className="h-3 w-3" />
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {options.map((tag) => {
          const selected = selectedIds.includes(tag.id);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggle(tag.id)}
              disabled={disabled}
              className={cn(
                "group inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all",
                selected
                  ? "border-brand-blue/60 bg-brand-blue/10 text-brand-blue shadow-[0_0_0_1px_rgba(59,130,246,0.15)]"
                  : "border-border/70 bg-background text-foreground/80 hover:border-brand-blue/40 hover:bg-brand-blue/5",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              <span
                className={cn(
                  "flex h-3.5 w-3.5 items-center justify-center rounded-[4px] border",
                  selected ? "border-brand-blue bg-brand-blue text-white" : "border-border/80 bg-background",
                )}
              >
                {selected && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
              </span>
              <span>{tag.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
