import { Job, Worker } from 'bullmq';
import { getRedisClient } from '../config/redis';
import {
  incrementVisitsByShortenUrlKey,
  deleteUrlsByExpiredIds,
} from '../services/urlsService';
import { QueueNames, QueueJobNames } from '../queues/urlsQueue';

interface IUpdateUrlVisitsData {
  shortenUrlKey: string;
  extendTTL: boolean;
}

type UrlJob = Job<IUpdateUrlVisitsData | void, void, QueueJobNames>;

type UrlWorker = Worker<IUpdateUrlVisitsData | void, void, QueueJobNames>;

// Worker for processing URL queue jobs
export const initializeUrlsWorker = (): UrlWorker => {
  const urlsWorker: UrlWorker = new Worker(
    QueueNames.URL_QUEUE,
    async (job: UrlJob) => {
      if (job.name === QueueJobNames.UPDATE_URL_VISITS) {
        const { shortenUrlKey, extendTTL } = job.data as IUpdateUrlVisitsData;
        await incrementVisitsByShortenUrlKey(shortenUrlKey, extendTTL);
      } else if (job.name === QueueJobNames.PURGE_EXPIRED_URLS) {
        await deleteUrlsByExpiredIds();
      }
    },
    {
      connection: getRedisClient(),
    }
  );

  // Event listeners for logging job states
  urlsWorker
    .on('active', (job: UrlJob) => {
      console.log(`[${job.id}] Job "${job.name}" is now being processed`);
    })
    .on('completed', (job: UrlJob) => {
      console.log(`[${job.id}] Job "${job.name}" completed successfully`);
    })
    .on('failed', (job: UrlJob | undefined, error: Error) => {
      console.error(`[${job?.id}] Job "${job?.name}" failed:`, error.message);
    });

  return urlsWorker;
};
