import { FastifyInstance } from 'fastify';
import { updateUrlVisits } from '../controllers/jobsController';

export const jobsRoutes = async (fastify: FastifyInstance) => {
  fastify.register(
    async (router: FastifyInstance) => {
      // Update URL 'visits' attribute job
      router.patch('/update-url-visits', updateUrlVisits);
    },
    { prefix: '/jobs' }
  );
};
