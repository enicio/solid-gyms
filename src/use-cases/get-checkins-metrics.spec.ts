import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import InMemoryCheckInsRepository from '@/repository/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { CheckInMetricsUseCase } from './get-checkins-metrics'

let inMemoryRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase
let checkInMetricsUseCase: CheckInMetricsUseCase

describe('Checkin Metrics', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(inMemoryRepository, gymsRepository)
    checkInMetricsUseCase = new CheckInMetricsUseCase(inMemoryRepository)
    // praça cardeal arco verde -19.949354, -43.990419
    gymsRepository.create({
      id: '1',
      title: 'Academia',
      description: 'Academia de musculação',
      phone: '123456789',
      latitude: 1,
      longitude: 1,
    })
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  it('Should get the number of checkins', async () => {
    for (let i = 0; i < 10; i++) {
      const date = new Date(2000, 1, i + 1, 13)
      vi.setSystemTime(date)

      await checkInUseCase.execute({
        gymId: '1',
        userId: '2',
        userLatitude: 1,
        userLongitude: 1,
      })
    }

    const { checkInsMetrics } = await checkInMetricsUseCase.execute({
      userId: '2',
    })
    expect(checkInsMetrics).toEqual(10)
  })
})
