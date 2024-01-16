import { CheckIn, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdOnDate(userId: string, data: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  getCheckInsCount(userId: string): Promise<number>
  findById(id: string): Promise<CheckIn | null>
  save(checkIn: CheckIn): Promise<CheckIn>
}
