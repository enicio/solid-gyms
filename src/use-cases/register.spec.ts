import { describe, expect, it } from 'vitest'
import { RegisterUseCase } from './register'
import { InMemoryUsersRepository } from '@/repository/in-memory/in-memory-users-repository'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists'

describe('register', () => {
  it('Should hash user after register', async () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'jonh@test.com',
      password: '12345678',
    })

    const isPasswordHashCorrect = await compare('12345678', user.password_hash)

    expect(isPasswordHashCorrect).toBe(true)
  })

  it('Should not be able register the same email twice', async () => {
    const inMemoryRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(inMemoryRepository)

    await registerUseCase.execute({
      name: 'John Doe',
      email: 'jonh@test.com',
      password: '12345678',
    })

    expect(async () => {
      await registerUseCase.execute({
        name: 'John Doe',
        email: 'jonh@test.com',
        password: '12345678',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
