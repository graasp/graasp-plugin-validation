// global
import { FastifyPluginAsync } from 'fastify';

// local
import { ItemValidationService } from './db-service';
import { TaskManager } from './task-manager';
import { itemValidation, itemValidationGroup, itemValidationProcess, itemValidationReview, itemValidationReviews, status } from './schemas';
import { ItemValidationReview } from './types';

const plugin: FastifyPluginAsync = async (fastify) => {
  const {
    taskRunner: runner,
    items: { dbService: iS },
  } = fastify;
  const itemValidationService = new ItemValidationService();
  const taskManager = new TaskManager(itemValidationService);

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
  fastify.get('/validations/reviews', { schema: itemValidationReviews }, async ({ member, log }) => {
    const task = taskManager.createGetItemValidationReviewsTask(member);
    return runner.runSingle(task, log);
  });

  // get validation status of given itemId
  fastify.get<{ Params: { itemId: string } }>(
    '/validations/status/:itemId',
    { schema: itemValidation },
    async ({ member, params: { itemId }, log }) => {
      const task = taskManager.createGetItemValidationAndReviewsTask(member, itemId);
      return runner.runSingle(task, log);
    },
  );

  // get validation status of given itemId
  fastify.get<{ Params: { itemValidationId: string } }>(
    '/validations/groups/:itemValidationId',
    { schema: itemValidationGroup },
    async ({ member, params: { itemValidationId }, log }) => {
      const task = taskManager.createGetItemValidationGroupsTask(member, itemValidationId);
      return runner.runSingle(task, log);
    },
  );

  // validate item with given itemId in param
  fastify.post<{ Params: { itemId: string } }>(
    '/validations/:itemId',
    { schema: itemValidation },
    async ({ member, params: { itemId }, log }, reply) => {
      const task = taskManager.createCreateItemValidationTask(member, iS, itemId);
      runner.runSingle(task, log);

      // the process could take long time, so let the process run in the background and return the itemId instead
      reply.status(202);
      return itemId;
    },
  );

  // update manual review record of given entry
  fastify.post<{ Params: { id: string } }>(
    '/validations/:id/review',
    { schema: itemValidationReview },
    async ({ member, params: { id }, body: data, log }) => {
      const task = taskManager.createUpdateItemValidationReviewTask(
        member,
        id,
        data as Partial<ItemValidationReview>,
      );
      return runner.runSingle(task, log);
    },
  );

    // update item validation process
    fastify.post<{ Params: { id: string } }>(
      '/validations/process/:id',
      { schema: itemValidationProcess },
      async ({ member, params: { id }, body: data, log }) => {
        const task = taskManager.createUpdateItemValidationProcessTask(
          member,
          id,
          data as {enabled: boolean},
        );
        return runner.runSingle(task, log);
      },
    );
};

export default plugin;
