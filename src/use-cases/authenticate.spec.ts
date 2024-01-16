import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repository/in-memory/in-memory-users-repository'
import { compare, hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate', () => {
  let authenticateUseCase: AuthenticateUseCase
  let inMemoryRepository: InMemoryUsersRepository
  beforeEach(() => {
    inMemoryRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(inMemoryRepository)
  })

  it('Should authenticate a user', async () => {
    const userToCreate = {
      id: '1',
      name: 'teste',
      email: 'test@test.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    inMemoryRepository.create(userToCreate)

    const { user } = await authenticateUseCase.execute({
      email: 'test@test.com',
      password: '123456',
    })

    const isPasswordHashCorrect = await compare('123456', user.password_hash)

    expect(isPasswordHashCorrect).toBe(true)
  })

  it('Should throw a error when the user do not exist', async () => {
    expect(async () => {
      await authenticateUseCase.execute({
        email: 'test@test.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)

    expect(async () => {
      await authenticateUseCase.execute({
        email: 'test@test.com',
        password: '123456',
      })
    }).rejects.toThrowError('User does not exist.')
  })

  it('Should throw a error when the password is wrong', async () => {
    const userToCreate = {
      id: '1',
      name: 'teste',
      email: 'test@test.com',
      password_hash: await hash('123456', 6),
      created_at: new Date(),
    }

    inMemoryRepository.create(userToCreate)

    expect(async () => {
      await authenticateUseCase.execute({
        email: 'test@test.com',
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
