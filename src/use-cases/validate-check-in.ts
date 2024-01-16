import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repository/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

interface ValidateCheckInUseCaseRsponse {
  validatedCheckIn: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkinRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseRsponse> {
    const checkIn = await this.checkinRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const checkIn_in_milliseconds = Date.parse(checkIn.createdAt.toString())
    const hour_to_validate_milliseconds = Date.now()
    const timeExpend = hour_to_validate_milliseconds - checkIn_in_milliseconds
    const timeExpend_in_minutes = timeExpend / 60000
    if (timeExpend_in_minutes > 20) {
      throw new ResourceNotFoundError()
    }

    const validatedCheckIn = await this.checkinRepository.save({
      ...checkIn,
      validated_at: new Date(),
    })

    return {
      validatedCheckIn,
    }
  }
}
