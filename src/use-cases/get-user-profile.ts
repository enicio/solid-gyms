import { UserRepository } from '@/repository/users-repository'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseRsponse {
  user: User
}

export class UserProfileUseCase {
  constructor(private UserRepository: UserRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseRsponse> {
    const user = await this.UserRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
