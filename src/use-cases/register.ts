import { UserRepository } from '@/repository/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists'

interface ResgiterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface ResgiterUseCaseResponse {
  user: {
    id: string
    name: string
    email: string
    password_hash: string
    created_at: Date
  }
}

export class RegisterUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({
    name,
    email,
    password,
  }: ResgiterUseCaseRequest): Promise<ResgiterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.userRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.userRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
