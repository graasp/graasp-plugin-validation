import path from 'path';
import { ItemValidationStatuses, TMP_FOLDER_PATH } from './constants';

export const stripHtml = (str: string) => str?.replace(/<[^>]*>?/gm, '');

export const getStatusIdByName = (statuses: any[], name?: string): string => {
  // if no status is supplied, default is pending
  if (!name) name = ItemValidationStatuses.Pending;
  return statuses?.find((entry) => entry.name === name)?.id;
};

export const buildStoragePath = (itemId: string) => path.join(__dirname, itemId);
