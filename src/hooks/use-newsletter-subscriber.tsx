import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { newsletterSubscriberService } from "@/services/newsletter-subscriber-service";
import type {
  CreateNewsletterSubscriberDto,
  NewsletterSubscriberListParams,
  UpdateNewsletterSubscriberDto,
} from "@/types/newsletter-subscriber.types";

export const NEWSLETTER_SUBSCRIBER_KEYS = {
  all: ["newsletter_subscribers"] as const,
  lists: () => ["newsletter_subscribers", "list"] as const,
  list: (p: NewsletterSubscriberListParams) =>
    ["newsletter_subscribers", "list", p] as const,
  stats: () => ["newsletter_subscribers", "stats"] as const,
  detail: (id: string) => ["newsletter_subscribers", "detail", id] as const,
};

export function useNewsletterSubscribers(params: NewsletterSubscriberListParams = {}) {
  return useAuthQuery({
    queryKey: NEWSLETTER_SUBSCRIBER_KEYS.list(params),
    queryFn: () => newsletterSubscriberService.list(params),
  });
}

export function useNewsletterSubscriberStats() {
  return useAuthQuery({
    queryKey: NEWSLETTER_SUBSCRIBER_KEYS.stats(),
    queryFn: () => newsletterSubscriberService.stats(),
  });
}

export function useNewsletterSubscriber(id: string) {
  return useAuthQuery({
    queryKey: NEWSLETTER_SUBSCRIBER_KEYS.detail(id),
    queryFn: () => newsletterSubscriberService.getById(id),
    enabled: !!id,
  });
}

export function useCreateNewsletterSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsletterSubscriberDto) =>
      newsletterSubscriberService.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: NEWSLETTER_SUBSCRIBER_KEYS.all }),
  });
}

export function useUpdateNewsletterSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsletterSubscriberDto }) =>
      newsletterSubscriberService.update(id, data),
    onSuccess: (_result, { id }) => {
      qc.invalidateQueries({ queryKey: NEWSLETTER_SUBSCRIBER_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: NEWSLETTER_SUBSCRIBER_KEYS.lists() });
      qc.invalidateQueries({ queryKey: NEWSLETTER_SUBSCRIBER_KEYS.stats() });
    },
  });
}

export function useDeleteNewsletterSubscriber() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => newsletterSubscriberService.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: NEWSLETTER_SUBSCRIBER_KEYS.all }),
  });
}
