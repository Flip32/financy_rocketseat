import {z} from 'zod'

export const categoryIconNames = [
  'briefcase-business',
  'car-front',
  'heart-pulse',
  'piggy-bank',
  'shopping-cart',
  'ticket',
  'tool-case',
  'gift',
  'utensils',
  'paw-print',
  'house',
  'dumbbell',
  'book-open',
  'baggage-claim',
  'mailbox',
  'receipt-text'
] as const

export const categoryIconColors = [
  'blue',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'gray'
] as const

export const categoryIconPropsSchema = z.object({
  name: z.enum(categoryIconNames),
  color: z.enum(categoryIconColors)
})
