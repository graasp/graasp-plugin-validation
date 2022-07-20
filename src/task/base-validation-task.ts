import { FastifyLoggerInstance } from 'fastify';

import {
  Actor,
  DatabaseTransactionHandler,
  IndividualResultType,
  Member,
  PostHookHandlerType,
  PreHookHandlerType,
  Task,
  TaskStatus,
} from '@graasp/sdk';

import { ItemValidationService } from '../db-service';

export abstract class BaseValidationTask<R> implements Task<Actor, R> {
  protected validationService: ItemValidationService;
  protected _result!: R;
  protected _message!: string;

  readonly actor: Member;

  status: TaskStatus;
  data!: Partial<IndividualResultType<R>>;
  preHookHandler!: PreHookHandlerType<R>;
  postHookHandler!: PostHookHandlerType<R>;

  skip?: boolean;
  input?: unknown;
  getInput?: () => unknown;
  getResult?: () => unknown;

  constructor(member: Member, validationService: ItemValidationService) {
    this.actor = member;
    this.validationService = validationService;
    this.status = TaskStatus.NEW;
  }

  abstract get name(): string;
  get result(): R {
    return this._result;
  }
  get message(): string {
    return this._message;
  }

  abstract run(
    handler: DatabaseTransactionHandler,
    log?: FastifyLoggerInstance,
  ): Promise<void | BaseValidationTask<R>[]>;
}
