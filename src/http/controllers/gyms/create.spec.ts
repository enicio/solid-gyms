import { test, expect, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Gym (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  test('Should be able to create a gym', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia Teste',
        description: 'Academia Teste',
        phone: '123456789',
        latitude: -23.123456,
        longitude: -46.123456,
      })

    expect(response.status).toEqual(201)
  })
})
