export class InvalidCredentialsError extends Error {
  constructor() {
    super('User does not exist.')
  }
}
