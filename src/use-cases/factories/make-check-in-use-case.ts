import { PrismaCheckInsRepository } from '@/repository/prisma/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repository/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const checkinRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkin = new CheckInUseCase(checkinRepository, gymsRepository)

  return checkin
}
