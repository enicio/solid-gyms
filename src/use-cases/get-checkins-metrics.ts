import { CheckInsRepository } from '@/repository/check-ins-repository'

interface CheckInMetricsUseCaseRequest {
  userId: string
}

interface CheckInMetricsUseCaseRsponse {
  checkInsMetrics: number
}

export class CheckInMetricsUseCase {
  constructor(private checkinRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: CheckInMetricsUseCaseRequest): Promise<CheckInMetricsUseCaseRsponse> {
    const checkInsMetrics =
      await this.checkinRepository.getCheckInsCount(userId)
    return {
      checkInsMetrics,
    }
  }
}
