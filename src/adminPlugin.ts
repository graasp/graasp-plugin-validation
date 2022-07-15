// global
import { FastifyPluginAsync } from 'fastify';

// local
import { ItemValidationService } from './db-service';
import { TaskManager } from './task-manager';
import {
  itemValidationGroup,
  itemValidationReview,
  itemValidationReviews,
  status,
} from './schemas';

const adminPlugin: FastifyPluginAsync = async (fastify) => {
  const {
    taskRunner: runner,
  } = fastify;
  const itemValidationService = new ItemValidationService();
  const taskManager = new TaskManager(itemValidationService);

  fastify.get('/validations/processes', { schema: status }, async ({ member, log }) => {
    const task = taskManager.createGetItemValidationProcessesTask(member);
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

  // get iVGroups of given itemValidation
  fastify.get<{ Params: { itemValidationId: string } }>(
    '/validations/groups/:itemValidationId',
    { schema: itemValidationGroup },
    async ({ member, params: { itemValidationId }, log }) => {
      const task = taskManager.createGetItemValidationGroupsTask(member, itemValidationId);
      return runner.runSingle(task, log);
    },
  );

  // update manual review record of given entry
  fastify.post<{ Params: { id: string }; Body: { status: string; reason: string } }>(
    '/validations/:id/review',
    { schema: itemValidationReview },
    async ({ member, params: { id }, body: data, log }) => {
      const task = taskManager.createUpdateItemValidationReviewTask(member, id, data);
      return runner.runSingle(task, log);
    },
  );
};

export default adminPlugin;
