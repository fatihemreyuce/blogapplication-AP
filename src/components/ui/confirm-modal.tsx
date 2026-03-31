import { useEffect } from "react";
import { Button } from "./button";

interface ConfirmModalProps {
	open: boolean;
	title?: string;
	description?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm: () => void;
	onCancel: () => void;
	loading?: boolean;
}

export function ConfirmModal({
	open,
	title = "Onayla",
	description,
	confirmText = "Evet",
	cancelText = "Vazgeç",
	onConfirm,
	onCancel,
	loading = false,
}: ConfirmModalProps) {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = "";
			};
		}
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/60" onClick={onCancel} />
			<div className="relative z-10 w-full max-w-sm rounded-lg border bg-card p-5 text-card-foreground shadow-lg">
				<h3 className="text-lg font-semibold">{title}</h3>
				{description ? (
					<p className="mt-2 text-sm text-muted-foreground">{description}</p>
				) : null}
				<div className="mt-5 flex items-center justify-end gap-2">
					<Button variant="outline" onClick={onCancel} disabled={loading}>
						{cancelText}
					</Button>
					<Button variant="destructive" onClick={onConfirm} aria-busy={loading} disabled={loading}>
						{loading ? "Lütfen bekleyin..." : confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
}


