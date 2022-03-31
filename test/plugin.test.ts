import { ItemService } from 'graasp';
import Runner from 'graasp-test/src/tasks/taskRunner';
import { StatusCodes } from 'http-status-codes';
import { v4 } from 'uuid';
import plugin from '../src/plugin';
import build from './app';
import {
  buildItem,
  itemValidationGroupEntry,
  ITEM_VALIDATIONS_STATUSES,
  ITEM_VALIDATION_REVIEWS,
  MOCK_STATUSES,
  SAMPLE_VALIDATION_PROCESS,
} from './constants';

const runner = new Runner();
const itemService = { itemService: jest.fn() } as unknown as ItemService;

describe('Item Validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /validations/statuses', () => {
    it('Get all statuses', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });
      const result = MOCK_STATUSES;
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => result);

      const res = await app.inject({
        method: 'GET',
        url: '/validations/statuses',
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
  });

  describe('GET /validations/review/statuses', () => {
    it('Get all statuses', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });
      const result = MOCK_STATUSES;
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => result);

      const res = await app.inject({
        method: 'GET',
        url: '/validations/review/statuses',
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
  });

  describe('GET /validations/reviews', () => {
    it('Get all validation-reviews', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });
      const result = ITEM_VALIDATION_REVIEWS;
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => result);

      const res = await app.inject({
        method: 'GET',
        url: '/validations/reviews',
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
  });

  describe('GET /validations/status/:itemId', () => {
    it('Get item validation status', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });

      const item = buildItem();
      const result = ITEM_VALIDATIONS_STATUSES;
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => result);

      const res = await app.inject({
        method: 'GET',
        url: `/validations/status/${item.id}`,
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
    it('Bad request if id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });

      jest.spyOn(runner, 'runSingle').mockImplementation(async () => true);

      const res = await app.inject({
        method: 'GET',
        url: '/validations/status/invalid-id',
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('GET /validations/groups/:itemValidationId', () => {
    it('Get item validation groups', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });

      const itemValidationId = v4();
      const result = [itemValidationGroupEntry];
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => result);

      const res = await app.inject({
        method: 'GET',
        url: `/validations/groups/${itemValidationId}`,
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
    it('Bad request if id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });

      jest.spyOn(runner, 'runSingle').mockImplementation(async () => true);

      const res = await app.inject({
        method: 'GET',
        url: '/validations/groups/invalid-id',
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('POST /validations/:itemId', () => {
    it('create validation', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });

      const itemId = v4();
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => itemId);

      const res = await app.inject({
        method: 'POST',
        url: `/validations/${itemId}`,
      });
      expect(res.statusCode).toBe(StatusCodes.ACCEPTED);
      expect(res.body).toEqual(itemId);
    });
    it('Bad request if id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });

      const res = await app.inject({
        method: 'POST',
        url: '/validations/invalid-id',
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('POST /validations/:id/review', () => {
    it('Update item-validation-review entry', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });
      const result = ITEM_VALIDATION_REVIEWS[1];
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => result);

      const res = await app.inject({
        method: 'POST',
        url: `/validations/${v4()}/review`,
        payload: {
          statusId: 'new-status-id',
          reason: 'some reasons',
        },
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
    it('Bad request if entry id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });
      const res = await app.inject({
        method: 'POST',
        url: '/validations/invalid-id/review',
        payload: {
          statusId: 'new-status-id',
          reason: 'some reasons',
        },
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });

  describe('POST /validations/process/:id/enabled', () => {
    it('Update item-validation-process entry', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });
      const result = SAMPLE_VALIDATION_PROCESS[0];
      jest.spyOn(runner, 'runSingle').mockImplementation(async () => result);

      const res = await app.inject({
        method: 'POST',
        url: `/validations/process/${v4()}/enabled`,
        payload: {
          enabled: true,
        },
      });
      expect(res.statusCode).toBe(StatusCodes.OK);
      expect(res.json()).toEqual(result);
    });
    it('Bad request if entry id is invalid', async () => {
      const app = await build({
        plugin,
        runner,
        itemService,
      });
      const res = await app.inject({
        method: 'POST',
        url: '/validations/process/invalid-id/enabled',
        payload: {
          enabled: true,
        },
      });
      expect(res.statusCode).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
