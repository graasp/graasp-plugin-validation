import fastify, { FastifyPluginAsync } from 'fastify';

import { Actor, ItemService, TaskRunner } from '@graasp/sdk';

import { GraaspPluginValidationOptions } from '../src/types';
import common from './common';
import { DEFAULT_OPTIONS } from './constants';

type props = {
  runner: TaskRunner<Actor>;
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
