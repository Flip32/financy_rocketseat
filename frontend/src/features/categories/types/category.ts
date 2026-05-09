export type CategoryIconProps = {
  name: string
  color: string
}

export type Category = {
  id: string
  name: string
  iconProps: CategoryIconProps
  createdAt: string
  updatedAt: string
}
