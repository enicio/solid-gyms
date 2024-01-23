import { test, expect, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Authenticate (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  test('Should be able to authenticate', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '12345678',
    })

    const response = await request(app.server).post('/sessions').send({
      email: 'johndoe@email.com',
      password: '12345678',
    })

    const { body } = await request(app.server)
      .post('/me')
      .set('Authorization', `Bearer ${response.body.token}`)
      .send()
    const { name, email } = body.user

    expect(name).toEqual('John Doe')
    expect(email).toEqual('johndoe@email.com')
  })
})
