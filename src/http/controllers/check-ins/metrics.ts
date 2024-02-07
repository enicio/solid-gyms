import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetCheckInsMetricsCase } from '@/use-cases/factories/make-get-check-ins-metrics-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getUserMetricsUseCase = makeGetCheckInsMetricsCase()

  const { checkInsMetrics } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ checkInsMetrics })
}
