import type { Category } from '../../entities.js'

type CategoryUpsertData = {
  name: string
  iconName: string
  iconColor: string
}

export interface CategoryRepository {
  listByUserId(userId: string): Promise<Category[]>
  findByIdAndUserId(id: string, userId: string): Promise<Category | null>
  create(userId: string, data: CategoryUpsertData): Promise<Category>
  update(
    id: string,
    userId: string,
    data: CategoryUpsertData
  ): Promise<Category | null>
  delete(id: string, userId: string): Promise<boolean>
}
