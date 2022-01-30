// global
import { FastifyPluginAsync } from 'fastify';

// local
import { ValidationService } from './db-service';
import { TaskManager } from './task-manager';
import { validation, validationReview } from './schemas';
import { ItemValidationReview } from './types';

const plugin: FastifyPluginAsync = async (fastify) => {
  const {
    taskRunner: runner,
    items: {dbService: iS},
  } = fastify;
  const validationService = new ValidationService();
  const taskManager = new TaskManager(validationService);

  // get all entries need manual review
  fastify.get(
    '/validation-review',
    async ({ member, log }) => {
      const task = taskManager.createGetManualReviewTask(member);
      return runner.runSingle(task, log);
    },
  );

  // get validation status of given itemId
  fastify.get<{ Params: { itemId: string }; }>(
    '/validation/status/:itemId',
    { schema: validation },
    async ({ member, params: { itemId }, log }) => {
      const task = taskManager.createGetValidationStatusTask(member, itemId);
      return runner.runSingle(task, log);
    },
  );

  // validate item with given itemId in param
  fastify.post<{ Params: { itemId: string }; }>(
    '/validation/:itemId',
    { schema: validation },
    async ({ member, params: { itemId }, log }) => {
      const task = taskManager.createScreenBadWordsTask(member, iS, itemId);
      return runner.runSingle(task, log);
    },
  );

  // update manual review record of given entry
  fastify.post<{ Params: { id: string }; }>(
    '/validation-review/:id',
    { schema: validationReview },
    async ({ member, params: { id }, body: data, log }) => {
      const task = taskManager.createUpdateManualReviewTask(member, id, data as Partial<ItemValidationReview>);
      return runner.runSingle(task, log);
    },
  );

};

export default plugin;