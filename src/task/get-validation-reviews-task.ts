import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

import { ItemValidationService } from '../db-service';
import { FullValidationRecord } from '../types';
import { BaseValidationTask } from './base-validation-task';

export class GetValidationReviewsTask extends BaseValidationTask<FullValidationRecord[]> {
  get name(): string {
    return GetValidationReviewsTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    // Add record of this validation process
    const entries = await this.validationService.getItemValidationReviews(handler);

    this.status = TaskStatus.OK;
    this._result = entries;
  }
}
