import { FastifyReply, FastifyRequest } from 'fastify';
import { addUpdateUrlVisitsJob } from '../queues/urlsQueue';

// Update 'visits' attribute
export const updateUrlVisits = async (
  request: FastifyRequest<{
    Body: {
      shortenUrlKey: string;
      extendTTL: boolean;
    };
  }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { shortenUrlKey, extendTTL } = request.body;
    await addUpdateUrlVisitsJob(shortenUrlKey, extendTTL);
    reply.code(204).send();
  } catch (error) {
    reply
      .code(500)
      .send('Unable to add the update "visits" attribute job to the queue');
  }
};
