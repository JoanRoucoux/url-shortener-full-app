import { FastifyInstance } from 'fastify';
import { postUrl, getUrls, getUrl } from '../controllers/urlsController';

export const urlsRoutes = async (fastify: FastifyInstance) => {
  fastify.register(
    async (router: FastifyInstance) => {
      // Get all shortened URLs
      router.get('/', getUrls);

      // Get a specific URL by its key
      router.get('/:shortenUrlKey', getUrl);

      // Create a new shortened URL
      router.post('/', postUrl);
    },
    { prefix: '/urls' }
  );
};
