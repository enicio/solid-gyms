import { PrismaUserRepository } from '@/repository/prisma/prisma-users-repository'
import { UserProfileUseCase } from '../get-user-profile'

export function makeGetUserProfileUseCase() {
  const UserRepository = new PrismaUserRepository()
  const getUserProfileUseCase = new UserProfileUseCase(UserRepository)

  return getUserProfileUseCase
}
