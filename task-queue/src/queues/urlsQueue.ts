import { Queue } from 'bullmq';
import { getRedisClient } from '../config/redis';

const FIVE_MINUTE_IN_MILLISECONDS = 300000; // runs every 5 minute, for demonstration only

export enum QueueNames {
  URL_QUEUE = 'url-queue',
}

export enum QueueJobNames {
  UPDATE_URL_VISITS = 'update-url-visits',
  PURGE_EXPIRED_URLS = 'purge-expired-urls',
}

// Initialize the queue
export const urlsQueue: Queue = new Queue(QueueNames.URL_QUEUE, {
  connection: getRedisClient(),
});

// Add update URL 'visits' attribute job
export const addUpdateUrlVisitsJob = async (
  shortenUrlKey: string,
  extendTTL: boolean
): Promise<void> => {
  await urlsQueue.add(QueueJobNames.UPDATE_URL_VISITS, {
    shortenUrlKey,
    extendTTL,
  });
};

// Initialize purge expired URLs job
export const initializePurgeExpiredUrlsJob = async (): Promise<void> => {
  await urlsQueue.upsertJobScheduler(QueueJobNames.PURGE_EXPIRED_URLS, {
    every: FIVE_MINUTE_IN_MILLISECONDS,
  });
};
