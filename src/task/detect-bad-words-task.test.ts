import { DatabaseTransactionHandler, Member, Item, ItemService } from 'graasp';

import { ValidationService } from '../db-service';
import { BAD_ITEM, buildMember, GOOD_ITEM, itemValidationEntry, ITEM_VALIDATION_REVIEWS, SAMPLE_VALIDATION_PROCESS } from '../../test/constants';
import { DetectBadWordsTask } from './detect-bad-words-task';
import { ItemValidationReview } from '../types';

const handler = {} as unknown as DatabaseTransactionHandler;

const validationService = new ValidationService();
const itemService = {get: () => null } as unknown as ItemService;

const member = buildMember() as Member;

describe('Run detect bad words process', () => {
  it('Detect fields containing bad words', async () => {
    const input = BAD_ITEM.id;
    const item = BAD_ITEM;
    const iVP = SAMPLE_VALIDATION_PROCESS;

    const task = new DetectBadWordsTask(member, validationService, itemService, {itemId: input});
    jest.spyOn(itemService, 'get').mockImplementation(async () => item as Item);
    jest.spyOn(validationService, 'getProcessId').mockImplementation(async () => iVP);
    jest.spyOn(validationService, 'createItemValidation').mockImplementation(async () => itemValidationEntry);
    jest.spyOn(validationService, 'updateItemValidation').mockImplementation(async () => itemValidationEntry);
    jest.spyOn(validationService, 'createItemValidationReview').mockImplementation(async () => ITEM_VALIDATION_REVIEWS[0] as ItemValidationReview);
    await task.run(handler);
    expect(task.result).toEqual(['description']);
  });

  it('Return empty list if item is OK', async () => {
    const input = GOOD_ITEM.id;
    const item = GOOD_ITEM;
    const iVP = SAMPLE_VALIDATION_PROCESS;

    const task = new DetectBadWordsTask(member, validationService, itemService, {itemId: input});
    jest.spyOn(itemService, 'get').mockImplementation(async () => item as Item);
    jest.spyOn(validationService, 'getProcessId').mockImplementation(async () => iVP);
    jest.spyOn(validationService, 'createItemValidation').mockImplementation(async () => itemValidationEntry);
    jest.spyOn(validationService, 'updateItemValidation').mockImplementation(async () => itemValidationEntry);
    await task.run(handler);
    expect(task.result).toEqual([]);
  });
});