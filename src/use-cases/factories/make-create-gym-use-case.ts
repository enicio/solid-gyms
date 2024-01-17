import { PrismaGymsRepository } from '@/repository/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const createGym = new CreateGymUseCase(gymsRepository)

  return createGym
}
