import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeNearByGymsUseCase } from '@/use-cases/factories/make-near-by-gyms'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearByGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.number().refine((value) => value >= -180 && value <= 180),
  })

  const { latitude, longitude } = nearByGymsQuerySchema.parse(request.body)

  const nearByGymsUseCase = makeNearByGymsUseCase()

  const gyms = await nearByGymsUseCase.execute({
    latitude,
    longitude,
  })

  return reply.status(200).send({ gyms })
}
