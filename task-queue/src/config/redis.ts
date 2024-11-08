import { Redis } from 'ioredis';

const { REDIS_HOST, REDIS_DOCKER_PORT } = process.env;

let client: Redis | null;

// Get Redis client
export const getRedisClient = (): Redis => {
  if (!client) {
    const config = {
      host: REDIS_HOST,
      port: Number(REDIS_DOCKER_PORT),
      maxRetriesPerRequest: null,
    };

    client = new Redis(config);
  }

  return client;
};

// Connect to Redis
export const connectToRedis = async (): Promise<void> => {
  const client = getRedisClient();

  client
    .on('connect', () => {
      console.log('Successfully connected to Redis');
    })
    .on('error', (error) => {
      console.error('Error on Redis:', error.message);
    });
};

// Extend TTL of a key
export const expire = async (key: string, seconds: number): Promise<void> => {
  try {
    await getRedisClient().expire(key, seconds);
    console.info(`TTL for key ${key} extended in Redis cache`);
  } catch (error) {
    console.error(
      `Failed to extend TTL of key ${key} in Redis cache: ${error}`
    );
  }
};

// Delete a key
const deleteKey = async (key: string): Promise<void> => {
  try {
    await getRedisClient().del(key);
    console.info(`Key ${key} deleted in Redis cache`);
  } catch (error) {
    console.error(`Failed to delete key in Redis cache: ${error}`);
  }
};

// Delete keys
export const deleteKeys = async (keys: string[]): Promise<void> =>
  keys.forEach(async (key: string) => await deleteKey(key));
