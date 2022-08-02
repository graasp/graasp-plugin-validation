import { DatabaseTransactionHandler, Member, TaskStatus } from '@graasp/sdk';

import { ItemValidationService } from '../db-service';
import { ItemValidationReview } from '../types';
import { getStatusIdByName } from '../utils';
import { BaseValidationTask } from './base-validation-task';

type InputType = { id: string; status?: string; reason?: string };

export class UpdateItemValidationReviewTask extends BaseValidationTask<ItemValidationReview> {
  input: InputType;
  reviewer: Member;

  get name(): string {
    return UpdateItemValidationReviewTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService, input: InputType) {
    super(member, validationService);
    this.input = input;
    this.reviewer = member;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = TaskStatus.RUNNING;

    const { id, status, reason } = this.input;
    const reviewerId = this.reviewer.id;

    const iVRStatuses = await this.validationService.getItemValidationReviewStatuses(handler);

    // Update manual record
    const entry = await this.validationService.updateItemValidationReview(
      id,
      getStatusIdByName(iVRStatuses, status),
      reason,
      reviewerId,
      handler,
    );

    this.status = TaskStatus.OK;
    this._result = entry;
  }
}
