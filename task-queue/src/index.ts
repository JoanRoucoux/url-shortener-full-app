import Fastify, { FastifyInstance } from 'fastify';
import fastifyCors from '@fastify/cors';
import { connectToMongoDB } from './config/mongoose';
import { connectToRedis } from './config/redis';
import { connectToZookeeper } from './config/zookeeper';
import { jobsRoutes } from './routes/jobsRoutes';
import { initializePurgeExpiredUrlsJob } from './queues/urlsQueue';
import { initializeUrlsWorker } from './workers/urlsWorker';

// Fastify server instance
const fastify = Fastify();

// Configure server
fastify
  .register(fastifyCors) // Register CORS
  .register(
    async (fastify: FastifyInstance) => {
      fastify.register(jobsRoutes); // Register job routes
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

    // Initialize URL workers and queue jobs
    initializeUrlsWorker();
    initializePurgeExpiredUrlsJob();

    // Start Fastify server
    await fastify.listen({
      port: Number(process.env.NODE_TASK_QUEUE_LOCAL_PORT),
      host: process.env.NODE_TASK_QUEUE_HOST,
    });
    console.log('Server is now listening');
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
