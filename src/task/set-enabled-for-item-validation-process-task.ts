import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

import { ItemValidationService } from '../db-service';
import { ItemValidationProcess } from '../types';
import { BaseValidationTask } from './base-validation-task';

type InputType = { id: string; enabled: boolean };

export class SetEnabledForItemValidationProcessTask extends BaseValidationTask<ItemValidationProcess> {
  input: InputType;
  reviewer: Member;

  get name(): string {
    return SetEnabledForItemValidationProcessTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService, input: InputType) {
    super(member, validationService);
    this.input = input;
    this.reviewer = member;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    const { id, enabled } = this.input;

    // Update item validation process enabled or not
    const entry = await this.validationService.setEnabledForItemValidationProcess(
      id,
      enabled,
      handler,
    );

    this.status = TaskStatus.OK;
    this._result = entry;
  }
}
