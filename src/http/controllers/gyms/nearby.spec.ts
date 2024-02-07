import { test, expect, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Nearby Gym (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  test('Should be able to search a gym after create', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia Teste 1',
        description: 'Academia Teste 1',
        phone: '123456789',
        latitude: -19.955198,
        longitude: -43.997469,
      })

    await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia Teste 2',
        description: 'Academia Teste 2',
        phone: '987654321',
        latitude: -19.849801,
        longitude: -43.949589,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({ latitude: -19.949354, longitude: -43.990419 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    const { gyms } = response.body

    expect(response.status).toEqual(200)
    expect(gyms.length).toEqual(1)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Academia Teste 1',
        }),
      ]),
    )
  })
})
