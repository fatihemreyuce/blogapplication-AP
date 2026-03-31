import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { categoryService } from "@/services/category-service";
import type {
  CategoryListParams,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/types/category.types";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => ["categories", "list"] as const,
  list: (p: CategoryListParams) => ["categories", "list", p] as const,
  stats: () => ["categories", "stats"] as const,
  detail: (id: string) => ["categories", "detail", id] as const,
};

export function useCategories(params: CategoryListParams = {}) {
  return useAuthQuery({
    queryKey: CATEGORY_KEYS.list(params),
    queryFn: () => categoryService.list(params),
  });
}

export function useCategoryStats() {
  return useAuthQuery({
    queryKey: CATEGORY_KEYS.stats(),
    queryFn: () => categoryService.stats(),
  });
}

export function useCategory(id: string) {
  return useAuthQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => categoryService.getById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryDto) => categoryService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCategoryDto }) =>
      categoryService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.lists() });
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.stats() });
    },
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => categoryService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}
