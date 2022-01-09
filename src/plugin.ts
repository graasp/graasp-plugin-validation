// global
import { FastifyPluginAsync } from 'fastify';

// local
import { ValidationService } from './db-service';
import { TaskManager } from './task-manager';
import { validation } from './schemas';

const plugin: FastifyPluginAsync = async (fastify) => {
  const {
    taskRunner: runner
  } = fastify;
  const validationService = new ValidationService();
  const taskManager = new TaskManager(validationService);

  // validate item with given itemId in param
  fastify.get<{ Params: { itemId: string }; }>(
    '/validation/:itemId',
    { schema: validation },
    async ({ member, params: { itemId }, log }) => {
      const task = taskManager.createScreenBadWordsTask(member, itemId);
      return runner.runSingle(task, log);
    },
  );

};

export default plugin;