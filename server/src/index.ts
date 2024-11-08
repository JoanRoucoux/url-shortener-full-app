import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import { connectToMongoDB } from './config/mongoose';
import { connectToRedis } from './config/redis';
import { connectToZookeeper } from './config/zookeeper';
import { urlsRoutes } from './routes/urlsRoutes';

// Fastify server instance
const fastify = Fastify();

// Configure server
fastify
  .register(fastifyCors) // Register CORS
  .register(
    async (fastify: FastifyInstance) => {
      fastify.register(urlsRoutes); // Register URL routes
    },
    { prefix: '/api' }
  );

// Start the server
const start = async () => {
  try {
    // Connect to MongoDB, Redis and ZooKeeper
    await connectToMongoDB();
    await connectToRedis();
    await connectToZookeeper();

    // Start Fastify server
    await fastify.listen({
      port: Number(process.env.NODE_SERVER_LOCAL_PORT),
      host: process.env.NODE_SERVER_HOST,
    });
    console.log('Server is now listening');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
