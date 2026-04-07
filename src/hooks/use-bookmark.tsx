import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { bookmarkService } from "@/services/bookmark-service";
import type {
  BookmarkListParams,
  CreateBookmarkDto,
  UpdateBookmarkDto,
} from "@/types/bookmark.types";

export const BOOKMARK_KEYS = {
  all: ["bookmarks"] as const,
  lists: () => ["bookmarks", "list"] as const,
  list: (p: BookmarkListParams) => ["bookmarks", "list", p] as const,
  stats: () => ["bookmarks", "stats"] as const,
  detail: (id: string) => ["bookmarks", "detail", id] as const,
};

export function useBookmarks(params: BookmarkListParams = {}) {
  return useAuthQuery({
    queryKey: BOOKMARK_KEYS.list(params),
    queryFn: () => bookmarkService.list(params),
  });
}

export function useBookmarkStats() {
  return useAuthQuery({
    queryKey: BOOKMARK_KEYS.stats(),
    queryFn: () => bookmarkService.stats(),
  });
}

export function useBookmark(id: string) {
  return useAuthQuery({
    queryKey: BOOKMARK_KEYS.detail(id),
    queryFn: () => bookmarkService.getById(id),
    enabled: !!id,
  });
}

export function useCreateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBookmarkDto) => bookmarkService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKMARK_KEYS.all }),
  });
}

export function useUpdateBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBookmarkDto }) =>
      bookmarkService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: BOOKMARK_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: BOOKMARK_KEYS.lists() });
      qc.invalidateQueries({ queryKey: BOOKMARK_KEYS.stats() });
    },
  });
}

export function useDeleteBookmark() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookmarkService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: BOOKMARK_KEYS.all }),
  });
}
