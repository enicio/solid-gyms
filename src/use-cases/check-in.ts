import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repository/check-ins-repository'
import { GymsRepository } from '@/repository/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coodinates'
import { MaxDistanceError } from './errors/max-distance-erro'
import { MaxNumberOfCheckInsError } from './errors/max-numbers-of-checkins'

interface CheckInUseCaseRequest {
  id?: string
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseRsponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkinRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  async execute({
    id,
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseRsponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_IN_KM = 0.1
    if (distance > MAX_DISTANCE_IN_KM) {
      throw new MaxDistanceError()
    }

    const userAlreadyCheckinToday =
      await this.checkinRepository.findByUserIdOnDate(userId, new Date())

    if (userAlreadyCheckinToday) {
      throw new MaxNumberOfCheckInsError()
    }
    const checkIn = await this.checkinRepository.create({
      id,
      gym_id: gymId,
      user_id: userId,
    })
    return {
      checkIn,
    }
  }
}
