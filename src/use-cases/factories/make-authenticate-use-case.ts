import { PrismaUserRepository } from '@/repository/prisma/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const UserRepository = new PrismaUserRepository()
  const authenticateUseCase = new AuthenticateUseCase(UserRepository)

  return authenticateUseCase
}
