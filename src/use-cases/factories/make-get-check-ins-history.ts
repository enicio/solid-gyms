import { PrismaCheckInsRepository } from '@/repository/prisma/prisma-check-ins-repository'
import { CheckInUseHistoryUseCase } from '../get-checkins-history'

export function makeMakeGetCheckInsHistoryUseCase() {
  const checkinRepository = new PrismaCheckInsRepository()
  const checkinsHistory = new CheckInUseHistoryUseCase(checkinRepository)

  return checkinsHistory
}
