import { test, expect, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  test('Should be abble resgister a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'jonhdoe@email.com',
      password: '12345678',
    })

    expect(response.status).toEqual(201)
  })
})
