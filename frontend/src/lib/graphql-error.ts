export function getGraphQLErrorMessage(error: unknown) {
  if (!error) {
    return 'Algo deu errado. Tente novamente.'
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = (error as { message?: unknown }).message

    if (typeof message === 'string') {
      return message
    }
  }

  return 'Algo deu errado. Tente novamente.'
}
