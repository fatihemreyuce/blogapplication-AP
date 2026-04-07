import { useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
}

export function TiltCard({ children, className }: TiltCardProps) {
  const [style, setStyle] = useState<CSSProperties>({});

  const onMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = (y / rect.height - 0.5) * -10;
    const rotateY = (x / rect.width - 0.5) * 10;
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
    });
  };

  const reset = () => setStyle({ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)" });

  return (
    <div
      style={style}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn(
        "transition-transform duration-200 will-change-transform",
        "hover:shadow-[0_16px_40px_rgba(59,130,246,0.2)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
