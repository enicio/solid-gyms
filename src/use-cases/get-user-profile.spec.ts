import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repository/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { UserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found'

describe('Get user profile', () => {
  let userProfileUseCase: UserProfileUseCase
  let inMemoryRepository: InMemoryUsersRepository
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository()
    userProfileUseCase = new UserProfileUseCase(inMemoryRepository)
  })

  it('Should get user profile', async () => {
    const userToCreate = {
      id: '123456',
      name: 'teste',
      email: 'test@test.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    inMemoryRepository.create(userToCreate)

    const { user } = await userProfileUseCase.execute({ userId: '123456' })

    expect(user.id).toBe('123456')
  })

  it('Should throw a error if resource does not exist', async () => {
    expect(async () => {
      await userProfileUseCase.execute({ userId: 'non-existing-id' })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
