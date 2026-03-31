import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { postService } from "@/services/post-service";
import type {
  CreatePostDto,
  PostListParams,
  UpdatePostDto,
} from "@/types/post.types";

export const POST_KEYS = {
  all: ["posts"] as const,
  lists: () => ["posts", "list"] as const,
  list: (p: PostListParams) => ["posts", "list", p] as const,
  stats: () => ["posts", "stats"] as const,
  detail: (id: string) => ["posts", "detail", id] as const,
};

export function usePosts(params: PostListParams = {}) {
  return useAuthQuery({
    queryKey: POST_KEYS.list(params),
    queryFn: () => postService.list(params),
  });
}

export function usePostStats() {
  return useAuthQuery({
    queryKey: POST_KEYS.stats(),
    queryFn: () => postService.stats(),
  });
}

export function usePost(id: string) {
  return useAuthQuery({
    queryKey: POST_KEYS.detail(id),
    queryFn: () => postService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePostDto) => postService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: POST_KEYS.all }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePostDto }) =>
      postService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: POST_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: POST_KEYS.lists() });
      qc.invalidateQueries({ queryKey: POST_KEYS.stats() });
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => postService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: POST_KEYS.all }),
  });
}
