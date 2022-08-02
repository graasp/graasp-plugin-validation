import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

import { ItemValidationService } from '../db-service';
import { ItemValidationStatus } from '../types';
import { BaseValidationTask } from './base-validation-task';

export class GetItemValidationStatusesTask extends BaseValidationTask<ItemValidationStatus[]> {
  get name(): string {
    return GetItemValidationStatusesTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    this._result = await this.validationService.getItemValidationStatuses(handler);
    this.status = TaskStatus.OK;
  }
}
