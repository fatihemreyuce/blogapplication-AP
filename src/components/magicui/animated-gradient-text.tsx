import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedGradientTextProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedGradientText({
  children,
  className,
}: AnimatedGradientTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-brand-gradient-h bg-[length:220%_220%] bg-clip-text text-transparent",
        "animate-gradient-shift",
        className,
      )}
    >
      {children}
    </span>
  );
}
