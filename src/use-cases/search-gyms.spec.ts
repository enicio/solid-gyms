import { describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'
import { SearchGymsUseCase } from './search-gyms'

describe('Search Gym', () => {
  it('Should get the list of gyms', async () => {
    const inMemoryRepository = new InMemoryGymsRepository()
    const createGymUseCase = new CreateGymUseCase(inMemoryRepository)

    await createGymUseCase.execute({
      id: '123',
      title: 'Academia-1',
      description: 'Academia de musculação 1',
      phone: '123456789',
      latitude: 1,
      longitude: 1,
    })

    await createGymUseCase.execute({
      id: '456',
      title: 'Academia-2',
      description: 'Academia de musculação 2',
      phone: '1011121314',
      latitude: 2,
      longitude: 2,
    })
    const searchGymsUseCase = new SearchGymsUseCase(inMemoryRepository)
    const { gyms } = await searchGymsUseCase.execute({
      query: 'Academia-1',
      page: 1,
    })

    expect(gyms.length).toEqual(1)
    expect(gyms[0].title).toEqual('Academia-1')
  })

  it('Should get the only gyms of page 2', async () => {
    const inMemoryRepository = new InMemoryGymsRepository()
    const createGymUseCase = new CreateGymUseCase(inMemoryRepository)

    for (let i = 1; i <= 22; i++) {
      await createGymUseCase.execute({
        id: i.toString(),
        title: `Academia-${i}`,
        description: `Academia de musculação ${i}`,
        phone: '123456789',
        latitude: i,
        longitude: i,
      })
    }

    const searchGymsUseCase = new SearchGymsUseCase(inMemoryRepository)
    const { gyms } = await searchGymsUseCase.execute({
      query: 'Academia',
      page: 2,
    })

    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Academia-21' }),
      expect.objectContaining({ title: 'Academia-22' }),
    ])
  })
})
