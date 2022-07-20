import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

import { ItemValidationService } from '../db-service';
import { ItemValidationReviewStatus } from '../types';
import { BaseValidationTask } from './base-validation-task';

export class GetItemValidationReviewStatusesTask extends BaseValidationTask<
  ItemValidationReviewStatus[]
> {
  get name(): string {
    return GetItemValidationReviewStatusesTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    this._result = await this.validationService.getItemValidationReviewStatuses(handler);
    this.status = TaskStatus.OK;
  }
}
