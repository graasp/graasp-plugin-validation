import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

import { ItemValidationService } from '../db-service';
import { ItemValidationAndReview } from '../types';
import { BaseValidationTask } from './base-validation-task';

type InputType = { itemId: string };

export class GetLastItemValidationsAndReviewsTask extends BaseValidationTask<ItemValidationAndReview> {
  input: InputType;
  get name(): string {
    return GetLastItemValidationsAndReviewsTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService, input: InputType) {
    super(member, validationService);
    this.input = input;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;
    const { itemId } = this.input;

    // Get record of this validation process
    const validationRecord =
      (await this.validationService.getLastItemValidationAndReviews(itemId, handler)) || {};

    this.status = TaskStatus.OK;
    this._result = validationRecord;
  }
}
