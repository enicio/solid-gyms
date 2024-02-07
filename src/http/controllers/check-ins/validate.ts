import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeValidateCheckIns } from '@/use-cases/factories/make-validate-check-ins'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  const createGymUseCase = makeValidateCheckIns()

  await createGymUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
