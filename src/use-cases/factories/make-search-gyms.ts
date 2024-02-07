import { PrismaGymsRepository } from '@/repository/prisma/prisma-gyms-repository'
import { SearchGymsUseCase } from '../search-gyms'

export function makeSearchGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const searchGyms = new SearchGymsUseCase(gymsRepository)

  return searchGyms
}
