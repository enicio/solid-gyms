import { test, expect, describe, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Authenticate (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })
  test('Should be able to authenticate', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const { body } = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()
    const { name, email } = body.user

    expect(name).toEqual('John Doe')
    expect(email).toEqual('johndoe@email.com')
  })
})
