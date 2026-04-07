export interface NewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateNewsletterSubscriberDto {
  email: string;
  is_active?: boolean;
}

export type UpdateNewsletterSubscriberDto = Partial<CreateNewsletterSubscriberDto>;

export interface NewsletterSubscriberListParams {
  search?: string;
  active?: "all" | "active" | "inactive";
  sort?: "newest" | "oldest" | "email_asc" | "email_desc";
  page?: number;
  pageSize?: number;
}

export interface NewsletterSubscriberListResult {
  data: NewsletterSubscriber[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NewsletterSubscriberStats {
  total: number;
  active: number;
}
