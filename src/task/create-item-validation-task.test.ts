import { DatabaseTransactionHandler, Member, Item, ItemService } from 'graasp';

import { ItemValidationService } from '../db-service';
import {
  BAD_ITEM,
  buildMember,
  DEFAULT_OPTIONS,
  GOOD_ITEM,
  itemValidationGroupEntry,
  ITEM_VALIDATION_REVIEWS,
  IVStauses,
  MOCK_CLASSIFIER_API,
  SAMPLE_VALIDATION_PROCESS,
} from '../../test/constants';
import { CreateItemValidationTask } from './create-item-validation-task';
import { ItemValidationReview } from '../types';
import { FileTaskManager } from 'graasp-plugin-file';
import { FAILURE_RESULT, ITEM_TYPE, SUCCESS_RESULT } from '../constants';
import Runner from 'graasp-test/src/tasks/taskRunner';
import { FastifyLoggerInstance } from 'fastify';

const handler = {} as unknown as DatabaseTransactionHandler;
const log = {} as unknown as FastifyLoggerInstance;

const validationService = new ItemValidationService();
const itemService = { get: jest.fn() } as unknown as ItemService;

const member = buildMember() as Member;
const fTM = new FileTaskManager(DEFAULT_OPTIONS.serviceOptions, DEFAULT_OPTIONS.serviceMethod);
const runner = new Runner();


describe('Run detect bad words process', () => {
  const iVP = [SAMPLE_VALIDATION_PROCESS[0]];
  const iVId = 'item-validation-id-1';
  jest.spyOn(validationService, 'getEnabledProcesses').mockImplementation(async () => iVP);
  jest
    .spyOn(validationService, 'getItemValidationStatuses')
    .mockImplementation(async () => IVStauses);
  jest
    .spyOn(validationService, 'getItemValidationReviewStatuses')
    .mockImplementation(async () => IVStauses);
  jest.spyOn(validationService, 'createItemValidation').mockImplementation(async () => iVId);
  jest
    .spyOn(validationService, 'createItemValidationGroup')
    .mockImplementation(async () => itemValidationGroupEntry);
  jest
    .spyOn(validationService, 'updateItemValidationGroup')
    .mockImplementation(async () => itemValidationGroupEntry);
  jest
    .spyOn(validationService, 'createItemValidationReview')
    .mockImplementation(async () => ITEM_VALIDATION_REVIEWS[0] as ItemValidationReview);

  it('Detect fields containing bad words', async () => {
    const input = BAD_ITEM.id;
    const item = BAD_ITEM;
    const task = new CreateItemValidationTask(
      member,
      validationService,
      itemService,
      fTM,
      runner,
      ITEM_TYPE.LOCALFILE,
      MOCK_CLASSIFIER_API,
      { itemId: input },
    );
    jest.spyOn(itemService, 'get').mockImplementation(async () => item as Item);
    await task.run(handler, log);
    expect(task.result).toEqual(FAILURE_RESULT);
  });

  it('Return empty list if item is OK', async () => {
    const input = GOOD_ITEM.id;
    const item = GOOD_ITEM;
    const task = new CreateItemValidationTask(
      member,
      validationService,
      itemService,
      fTM,
      runner,
      ITEM_TYPE.LOCALFILE,
      MOCK_CLASSIFIER_API,
      { itemId: input },
    );
    jest.spyOn(itemService, 'get').mockImplementation(async () => item as Item);
    await task.run(handler, log);
    expect(task.result).toEqual(SUCCESS_RESULT);
  });
});
