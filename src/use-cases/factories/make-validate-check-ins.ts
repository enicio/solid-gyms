import { PrismaCheckInsRepository } from '@/repository/prisma/prisma-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'

export function makeValidateCheckIns() {
  const checkinRepository = new PrismaCheckInsRepository()
  const validateCheckin = new ValidateCheckInUseCase(checkinRepository)

  return validateCheckin
}
