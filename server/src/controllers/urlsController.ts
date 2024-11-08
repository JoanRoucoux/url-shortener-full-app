import { FastifyReply, FastifyRequest } from 'fastify';
import {
  createShortenedUrl,
  getAllUrls,
  getUrlByShortenUrlKey,
} from '../services/urlsService';

// Get all shortened URLs
export const getUrls = async (
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const urls = await getAllUrls();

    return reply.code(200).send(urls);
  } catch (error) {
    return reply
      .code(500)
      .send('Failed to retrieve the list of URLs. Please try again later');
  }
};

// Get a specific URL by its key
export const getUrl = async (
  request: FastifyRequest<{
    Params: {
      shortenUrlKey: string;
    };
  }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { shortenUrlKey } = request.params;
    const originalUrl = await getUrlByShortenUrlKey(shortenUrlKey);

    if (!originalUrl) {
      return reply
        .code(404)
        .send('The requested shortened URL could not be found');
    }

    return reply.code(200).send(originalUrl);
  } catch (error) {
    return reply.code(500).send('Unable to retrieve the specified URL');
  }
};

// Create a new shortened URL
export const postUrl = async (
  request: FastifyRequest<{
    Body: {
      originalUrl: string;
    };
  }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { originalUrl } = request.body;
    const shortenUrlKey = await createShortenedUrl(originalUrl);

    if (!shortenUrlKey) {
      return reply.code(400).send('The provided URL is invalid');
    }

    return reply.code(201).send(shortenUrlKey);
  } catch (error) {
    return reply.code(500).send('Failed to create a shortened URL');
  }
};
