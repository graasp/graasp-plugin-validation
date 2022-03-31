import { Item } from 'graasp';
import { ItemValidationProcesses, ItemValidationStatuses } from '../constants';
import { ItemValidationProcess } from '../types';
import { stripHtml } from '../utils';
import { checkBadWords } from './badWordsDetection';

export const handleProcesses = (process: ItemValidationProcess, item: Item): string => {
  switch (process.name) {
    case ItemValidationProcesses.BadWordsDetection:
      const suspiciousFields = checkBadWords([
        { name: 'name', value: item.name },
        { name: 'description', value: stripHtml(item.description) },
      ]);
      return suspiciousFields.length > 0 ? ItemValidationStatuses.Failure : ItemValidationStatuses.Success;
      break;
    default:
      break;
  }
  return '';
};
