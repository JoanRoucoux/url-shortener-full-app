import { Redis } from 'ioredis';

const { REDIS_HOST, REDIS_DOCKER_PORT } = process.env;

export enum RedisExpirationMode {
  EX = 'EX', // Expire in seconds
}

let client: Redis | null;

// Get Redis client
const getRedisClient = (): Redis => {
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

// Set a key/value pair
export const set = async (
  key: string,
  value: string,
  expirationMode: RedisExpirationMode,
  seconds: number
): Promise<void> => {
  try {
    await getRedisClient().set(key, value, expirationMode, seconds);
    console.info(`Key ${key} created in Redis cache`);
  } catch (error) {
    console.error(`Failed to create key in Redis cache: ${error}`);
  }
};

// Get a value from a key
export const get = async (key: string): Promise<string | null> => {
  try {
    const value = await getRedisClient().get(key);
    console.info(`Value with key ${key} retrieved from Redis cache`);
    return value;
  } catch (error) {
    console.error(
      `Failed to retrieve value with key ${key} in Redis cache: ${error}`
    );
    return null;
  }
};
