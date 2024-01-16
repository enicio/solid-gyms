import { Prisma, User } from '@prisma/client'
import { UserRepository } from '../users-repository'

export class InMemoryUsersRepository implements UserRepository {
  public items: User[] = []

  async findById(userId: string) {
    const user = this.items.find((item: User) => item.id === userId)

    if (!user) return null
    return user || null
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: data.id || '',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash || '',
      created_at: new Date(),
    }
    this.items.push(user)
    return user
  }

  async findByEmail(email: string): Promise<{
    id: string
    name: string
    email: string
    password_hash: string
    created_at: Date
  } | null> {
    const user = this.items.find((item: User) => item.email === email)

    if (!user) return null
    return user || null
  }
}
