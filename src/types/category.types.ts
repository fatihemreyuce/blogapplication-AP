export interface Category {
    id: string
    name: string
    slug: string
    description: string | null
    cover_image: string | null
    created_at: string
  }
  
  export type CreateCategoryDto = Omit<Category, 'id' | 'created_at'>
  export type UpdateCategoryDto = Partial<CreateCategoryDto>