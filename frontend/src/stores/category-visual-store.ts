import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

const categoryVisualStorage = createJSONStorage(() => localStorage)

type CategoryDescriptionState = {
  descriptions: Record<string, string>
  setCategoryDescription: (categoryId: string, description: string) => void
  removeCategoryDescription: (categoryId: string) => void
  clear: () => void
}

export const useCategoryVisualStore = create<CategoryDescriptionState>()(
  persist(
    set => ({
      descriptions: {},
      setCategoryDescription: (categoryId, description) => {
        set(state => ({
          descriptions: {
            ...state.descriptions,
            [categoryId]: description
          }
        }))
      },
      removeCategoryDescription: categoryId => {
        set(state => {
          const nextDescriptions = { ...state.descriptions }
          delete nextDescriptions[categoryId]

          return {
            descriptions: nextDescriptions
          }
        })
      },
      clear: () => {
        set({ descriptions: {} })
        categoryVisualStorage?.removeItem('financy-category-descriptions')
      }
    }),
    {
      name: 'financy-category-descriptions',
      storage: categoryVisualStorage
    }
  )
)
