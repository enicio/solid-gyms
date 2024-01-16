import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { GetNearByGymsUseCase } from './get-near-by-gyms'

let gymsRepository: InMemoryGymsRepository

describe.only('Checkin', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('Should create a checkin in a distant gym', async () => {
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    // praça Itueta -19.955198, -43.997469

    gymsRepository.create({
      id: '1',
      title: 'Academia Near',
      description: 'Academia de musculação',
      phone: '123456789',
      latitude: -19.955198,
      longitude: -43.997469,
    })
    // Aeroporto da Pampulha -19.849800, -43.949589
    gymsRepository.create({
      id: '2',
      title: 'Academia Far',
      description: 'Academia de musculação',
      phone: '123456789',
      // eslint-disable-next-line prettier/prettier
      latitude: -19.849800,
      longitude: -43.949589,
    })

    const getNearByGymsUseCase = new GetNearByGymsUseCase(gymsRepository)

    const { gyms } = await getNearByGymsUseCase.execute({
      latitude: -19.949354,
      longitude: -43.990419,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Academia Near' })])
  })
})
