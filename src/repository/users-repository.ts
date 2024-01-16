import { Prisma, User } from '@prisma/client'

export interface UserRepository {
  findById: (userId: string) => Promise<User | null>
  create: (data: Prisma.UserCreateInput) => Promise<User>
  findByEmail: (email: string) => Promise<User | null>
}
