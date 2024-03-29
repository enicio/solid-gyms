import { test, expect, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search Gym (E2E)', () => {
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
        latitude: -23.123456,
        longitude: -46.123456,
      })

    await request(app.server)
      .post('/gyms/create')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Academia Teste 2',
        description: 'Academia Teste 2',
        phone: '987654321',
        latitude: -23.123456,
        longitude: -46.123456,
      })

    const response = await request(app.server)
      .get('/gyms/search')
      .query({ query: 'Academia' })
      .set('Authorization', `Bearer ${token}`)
      .send()

    const { gyms } = response.body

    expect(response.status).toEqual(200)
    expect(gyms.length).toEqual(2)
    expect(gyms).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: 'Academia Teste 1',
        }),
        expect.objectContaining({
          title: 'Academia Teste 2',
        }),
      ]),
    )
  })
})
