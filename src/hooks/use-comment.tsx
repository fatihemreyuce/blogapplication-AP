import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { commentService } from "@/services/comment-service";
import type {
  CommentListParams,
  CreateCommentDto,
  UpdateCommentDto,
} from "@/types/comment.types";

export const COMMENT_KEYS = {
  all: ["comments"] as const,
  lists: () => ["comments", "list"] as const,
  list: (p: CommentListParams) => ["comments", "list", p] as const,
  stats: () => ["comments", "stats"] as const,
  detail: (id: string) => ["comments", "detail", id] as const,
};

export function useComments(params: CommentListParams = {}) {
  return useAuthQuery({
    queryKey: COMMENT_KEYS.list(params),
    queryFn: () => commentService.list(params),
  });
}

export function useCommentStats() {
  return useAuthQuery({
    queryKey: COMMENT_KEYS.stats(),
    queryFn: () => commentService.stats(),
  });
}

export function useComment(id: string) {
  return useAuthQuery({
    queryKey: COMMENT_KEYS.detail(id),
    queryFn: () => commentService.getById(id),
    enabled: !!id,
  });
}

export function useCreateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCommentDto) => commentService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: COMMENT_KEYS.all }),
  });
}

export function useUpdateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommentDto }) =>
      commentService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: COMMENT_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: COMMENT_KEYS.lists() });
      qc.invalidateQueries({ queryKey: COMMENT_KEYS.stats() });
    },
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => commentService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: COMMENT_KEYS.all }),
  });
}
