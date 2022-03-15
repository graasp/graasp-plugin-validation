import fastify, { FastifyPluginAsync } from 'fastify';
import { ItemService } from 'graasp';
import { TaskRunner } from 'graasp-test';
import common from './common';

type props = {
  runner: TaskRunner;
  plugin: FastifyPluginAsync;
  itemService: ItemService;
};

const build = async ({ plugin, runner, itemService }: props) => {
  const app = fastify({
    ajv: {
      customOptions: {
        // This allow routes that take array to correctly interpret single values as an array
        // https://github.com/fastify/fastify/blob/main/docs/Validation-and-Serialization.md
        coerceTypes: 'array',
      },
    },
  });

  app.addSchema(common);

  app.decorate('items', {
    dbService: itemService,
  });
  app.decorate('taskRunner', runner);

  await app.register(plugin, {});

  return app;
};
export default build;
