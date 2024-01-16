import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import InMemoryCheckInsRepository from '@/repository/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { CheckInUseHistoryUseCase } from './get-checkins-history'

let inMemoryRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase
let checkInUseHistoryUseCase: CheckInUseHistoryUseCase

describe('Checkin', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(inMemoryRepository, gymsRepository)
    checkInUseHistoryUseCase = new CheckInUseHistoryUseCase(inMemoryRepository)
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

  it("Should get the history of the user's checkins", async () => {
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

    const { checkIns } = await checkInUseHistoryUseCase.execute({ userId: '2' })
    expect(checkIns.length).toEqual(10)
    expect(checkIns[0].gym_id).toEqual('1')
    expect(checkIns[0].user_id).toEqual('2')
  })

  it('Should get only the second page of the user checkins', async () => {
    for (let i = 0; i < 22; i++) {
      const date = new Date(2000, 1, i + 1, 13)
      vi.setSystemTime(date)

      await checkInUseCase.execute({
        gymId: '1',
        userId: '2',
        userLatitude: 1,
        userLongitude: 1,
      })
    }

    const { checkIns } = await checkInUseHistoryUseCase.execute({
      userId: '2',
      page: 2,
    })
    expect(checkIns.length).toEqual(2)
  })
})
