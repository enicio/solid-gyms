import { PrismaUserRepository } from '@/repository/prisma/prisma-users-repository'
import { RegisterUseCase } from '../register'

export function makeRegisterUseCase() {
  const UserRepository = new PrismaUserRepository()
  const registerUseCase = new RegisterUseCase(UserRepository)

  return registerUseCase
}
