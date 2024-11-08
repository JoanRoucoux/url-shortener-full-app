import { IUrl } from '../models/Url';
import { deleteNodes } from '../config/zookeeper';
import { expire, deleteKeys } from '../config/redis';
import {
  findExpired,
  incrementVisits,
  deleteByIds,
} from '../repositories/urlsRepository';

const TWO_MINUTES_IN_SECONDS = 60;

// Update 'visits' attribute
export const incrementVisitsByShortenUrlKey = async (
  shortenUrlKey: string,
  extendTTL: boolean
): Promise<void> => {
  // Increment visits
  await incrementVisits(shortenUrlKey);

  // Extend TTL for the cached URL if needed
  if (extendTTL) {
    await expire(shortenUrlKey, TWO_MINUTES_IN_SECONDS);
  }
};

// Delete expired URLs
export const deleteUrlsByExpiredIds = async (): Promise<void> => {
  // Retrieve expired URLs based on the 'expiresAt' date attribute
  const expiredUrls: IUrl[] = await findExpired();

  // Extract expired URL IDs
  const expiredIds: string[] =
    expiredUrls?.map((url) => url?._id as string) || [];

  // Delete expired URLs if any exist
  if (expiredIds.length > 0) {
    // Delete from MongoDB
    await deleteByIds(expiredIds);

    // Delete from ZooKeeper
    await deleteNodes(expiredIds);

    // Delete from Redis
    await deleteKeys(expiredIds);
  }
};
