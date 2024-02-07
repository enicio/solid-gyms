import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createCheckInParamsSchema = z.object({
    gymId: z.string().uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => value >= -90 && value <= 90),
    longitude: z.number().refine((value) => value >= -180 && value <= 180),
  })

  const { gymId } = createCheckInParamsSchema.parse(request.params)
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  const createGymUseCase = makeCheckInUseCase()

  await createGymUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(201).send()
}
