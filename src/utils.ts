import { ItemValidationStatuses } from './constants';

export const stripHtml = (str: string) => str?.replace(/<[^>]*>?/gm, '');

export const getStatusIdByName = (statuses: any[], name?: string): string => {
  // if no status is supplied, default is pending
  if (!name) name = ItemValidationStatuses.Pending;
  return statuses?.find((entry) => entry.name === name)?.id;
};
