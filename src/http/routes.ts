import { authenticate } from './controllers/authenticate'
import { register } from './controllers/register'
import { profile } from './controllers/profile'
import { FastifyInstance } from 'fastify'
import { verifyJWT } from './middleware/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  //* * Autheticated */
  app.post('/me', { onRequest: [verifyJWT] }, profile)
}
