import Url, { IUrl } from '../models/Url';

// Find all expired URLs
const findExpired = async (): Promise<IUrl[]> => {
  console.log('Finding expired URLs');
  const result: IUrl[] = await Url.find({ expiresAt: { $lt: new Date() } });
  console.log(`Found expired URLs: ${result.length}`);
  return result;
};

// Increment visits of a specific URL
const incrementVisits = async (shortenUrlKey: string): Promise<void> => {
  console.log(`Incrementing visits for URL key: ${shortenUrlKey}`);
  await Url.updateOne({ shortenUrlKey }, { $inc: { visits: 1 } });
  console.log(`Visits incremented for URL key: ${shortenUrlKey}`);
};

// Delete URLs by IDs
const deleteByIds = async (ids: string[]): Promise<void> => {
  console.log(`Deleting URLs with IDs: ${JSON.stringify(ids)}`);
  await Url.deleteMany({ _id: ids });
  console.log(`Deleted URLs with IDs: ${JSON.stringify(ids)}`);
};

export { findExpired, incrementVisits, deleteByIds };
