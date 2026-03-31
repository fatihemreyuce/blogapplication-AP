import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { profileService } from "@/services/profile-service";
import type {
  ProfileInsert,
  ProfileListParams,
  ProfileUpdate,
} from "@/types/profile.types";

/* ── Query keys ───────────────────────────────────────── */
export const PROFILE_KEYS = {
  all:    ["profiles"] as const,
  lists:  () => ["profiles", "list"] as const,
  list:   (p: ProfileListParams) => ["profiles", "list", p] as const,
  stats:  () => ["profiles", "stats"] as const,
  detail: (id: string) => ["profiles", "detail", id] as const,
};

/* ── Read hooks ───────────────────────────────────────── */
export function useProfiles(params: ProfileListParams = {}) {
  return useAuthQuery({
    queryKey: PROFILE_KEYS.list(params),
    queryFn: () => profileService.list(params),
  });
}

export function useProfileStats() {
  return useAuthQuery({
    queryKey: PROFILE_KEYS.stats(),
    queryFn: () => profileService.stats(),
  });
}

export function useProfile(id: string) {
  return useAuthQuery({
    queryKey: PROFILE_KEYS.detail(id),
    queryFn: () => profileService.getById(id),
    enabled: !!id,
  });
}

/* ── Mutation hooks ───────────────────────────────────── */
export function useCreateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProfileInsert) => profileService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ProfileUpdate }) =>
      profileService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: PROFILE_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: PROFILE_KEYS.lists() });
      qc.invalidateQueries({ queryKey: PROFILE_KEYS.stats() });
    },
  });
}

export function useDeleteProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => profileService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PROFILE_KEYS.all });
    },
  });
}
