// global
import { FastifyPluginAsync } from 'fastify';

// local
import { ItemValidationService } from './db-service';
import { TaskManager } from './task-manager';
import {
  itemValidation,
  itemValidationGroup,
  itemValidationProcess,
  itemValidationReview,
  itemValidationReviews,
  status,
} from './schemas';
import { GraaspPluginValidationOptions } from './types';
import { FileTaskManager } from 'graasp-plugin-file';
import { buildStoragePath } from './utils';
import { mkdirSync, existsSync, rmSync } from 'fs';

const plugin: FastifyPluginAsync<GraaspPluginValidationOptions> = async (fastify, options) => {
  const {
    taskRunner: runner,
    items: { dbService: iS },
  } = fastify;
  const itemValidationService = new ItemValidationService();
  const taskManager = new TaskManager(itemValidationService);

  const { serviceMethod, serviceOptions, classifierApi } = options;

  const fTM = new FileTaskManager(serviceOptions, serviceMethod);

  // get a list of all statuses
  fastify.get('/validations/statuses', { schema: status }, async ({ member, log }) => {
    const task = taskManager.createGetItemValidationStatusesTask(member);
    return runner.runSingle(task, log);
  });

  fastify.get('/validations/review/statuses', { schema: status }, async ({ member, log }) => {
    const task = taskManager.createGetItemValidationReviewStatusesTask(member);
    return runner.runSingle(task, log);
  });

  // get all entries need manual review
  fastify.get(
    '/validations/reviews',
    { schema: itemValidationReviews },
    async ({ member, log }) => {
      const task = taskManager.createGetItemValidationReviewsTask(member);
      return runner.runSingle(task, log);
    },
  );

  // get validation status of given itemId
  fastify.get<{ Params: { itemId: string } }>(
    '/validations/status/:itemId',
    { schema: itemValidation },
    async ({ member, params: { itemId }, log }) => {
      const task = taskManager.createGetItemValidationAndReviewsTask(member, itemId);
      return runner.runSingle(task, log);
    },
  );

  // get iVGroups of given itemValidation
  fastify.get<{ Params: { itemValidationId: string } }>(
    '/validations/groups/:itemValidationId',
    { schema: itemValidationGroup },
    async ({ member, params: { itemValidationId }, log }) => {
      const task = taskManager.createGetItemValidationGroupsTask(member, itemValidationId);
      return runner.runSingle(task, log);
    },
  );

  // validate item with given itemId in param
  fastify.route<{ Params: { itemId: string } }>({
    method: 'POST',
    url: '/validations/:itemId',
    schema: itemValidation,
    handler: async ({ member, params: { itemId }, log }, reply) => {
      const fileStorage = buildStoragePath(itemId);
      await mkdirSync(fileStorage, {
        recursive: true,
      });

      const task = taskManager.createCreateItemValidationTask(
        member,
        iS,
        fTM,
        runner,
        serviceMethod,
        classifierApi,
        itemId,
        fileStorage,
      );
      runner.runSingle(task, log);

      // the process could take long time, so let the process run in the background and return the itemId instead
      reply.status(202);
      return itemId;
    },

    onResponse: async ({ params, log }) => {
      // delete tmp files after endpoint responded
      const itemId = (params as { itemId: string })?.itemId as string;
      const fileStorage = buildStoragePath(itemId);
      if (existsSync(fileStorage)) {
        rmSync(fileStorage, { recursive: true });
      } else {
        log?.error(`${fileStorage} was not found, and was not deleted`);
      }
    },
  });

  // update manual review record of given entry
  fastify.post<{ Params: { id: string }; Body: { status: string; reason: string } }>(
    '/validations/:id/review',
    { schema: itemValidationReview },
    async ({ member, params: { id }, body: data, log }) => {
      const task = taskManager.createUpdateItemValidationReviewTask(member, id, data);
      return runner.runSingle(task, log);
    },
  );

  // update item validation process
  fastify.post<{ Params: { id: string }; Body: { enabled: boolean } }>(
    '/validations/process/:id/enabled',
    { schema: itemValidationProcess },
    async ({ member, params: { id }, body: data, log }) => {
      const task = taskManager.createSetEnabledForItemValidationProcessTask(member, id, data);
      return runner.runSingle(task, log);
    },
  );
};

export default plugin;
