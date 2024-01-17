import { PrismaGymsRepository } from '@/repository/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGyms = new CreateGymUseCase(gymsRepository)

  return searchGyms
}
