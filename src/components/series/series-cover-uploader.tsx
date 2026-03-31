import { useRef, useState } from "react";
import { Loader2, Upload, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const BUCKET = "series-covers";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

type SeriesCoverUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
};

export function SeriesCoverUploader({ value, onChange, disabled }: SeriesCoverUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith("image/")) return "Sadece resim dosyası yüklenebilir.";
    if (file.size > MAX_FILE_SIZE) return "Maksimum dosya boyutu 5MB olmalı.";
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
      const path = `series/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false, contentType: file.type });

      if (uploadError) {
        throw new Error(
          uploadError.message.includes("Bucket not found")
            ? `Supabase Storage'da '${BUCKET}' bucket'ı bulunamadı. Public bir bucket oluştur.`
            : uploadError.message,
        );
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
      toast.success("Kapak görseli başarıyla yüklendi!");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Resim yüklenemedi.";
      setError(msg);
      toast.error("Görsel yüklenemedi: " + msg);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileSelect = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file || disabled || isUploading) return;
    await uploadFile(file);
  };

  if (value) {
    return (
      <div className="space-y-2">
        <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-card">
          <img
            src={value}
            alt="Kapak görseli"
            className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex items-center gap-1.5 text-white">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Yüklendi</span>
            </div>
            <div className="flex gap-1.5">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                className="h-7 rounded-lg px-2 text-xs"
                onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
                disabled={disabled || isUploading}
              >
                Değiştir
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="h-7 rounded-lg px-2 text-xs"
                onClick={() => onChange("")}
                disabled={disabled || isUploading}
              >
                <X className="mr-1 h-3 w-3" />
                Kaldır
              </Button>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled || isUploading}
          onChange={(e) => onFileSelect(e.target.files)}
        />
        {error && (
          <div className="rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-2">
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}
      </div>
    );
  }

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
          "flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20 p-4 text-center transition-all",
          "hover:border-brand-blue/40 hover:bg-brand-blue/5",
          "focus:outline-none focus:ring-2 focus:ring-brand-blue/20",
          isDragOver && "border-brand-blue bg-brand-blue/10 scale-[1.01]",
          (disabled || isUploading) && "cursor-not-allowed opacity-70",
        )}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-brand-blue/10 p-3">
              <Loader2 className="h-6 w-6 animate-spin text-brand-blue" />
            </div>
            <p className="text-sm font-medium">Yükleniyor...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-muted/50 p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Kapağı sürükle bırak ya da seç</p>
              <p className="mt-0.5 text-xs text-muted-foreground">PNG, JPG, WEBP &middot; max 5MB</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-300/40 bg-red-500/10 px-3 py-2">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
