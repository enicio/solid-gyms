import { PrismaGymsRepository } from '@/repository/prisma/prisma-gyms-repository'
import { GetNearByGymsUseCase } from '../get-near-by-gyms'

export function makeNearByGymsUseCase() {
  const gymsRepository = new PrismaGymsRepository()
  const nearByGyms = new GetNearByGymsUseCase(gymsRepository)

  return nearByGyms
}
