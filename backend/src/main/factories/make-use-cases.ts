import { GetMeUseCase } from '../../application/use-cases/auth/get-me.use-case.js'
import { SignInUseCase } from '../../application/use-cases/auth/sign-in.use-case.js'
import { SignUpUseCase } from '../../application/use-cases/auth/sign-up.use-case.js'
import { UpdateMeUseCase } from '../../application/use-cases/auth/update-me.use-case.js'
import { CreateCategoryUseCase } from '../../application/use-cases/categories/create-category.use-case.js'
import { DeleteCategoryUseCase } from '../../application/use-cases/categories/delete-category.use-case.js'
import { ListCategoriesUseCase } from '../../application/use-cases/categories/list-categories.use-case.js'
import { UpdateCategoryUseCase } from '../../application/use-cases/categories/update-category.use-case.js'
import { CreateTransactionUseCase } from '../../application/use-cases/transactions/create-transaction.use-case.js'
import { DeleteTransactionUseCase } from '../../application/use-cases/transactions/delete-transaction.use-case.js'
import { ListTransactionsUseCase } from '../../application/use-cases/transactions/list-transactions.use-case.js'
import { UpdateTransactionUseCase } from '../../application/use-cases/transactions/update-transaction.use-case.js'
import { PrismaCategoryRepository } from '../../infrastructure/repositories/prisma/prisma-category-repository.js'
import { PrismaTransactionRepository } from '../../infrastructure/repositories/prisma/prisma-transaction-repository.js'
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma/prisma-user-repository.js'
import { BcryptHashService } from '../../infrastructure/services/bcrypt-hash-service.js'
import { JwtTokenService } from '../../infrastructure/services/jwt-token-service.js'

export function makeUseCases() {
  const userRepository = new PrismaUserRepository()
  const categoryRepository = new PrismaCategoryRepository()
  const transactionRepository = new PrismaTransactionRepository()

  const hashService = new BcryptHashService()
  const tokenService = new JwtTokenService()

  return {
    auth: {
      signUp: new SignUpUseCase(userRepository, hashService, tokenService),
      signIn: new SignInUseCase(userRepository, hashService, tokenService),
      getMe: new GetMeUseCase(userRepository),
      updateMe: new UpdateMeUseCase(userRepository)
    },
    categories: {
      list: new ListCategoriesUseCase(categoryRepository),
      create: new CreateCategoryUseCase(categoryRepository),
      update: new UpdateCategoryUseCase(categoryRepository),
      delete: new DeleteCategoryUseCase(categoryRepository)
    },
    transactions: {
      list: new ListTransactionsUseCase(transactionRepository),
      create: new CreateTransactionUseCase(
        transactionRepository,
        categoryRepository
      ),
      update: new UpdateTransactionUseCase(
        transactionRepository,
        categoryRepository
      ),
      delete: new DeleteTransactionUseCase(transactionRepository)
    },
    services: {
      tokenService
    }
  }
}
