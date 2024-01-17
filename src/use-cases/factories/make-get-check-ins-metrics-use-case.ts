import { PrismaCheckInsRepository } from '@/repository/prisma/prisma-check-ins-repository'
import { CheckInMetricsUseCase } from '@/use-cases/get-checkins-metrics'

export function makeGetCheckInsMetricsCase() {
  const checkinRepository = new PrismaCheckInsRepository()
  const checkinsMetrics = new CheckInMetricsUseCase(checkinRepository)

  return checkinsMetrics
}
