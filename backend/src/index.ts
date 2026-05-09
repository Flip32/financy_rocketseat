import { buildApp } from './app.js'
import { env } from './config/env.js'

async function main() {
  const app = await buildApp()

  app.listen(env.PORT, () => {
    console.log(`Backend on http://localhost:${env.PORT}`)
    console.log(`GraphQL on http://localhost:${env.PORT}/graphql`)
  })
}

main().catch(error => {
  console.error('Failed to start backend:', error)
  process.exit(1)
})
