import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetCheckInsHistoryUseCase } from '@/use-cases/factories/make-get-check-ins-history'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.number().min(1).default(1),
  })

  const { page } = checkInHistoryQuerySchema.parse(request.body)

  const getCheckInHistoryUseCase = makeGetCheckInsHistoryUseCase()

  const { checkIns } = await getCheckInHistoryUseCase.execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send({ checkIns })
}
