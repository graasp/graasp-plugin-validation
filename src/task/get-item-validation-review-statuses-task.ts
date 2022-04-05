// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { ItemValidationReviewStatus } from '../types';

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
    this.status = 'RUNNING';

    this._result = await this.validationService.getItemValidationReviewStatuses(handler);
    this.status = 'OK';
  }
}
