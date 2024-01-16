import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { randomUUID } from 'node:crypto'

export default class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const userAlreadyCheckinToday = this.items.find(
      (item) => item.user_id === userId,
    )

    if (!userAlreadyCheckinToday) {
      return null
    }

    // Assuming the date property is named 'checkin_date' in the CheckIn object
    const checkinDate = new Date(userAlreadyCheckinToday.createdAt)

    // Check if the date is the same (ignoring time)
    if (
      checkinDate.getDate() === date.getDate() &&
      checkinDate.getMonth() === date.getMonth() &&
      checkinDate.getFullYear() === date.getFullYear()
    ) {
      return userAlreadyCheckinToday
    }

    return null
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: data.id || randomUUID(),
      createdAt: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      user_id: data.user_id,
      gym_id: data.gym_id,
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.items
      .filter((item) => item.user_id === userId)
      .slice(20 * (page - 1), 20 * page)
  }

  async getCheckInsCount(userId: string): Promise<number> {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.items.find((item) => item.id === id)

    if (!checkIn) {
      return null
    }

    return checkIn
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const index = this.items.findIndex((item) => item.id === checkIn.id)

    if (index === -1) {
      throw new Error('CheckIn not found')
    }

    this.items[index] = checkIn

    return checkIn
  }
}
