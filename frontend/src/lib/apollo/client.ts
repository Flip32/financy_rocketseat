import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { useAuthStore } from '../../stores/auth-store'

const graphqlUrl = String(
  import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333/graphql'
)

const httpLink = new HttpLink({
  uri: graphqlUrl
})

const authLink = setContext((_, { headers }) => {
  const token = useAuthStore.getState().token

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})
