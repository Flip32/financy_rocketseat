export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR')
}

export function formatMonth(value: string) {
  const [year, month] = value.split('-').map(Number)

  if (!year || !month) {
    return ''
  }

  const date = new Date(year, month - 1, 1)
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long'
  }).format(date)
  const capitalizedMonth = `${monthLabel.charAt(0).toUpperCase()}${monthLabel.slice(1)}`

  return `${capitalizedMonth} / ${year}`
}
