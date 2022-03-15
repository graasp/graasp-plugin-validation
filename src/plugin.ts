// global
import { FastifyPluginAsync } from 'fastify';

// local
import { ValidationService } from './db-service';
import { TaskManager } from './task-manager';
import { allReview, allStatus, validation, validationReview } from './schemas';
import { ItemValidationReview } from './types';

const plugin: FastifyPluginAsync = async (fastify) => {
  const {
    taskRunner: runner,
    items: {dbService: iS},
  } = fastify;
  const validationService = new ValidationService();
  const taskManager = new TaskManager(validationService);

  // get a list of all status
  fastify.get(
    '/validations/statuses',
    { schema: allStatus },
    async ({ member, log }) => {
      const task = taskManager.createGetAllStatusTask(member);
      return runner.runSingle(task, log);
    },
  );

  // get all entries need manual review
  fastify.get(
    '/validations/reviews',
    { schema: allReview },
    async ({ member, log }) => {
      const task = taskManager.createGetManualReviewTask(member);
      return runner.runSingle(task, log);
    },
  );

  // get validation status of given itemId
  fastify.get<{ Params: { itemId: string }; }>(
    '/validations/status/:itemId',
    { schema: validation },
    async ({ member, params: { itemId }, log }) => {
      const task = taskManager.createGetValidationStatusTask(member, itemId);
      return runner.runSingle(task, log);
    },
  );

  // validate item with given itemId in param
  fastify.post<{ Params: { itemId: string }; }>(
    '/validations/:itemId',
    { schema: validation },
    async ({ member, params: { itemId }, log }, reply) => {
      const task = taskManager.createScreenBadWordsTask(member, iS, itemId);
      runner.runSingle(task, log);

      // the process could take long time, so let the process run in the background and return the itemId instead
      reply.status(202);
      return itemId;
    },
  );

  // update manual review record of given entry
  fastify.post<{ Params: { id: string }; }>(
    '/validations/:id/review',
    { schema: validationReview },
    async ({ member, params: { id }, body: data, log }) => {
      const task = taskManager.createUpdateManualReviewTask(member, id, data as Partial<ItemValidationReview>);
      return runner.runSingle(task, log);
    },
  );

};

export default plugin;