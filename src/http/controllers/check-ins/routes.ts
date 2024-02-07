import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middleware/verify-jwt'
import { history } from './history'
import { metrics } from './metrics'
import { validate } from './validate'
import { create } from './create'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/check-ins/histoty', history)
  app.get('/check-ins/metrics', metrics)

  app.post('/gyms/:gymId/check-ins', create)
  app.post('/check-ins/:checkInId/validate', validate)
}
