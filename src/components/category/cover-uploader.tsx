import { useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const CATEGORY_COVER_BUCKET = "category-covers";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type CoverUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export function CoverUploader({ value, onChange, disabled }: CoverUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) return "Sadece resim dosyasi yuklenebilir.";
    if (file.size > MAX_FILE_SIZE) return "Maksimum dosya boyutu 5MB olmali.";
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const path = `categories/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(CATEGORY_COVER_BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });

      if (uploadError) {
        throw new Error(
          uploadError.message.includes("Bucket not found")
            ? "Supabase Storage'da 'category-covers' bucket'i bulunamadi. Public bir bucket olustur."
            : uploadError.message,
        );
      }

      const { data } = supabase.storage.from(CATEGORY_COVER_BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resim yuklenemedi.");
    } finally {
      setIsUploading(false);
    }
  };

  const onFileSelect = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || disabled || isUploading) return;
    await uploadFile(file);
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || isUploading}
        onChange={(e) => onFileSelect(e.target.files)}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled && !isUploading) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !isUploading) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          void onFileSelect(e.dataTransfer.files);
        }}
        className={cn(
          "flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 p-3 text-center transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-brand-blue/20",
          isDragOver && "border-brand-blue bg-brand-blue/5",
          (disabled || isUploading) && "cursor-not-allowed opacity-70",
        )}
      >
        {isUploading ? (
          <>
            <Loader2 className="mb-2 h-5 w-5 animate-spin text-brand-blue" />
            <p className="text-sm font-medium">Kapak yukleniyor...</p>
          </>
        ) : (
          <>
            <Upload className="mb-2 h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Kapagi surukle birak ya da sec</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP - max 5MB</p>
          </>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ImagePlus className="h-3.5 w-3.5" />
          {value ? "Kapak yuklendi" : "Henuz kapak secilmedi"}
        </div>
        {value && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="h-7 rounded-lg px-2"
            onClick={() => onChange("")}
            disabled={disabled || isUploading}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Kaldir
          </Button>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
