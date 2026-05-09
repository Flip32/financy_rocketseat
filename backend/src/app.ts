import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import express from 'express'

import { env } from './config/env.js'
import { makeUseCases } from './main/factories/make-use-cases.js'
import {
  type GraphQLContext,
  buildGraphQLContext
} from './presentation/graphql/context.js'
import { makeResolvers } from './presentation/graphql/resolvers.js'
import { typeDefs } from './presentation/graphql/type-defs.js'

const useCases = makeUseCases()
const resolvers = makeResolvers(useCases)

export async function buildApp() {
  const app = express()

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers
  })

  await apolloServer.start()

  app.use(
    '/graphql',
    cors({ origin: env.CORS_ORIGIN }),
    express.json(),
    expressMiddleware<GraphQLContext>(apolloServer, {
      context: async ({ req }) => {
        return buildGraphQLContext(
          req.headers.authorization,
          useCases.services.tokenService
        )
      }
    })
  )

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' })
  })

  return app
}
