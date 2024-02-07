import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@email.com',
    password: '12345678',
  })

  const {
    body: { token },
  } = await request(app.server).post('/sessions').send({
    email: 'johndoe@email.com',
    password: '12345678',
  })

  return { token }
}
