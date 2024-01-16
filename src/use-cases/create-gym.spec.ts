import { describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

describe('Create Gym', () => {
  it('Should create a gym', async () => {
    const inMemoryRepository = new InMemoryGymsRepository()
    const createGymUseCase = new CreateGymUseCase(inMemoryRepository)

    await createGymUseCase.execute({
      id: '123',
      title: 'Academia',
      description: 'Academia de musculação',
      phone: '123456789',
      latitude: 1,
      longitude: 1,
    })
    const gymCreated = await inMemoryRepository.findById('123')
    expect(gymCreated?.title).toEqual('Academia')
  })
})
