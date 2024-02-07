import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/verify-jwt'
import { nearby } from './nearby'
import { search } from './search'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/gyms/nearby', nearby)
  app.get('/gyms/search', search)
  app.post('/gyms/create', create)
}
