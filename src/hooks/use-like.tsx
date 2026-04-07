import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { likeService } from "@/services/like-service";
import type { CreateLikeDto, LikeListParams, UpdateLikeDto } from "@/types/like.types";

export const LIKE_KEYS = {
  all: ["likes"] as const,
  lists: () => ["likes", "list"] as const,
  list: (p: LikeListParams) => ["likes", "list", p] as const,
  stats: () => ["likes", "stats"] as const,
  detail: (id: string) => ["likes", "detail", id] as const,
};

export function useLikes(params: LikeListParams = {}) {
  return useAuthQuery({
    queryKey: LIKE_KEYS.list(params),
    queryFn: () => likeService.list(params),
  });
}

export function useLikeStats() {
  return useAuthQuery({
    queryKey: LIKE_KEYS.stats(),
    queryFn: () => likeService.stats(),
  });
}

export function useLike(id: string) {
  return useAuthQuery({
    queryKey: LIKE_KEYS.detail(id),
    queryFn: () => likeService.getById(id),
    enabled: !!id,
  });
}

export function useCreateLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLikeDto) => likeService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: LIKE_KEYS.all }),
  });
}

export function useUpdateLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLikeDto }) =>
      likeService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: LIKE_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: LIKE_KEYS.lists() });
      qc.invalidateQueries({ queryKey: LIKE_KEYS.stats() });
    },
  });
}

export function useDeleteLike() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => likeService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: LIKE_KEYS.all }),
  });
}
