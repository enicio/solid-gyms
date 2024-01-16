import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import InMemoryCheckInsRepository from '@/repository/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-numbers-of-checkins'
import { MaxDistanceError } from './errors/max-distance-erro'

let inMemoryRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Checkin', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(inMemoryRepository, gymsRepository)
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
  it('Should create a checkin', async () => {
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    const { checkIn } = await checkInUseCase.execute({
      gymId: '1',
      userId: '2',
      userLatitude: 1,
      userLongitude: 1,
    })

    expect(checkIn.gym_id).toEqual('1')
    expect(checkIn.user_id).toEqual('2')
  })

  it('Should not be able to check in twice in the same day', async () => {
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    await checkInUseCase.execute({
      gymId: '1',
      userId: '2',
      userLatitude: 1,
      userLongitude: 1,
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: '1',
        userId: '2',
        userLatitude: 1,
        userLongitude: 1,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('Should be able to check in twice in the different day', async () => {
    vi.setSystemTime(new Date(2000, 1, 1, 13))

    await checkInUseCase.execute({
      gymId: '1',
      userId: '2',
      userLatitude: 1,
      userLongitude: 1,
    })

    vi.setSystemTime(new Date(2000, 1, 2, 13))

    const { checkIn } = await checkInUseCase.execute({
      gymId: '1',
      userId: '2',
      userLatitude: 1,
      userLongitude: 1,
    })

    expect(checkIn.gym_id).toEqual('1')
    expect(checkIn.user_id).toEqual('2')
  })

  it('Should create a checkin in a distant gym', async () => {
    const date = new Date(2000, 1, 1, 13)
    vi.setSystemTime(date)

    // praça Itueta -19.955198, -43.997469
    gymsRepository.items.push({
      id: '2',
      title: 'Academia 2',
      description: 'Academia de musculação',
      phone: '123456789',
      latitude: new Decimal(-19.955198),
      longitude: new Decimal(-43.997469),
    })

    await expect(() =>
      checkInUseCase.execute({
        gymId: '2',
        userId: '2',
        userLatitude: -19.949354,
        userLongitude: -43.990419,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
