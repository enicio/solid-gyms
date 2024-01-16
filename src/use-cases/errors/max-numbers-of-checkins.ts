export class MaxNumberOfCheckInsError extends Error {
  constructor() {
    super('Max number of chech-ins reached.')
  }
}
