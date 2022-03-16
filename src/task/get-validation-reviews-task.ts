// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { FullValidationRecord } from '../types';

export class GetValidationReviewsTask extends BaseValidationTask<FullValidationRecord[]> {
  get name(): string {
    return GetValidationReviewsTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    // Add record of this validation process
    const entries = await this.validationService.getItemValidationReviews(handler);

    this.status = 'OK';
    this._result = entries;
  }
}
