import fastify, { FastifyPluginAsync } from 'fastify';
import { ItemService } from 'graasp';
import { TaskRunner } from 'graasp-test';
import common from './common';
import { GraaspPluginValidationOptions } from '../src/types';
import { DEFAULT_OPTIONS } from './constants';

type props = {
  runner: TaskRunner;
  options?: GraaspPluginValidationOptions;
  plugin: FastifyPluginAsync<GraaspPluginValidationOptions>;
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

  await app.register(plugin, DEFAULT_OPTIONS);

  return app;
};
export default build;
