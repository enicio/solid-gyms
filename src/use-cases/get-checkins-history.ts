import { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repository/check-ins-repository'

interface CheckInUseHistoryUseCaseRequest {
  userId: string
  page?: number
}

interface CheckInUseHistoryUseCaseRsponse {
  checkIns: CheckIn[]
}

export class CheckInUseHistoryUseCase {
  constructor(private checkinRepository: CheckInsRepository) {}

  async execute({
    userId,
    page = 1, // Provide a default value for the page parameter
  }: CheckInUseHistoryUseCaseRequest): Promise<CheckInUseHistoryUseCaseRsponse> {
    const checkIns = await this.checkinRepository.findManyByUserId(userId, page)
    return {
      checkIns,
    }
  }
}
