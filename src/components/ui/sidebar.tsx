import { NavLink, useNavigate } from "react-router-dom";
import DarkModeToggle from "@/components/dark-mode-toggle";
import { useLoginState } from "@/hooks/use-login-state";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  FolderOpen,
  Tag,
  Users,
  LogOut,
  PenLine,
  Loader2,
} from "lucide-react";

/* ── Nav data ─────────────────────────────────────────── */
interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  end?: boolean;
  group: "Main" | "Content" | "System";
}

const NAV_GROUPS: { label: string; key: NavItem["group"] }[] = [
  { label: "MAIN",    key: "Main"    },
  { label: "CONTENT", key: "Content" },
  { label: "SYSTEM",  key: "System"  },
];

const navigationItems: NavItem[] = [
  { to: "/",           label: "Dashboard",  icon: LayoutDashboard, end: true, group: "Main"    },
  { to: "/posts",      label: "Posts",      icon: FileText,                   group: "Content" },
  { to: "/categories", label: "Categories", icon: FolderOpen,                 group: "Content" },
  { to: "/tags",       label: "Tags",       icon: Tag,                        group: "Content" },
  { to: "/series",     label: "Series",     icon: BookOpen,                   group: "Content" },
  { to: "/profiles",   label: "Profiles",   icon: Users,                      group: "System"  },
];

/* ── Single nav item ──────────────────────────────────── */
function NavItemLink({
  item,
  animIndex,
}: {
  item: NavItem;
  animIndex: number;
}) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.end}
      style={{ animationDelay: `${animIndex * 55}ms` }}
      className="block animate-slide-in-left"
    >
      {({ isActive }) => (
        <div
          className={cn(
            "group relative flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200",
            isActive
              ? "font-semibold text-foreground"
              : "font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground",
          )}
        >
          {/* Active: gradient bg overlay */}
          {isActive && (
            <span
              className="absolute inset-0 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, rgba(16,185,129,0.13) 0%, rgba(59,130,246,0.13) 50%, rgba(139,92,246,0.13) 100%)",
              }}
            />
          )}

          {/* Active: left indicator bar */}
          {isActive && (
            <span
              className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full"
              style={{
                background:
                  "linear-gradient(to bottom, #10b981, #3b82f6, #8b5cf6)",
              }}
            />
          )}

          <Icon
            className={cn(
              "relative z-10 h-4 w-4 shrink-0 transition-colors duration-200",
              isActive
                ? "text-brand-blue"
                : "group-hover:text-foreground",
            )}
          />
          <span className="relative z-10 truncate">{item.label}</span>

          {/* Hover: subtle right arrow hint */}
          {!isActive && (
            <span className="relative z-10 ml-auto opacity-0 transition-opacity duration-200 group-hover:opacity-40">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                className="text-muted-foreground"
              >
                <path
                  d="M4.5 2.5L8 6L4.5 9.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
      )}
    </NavLink>
  );
}

/* ── Section label ────────────────────────────────────── */
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="mb-1 mt-5 flex items-center gap-2 px-3 first:mt-0">
      <span className="text-[10px] font-semibold tracking-widest text-muted-foreground/50">
        {label}
      </span>
      <span className="h-px flex-1 bg-border/50" />
    </div>
  );
}

/* ── Main sidebar ─────────────────────────────────────── */
export default function Sidebar() {
  const { logout, isActionable, isLoading } = useLoginState();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch {
      /* noop */
    }
  };

  /* Global animation index across groups */
  let animIdx = 0;

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border/50 bg-card/80 backdrop-blur-xl">

      {/* Top brand accent line */}
      <div
        className="h-[2px] w-full shrink-0"
        style={{
          background:
            "linear-gradient(90deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
        }}
      />

      {/* ── Header / Logo ────────────────────────────── */}
      <div className="flex h-16 shrink-0 items-center border-b border-border/40 px-5">
        <div className="flex items-center gap-3">
          {/* Brand icon */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{
              background:
                "linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)",
              boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
            }}
          >
            <PenLine className="h-[18px] w-[18px] text-white" strokeWidth={2.5} />
          </div>

          {/* Brand name */}
          <span className="text-lg font-bold tracking-tight text-brand-gradient">
            BlogPanel
          </span>
        </div>
      </div>

      {/* ── Navigation ───────────────────────────────── */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_GROUPS.map(({ label, key }) => {
          const items = navigationItems.filter((i) => i.group === key);
          if (items.length === 0) return null;
          return (
            <div key={key}>
              <SectionLabel label={label} />
              <div className="space-y-0.5">
                {items.map((item) => {
                  const idx = animIdx++;
                  return (
                    <NavItemLink key={item.to} item={item} animIndex={idx} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* ── Footer ───────────────────────────────────── */}
      <div className="shrink-0 border-t border-border/40 p-3 space-y-1">

        {/* Theme toggle row */}
        <div className="flex items-center justify-between rounded-xl px-3 py-2.5">
          <span className="text-sm font-medium text-muted-foreground">Theme</span>
          <DarkModeToggle />
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          disabled={!isActionable || isLoading}
          className={cn(
            "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
            "text-muted-foreground transition-all duration-200",
            "hover:bg-destructive/10 hover:text-destructive",
            "disabled:pointer-events-none disabled:opacity-50",
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          )}
          <span>{isLoading ? "Logging out…" : "Logout"}</span>
        </button>
      </div>
    </aside>
  );
}
