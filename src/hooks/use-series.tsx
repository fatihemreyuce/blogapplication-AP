import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { seriesService } from "@/services/series-service";
import type {
  CreateSeriesDto,
  SeriesListParams,
  UpdateSeriesDto,
} from "@/types/series.types";

export const SERIES_KEYS = {
  all: ["series"] as const,
  lists: () => ["series", "list"] as const,
  list: (p: SeriesListParams) => ["series", "list", p] as const,
  stats: () => ["series", "stats"] as const,
  detail: (id: string) => ["series", "detail", id] as const,
};

export function useSeries(params: SeriesListParams = {}) {
  return useAuthQuery({
    queryKey: SERIES_KEYS.list(params),
    queryFn: () => seriesService.list(params),
  });
}

export function useSeriesStats() {
  return useAuthQuery({
    queryKey: SERIES_KEYS.stats(),
    queryFn: () => seriesService.stats(),
  });
}

export function useSeriesDetail(id: string) {
  return useAuthQuery({
    queryKey: SERIES_KEYS.detail(id),
    queryFn: () => seriesService.getById(id),
    enabled: !!id,
  });
}

export function useCreateSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSeriesDto) => seriesService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERIES_KEYS.all }),
  });
}

export function useUpdateSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSeriesDto }) =>
      seriesService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: SERIES_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: SERIES_KEYS.lists() });
      qc.invalidateQueries({ queryKey: SERIES_KEYS.stats() });
    },
  });
}

export function useDeleteSeries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => seriesService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: SERIES_KEYS.all }),
  });
}
