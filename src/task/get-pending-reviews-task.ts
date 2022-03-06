// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { FullValidationRecord } from '../types';

export class GetPendingReviewsTask extends BaseValidationTask<FullValidationRecord[]> {
  get name(): string {
    return GetPendingReviewsTask.name;
  }

  constructor(member: Member, validationService: ValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    // Add record of this validation process
    const entries = await this.validationService.getValidationReviewEntries(handler);

    this.status = 'OK';
    this._result = entries;
  }
}
