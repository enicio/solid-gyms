import { Gym } from '@prisma/client'
import { GymsRepository } from '@/repository/gyms-repository'

interface GetNearByGymsUseCaseRequest {
  latitude: number
  longitude: number
}

interface GetNearByGymsUseCaseResponse {
  gyms: Gym[]
}

export class GetNearByGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    latitude,
    longitude,
  }: GetNearByGymsUseCaseRequest): Promise<GetNearByGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.getNearby({ latitude, longitude })

    return { gyms }
  }
}
