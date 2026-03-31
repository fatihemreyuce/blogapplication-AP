import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { tagsService } from "@/services/tags-service";
import type {
  TagListParams,
  CreateTagDto,
  UpdateTagDto,
} from "@/types/tags.types";

export const TAG_KEYS = {
  all: ["tags"] as const,
  lists: () => ["tags", "list"] as const,
  list: (p: TagListParams) => ["tags", "list", p] as const,
  stats: () => ["tags", "stats"] as const,
  detail: (id: string) => ["tags", "detail", id] as const,
};

export function useTags(params: TagListParams = {}) {
  return useAuthQuery({
    queryKey: TAG_KEYS.list(params),
    queryFn: () => tagsService.list(params),
  });
}

export function useTagStats() {
  return useAuthQuery({
    queryKey: TAG_KEYS.stats(),
    queryFn: () => tagsService.stats(),
  });
}

export function useTag(id: string) {
  return useAuthQuery({
    queryKey: TAG_KEYS.detail(id),
    queryFn: () => tagsService.getById(id),
    enabled: !!id,
  });
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTagDto) => tagsService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: TAG_KEYS.all }),
  });
}

export function useUpdateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTagDto }) =>
      tagsService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: TAG_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: TAG_KEYS.lists() });
      qc.invalidateQueries({ queryKey: TAG_KEYS.stats() });
    },
  });
}

export function useDeleteTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tagsService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: TAG_KEYS.all }),
  });
}
