import type { ProfileRole } from "@/types/profile.types";

const VALID_ROLES: ProfileRole[] = ["admin", "editor", "viewer"];

export function normalizeProfileRole(
  role: string | null | undefined,
): ProfileRole {
  if (role && VALID_ROLES.includes(role as ProfileRole)) {
    return role as ProfileRole;
  }
  return "viewer";
}

export const ROLE_CONFIG: Record<
  ProfileRole,
  { label: string; gradient: string; bg: string; text: string }
> = {
  admin: {
    label: "Admin",
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    bg: "bg-brand-green/10",
    text: "text-brand-green",
  },
  editor: {
    label: "Editor",
    gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    bg: "bg-brand-blue/10",
    text: "text-brand-blue",
  },
  viewer: {
    label: "Viewer",
    gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    bg: "bg-brand-purple/10",
    text: "text-brand-purple",
  },
};

export function getRoleConfig(role: string | null | undefined) {
  return ROLE_CONFIG[normalizeProfileRole(role)];
}

/** CSS color pair for the profile hero strip (opacity applied in the component). */
export function heroStripGradientPair(role: string | null | undefined): string {
  const r = normalizeProfileRole(role);
  if (r === "admin") return "#10b981, #3b82f6";
  if (r === "editor") return "#3b82f6, #8b5cf6";
  return "#8b5cf6, #10b981";
}
