import { DatabaseTransactionHandler, Member, Item, ItemService } from 'graasp';

import { ItemValidationService } from '../db-service';
import {
  BAD_ITEM,
  buildMember,
  GOOD_ITEM,
  itemValidationGroupEntry,
  ITEM_VALIDATION_REVIEWS,
  IVStauses,
  SAMPLE_VALIDATION_PROCESS,
} from '../../test/constants';
import { CreateItemValidationTask } from './create-item-validation-task';
import { ItemValidationReview } from '../types';
import { FileTaskManager } from 'graasp-plugin-file';
import { ITEM_TYPE } from '../constants';
import Runner from 'graasp-test/src/tasks/taskRunner';

const handler = {} as unknown as DatabaseTransactionHandler;

const validationService = new ItemValidationService();
const itemService = { get: () => null } as unknown as ItemService;

const member = buildMember() as Member;
const fTM = new FileTaskManager( {
  s3: {
    s3Region: 's3Region',
    s3Bucket: 's3Bucket',
    s3AccessKeyId: 's3AccessKeyId',
    s3SecretAccessKey: 's3SecretAccessKey',
  },
  local: {
    storageRootPath: 'storageRootPath',
  },
}, 0);
const runner = new Runner();

describe('Run detect bad words process', () => {
  const iVP = [SAMPLE_VALIDATION_PROCESS[0]];
  const iVId = 'item-validation-id-1';

  it('Detect fields containing bad words', async () => {
    const input = BAD_ITEM.id;
    const item = BAD_ITEM;
    const task = new CreateItemValidationTask(member, validationService, itemService, fTM, runner, ITEM_TYPE.LOCALFILE, { itemId: input });
    jest.spyOn(itemService, 'get').mockImplementation(async () => item as Item);
    jest.spyOn(validationService, 'getEnabledProcesses').mockImplementation(async () => iVP);
    jest
      .spyOn(validationService, 'getItemValidationStatuses')
      .mockImplementation(async () => IVStauses);
    jest
      .spyOn(validationService, 'getItemValidationReviewStatuses')
      .mockImplementation(async () => IVStauses);
    jest
      .spyOn(validationService, 'createItemValidation')
      .mockImplementation(async () => iVId);
    jest
      .spyOn(validationService, 'createItemValidationGroup')
      .mockImplementation(async () => itemValidationGroupEntry);
    jest
      .spyOn(validationService, 'updateItemValidationGroup')
      .mockImplementation(async () => itemValidationGroupEntry);
    jest
      .spyOn(validationService, 'createItemValidationReview')
      .mockImplementation(async () => ITEM_VALIDATION_REVIEWS[0] as ItemValidationReview);
    await task.run(handler);
    expect(task.result).toEqual('pending manual review');
  });

  it('Return empty list if item is OK', async () => {
    const input = GOOD_ITEM.id;
    const item = GOOD_ITEM;
    const task = new CreateItemValidationTask(member, validationService, itemService, fTM, runner, ITEM_TYPE.LOCALFILE, { itemId: input });
    jest.spyOn(itemService, 'get').mockImplementation(async () => item as Item);
    jest.spyOn(validationService, 'getEnabledProcesses').mockImplementation(async () => iVP);
    jest
      .spyOn(validationService, 'createItemValidation')
      .mockImplementation(async () => iVId);
    jest
      .spyOn(validationService, 'getItemValidationStatuses')
      .mockImplementation(async () => IVStauses);
    jest
      .spyOn(validationService, 'getItemValidationReviewStatuses')
      .mockImplementation(async () => IVStauses);
    jest
      .spyOn(validationService, 'createItemValidationGroup')
      .mockImplementation(async () => itemValidationGroupEntry);
    jest
      .spyOn(validationService, 'updateItemValidationGroup')
      .mockImplementation(async () => itemValidationGroupEntry);
    jest
      .spyOn(validationService, 'createItemValidationReview')
      .mockImplementation(async () => ITEM_VALIDATION_REVIEWS[0] as ItemValidationReview);
    await task.run(handler);
    expect(task.result).toEqual('success');
  });
});

