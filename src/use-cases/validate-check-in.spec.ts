import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import InMemoryCheckInsRepository from '@/repository/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repository/in-memory/in-memory-gyms-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found'

let inMemoryRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validade checkin', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(inMemoryRepository, gymsRepository)
    validateCheckInUseCase = new ValidateCheckInUseCase(inMemoryRepository)
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
  it('Should create a checkin and validate', async () => {
    const date_create_checkin = new Date(2000, 1, 1, 14, 0)
    vi.setSystemTime(date_create_checkin)

    await checkInUseCase.execute({
      id: '1',
      gymId: '1',
      userId: '2',
      userLatitude: 1,
      userLongitude: 1,
    })

    const date_validate_checkin = new Date(2000, 1, 1, 14, 10)
    vi.setSystemTime(date_validate_checkin)

    const { validatedCheckIn } = await validateCheckInUseCase.execute({
      checkInId: '1',
    })

    expect(validatedCheckIn.validated_at).toEqual(date_validate_checkin)
  })

  it('Should not validate a checkin that not exist.', async () => {
    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'invalid-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('Should not be able validate checkin after 20 minutes', async () => {
    const date_create_checkin = new Date(2000, 1, 1, 14, 0)
    vi.setSystemTime(date_create_checkin)

    await checkInUseCase.execute({
      id: '1',
      gymId: '1',
      userId: '2',
      userLatitude: 1,
      userLongitude: 1,
    })

    const date_validate_checkin = new Date(2000, 1, 1, 14, 21)
    vi.setSystemTime(date_validate_checkin)

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: '1',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
