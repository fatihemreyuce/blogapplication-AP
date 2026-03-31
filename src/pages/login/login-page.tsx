import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginState } from "@/hooks/use-login-state";
import type { LoginRequest } from "@/types/auth.types";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Floating orb ─────────────────────────────────────── */
function Orb({
  size,
  top,
  left,
  delay,
  gradient,
}: {
  size: number;
  top: string;
  left: string;
  delay: string;
  gradient: string;
}) {
  return (
    <div
      className="animate-orb-float pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: gradient,
        filter: "blur(80px)",
        opacity: 0.38,
        animationDelay: delay,
      }}
    />
  );
}

/* ── Grid overlay ─────────────────────────────────────── */
function GridOverlay() {
  return (
    <div
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage:
          "linear-gradient(rgba(128,128,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.06) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
        maskImage:
          "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
      }}
    />
  );
}

/* ── Login page ───────────────────────────────────────── */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});

  const cardRef = useRef<HTMLDivElement>(null);
  const { login, isLoading, isLoggedIn } = useLoginState();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn, navigate]);

  /* 3-D tilt on mouse move */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rx = (((e.clientY - rect.top)  / rect.height) - 0.5) *  14;
    const ry = (((e.clientX - rect.left) / rect.width)  - 0.5) * -14;
    setCardStyle({
      transform: `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(12px)`,
      transition: "transform 0.08s linear",
    });
  };

  const handleMouseLeave = () => {
    setCardStyle({
      transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      transition: "transform 0.55s cubic-bezier(0.23,1,0.32,1)",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password } satisfies LoginRequest);
      navigate("/");
    } catch {
      toast.error("E-posta veya şifre hatalı.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormDisabled = isLoading || isSubmitting;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4 py-12">
      <GridOverlay />

      {/* Orbs — green · blue · purple palette */}
      <Orb size={540} top="-12%" left="-10%"  delay="0s"   gradient="radial-gradient(circle, #10b981, #3b82f6)" />
      <Orb size={440} top="55%"  left="68%"   delay="-3s"  gradient="radial-gradient(circle, #3b82f6, #8b5cf6)" />
      <Orb size={320} top="72%"  left="-6%"   delay="-5s"  gradient="radial-gradient(circle, #8b5cf6, #10b981)" />
      <Orb size={220} top="18%"  left="78%"   delay="-2s"  gradient="radial-gradient(circle, #10b981, #8b5cf6)" />
      <Orb size={180} top="40%"  left="42%"   delay="-4s"  gradient="radial-gradient(circle, #3b82f6, #10b981)" />

      {/* ── Card ── */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="animate-card-in relative z-10 w-full max-w-md"
        style={{ willChange: "transform", ...cardStyle }}
      >
        {/* Animated border glow */}
        <div
          className="animate-border-pulse pointer-events-none absolute -inset-[1px] rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, #10b981, #3b82f6, #8b5cf6, #10b981)",
            backgroundSize: "300% 300%",
            animation:
              "border-pulse 3s ease-in-out infinite, gradient-shift 4s ease infinite",
            zIndex: -1,
          }}
        />

        {/* Glass panel */}
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10"
          style={{
            background: "hsl(var(--card) / 0.78)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
          }}
        >
          {/* Top inner shine */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
          />

          {/* Header */}
          <div className="px-8 pt-10 pb-2 text-center">
            {/* Logo mark */}
            <div className="mb-5 flex justify-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
                  boxShadow: "0 0 32px rgba(59,130,246,0.45)",
                }}
              >
                <Lock className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Tekrar hoş geldiniz
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Devam etmek için hesabınıza giriş yapın
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 px-8 pb-8 pt-6">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-foreground/80">
                E-posta
              </Label>
              <div className="group relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-brand-blue" />
                <Input
                  id="email"
                  type="email"
                  placeholder="siz@ornek.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isFormDisabled}
                  className={cn(
                    "h-11 rounded-xl border-border/60 bg-muted/40 pl-10",
                    "placeholder:text-muted-foreground/50",
                    "transition-all duration-200",
                    "focus-visible:border-brand-blue/60 focus-visible:ring-2 focus-visible:ring-brand-blue/30",
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-foreground/80">
                Şifre
              </Label>
              <div className="group relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-200 group-focus-within:text-brand-blue" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isFormDisabled}
                  className={cn(
                    "h-11 rounded-xl border-border/60 bg-muted/40 pl-10 pr-11",
                    "placeholder:text-muted-foreground/50",
                    "transition-all duration-200",
                    "focus-visible:border-brand-blue/60 focus-visible:ring-2 focus-visible:ring-brand-blue/30",
                  )}
                />
                {/* Show / hide toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  disabled={isFormDisabled}
                  aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-200 hover:text-foreground focus:outline-none disabled:pointer-events-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-1">
              <Button
                type="submit"
                disabled={isFormDisabled}
                className="group relative h-11 w-full overflow-hidden rounded-xl border-0 text-sm font-semibold text-white disabled:opacity-70"
                style={{
                  background:
                    "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
                  backgroundSize: "200% auto",
                  animation: isFormDisabled ? "none" : "shimmer 3s linear infinite",
                  boxShadow: isFormDisabled
                    ? "none"
                    : "0 4px 24px rgba(59,130,246,0.40)",
                }}
              >
                {isFormDisabled ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Giriş yapılıyor…
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Giriş Yap
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
