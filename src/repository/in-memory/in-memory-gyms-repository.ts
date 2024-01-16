import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, getNearbyRequest } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coodinates'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async findById(id: string) {
    const gym = this.items.find((item: Gym) => item.id === id)

    if (!gym) return null
    return gym || null
  }

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id || randomUUID(),
      title: data.title,
      phone: data.phone || null,
      description: data.description || null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async getNearby(params: getNearbyRequest) {
    const gyms = this.items.filter((item: Gym) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        },
      )
      return distance <= 10
    })
    return gyms
  }

  async searchMany(query: string, page: number) {
    const gyms = this.items
      .filter((item: Gym) => item.title.includes(query))
      .slice((page - 1) * 20, page * 20)
    return gyms
  }
}
