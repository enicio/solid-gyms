import { authenticate } from './authenticate'
import { register } from './register'
import { profile } from './profile'
import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middleware/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  //* * Autheticated */
  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
