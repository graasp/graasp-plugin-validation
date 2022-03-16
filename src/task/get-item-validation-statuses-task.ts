// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { ItemValidationStatus } from '../types';

export class GetItemValidationStatusesTask extends BaseValidationTask<ItemValidationStatus[]> {
  get name(): string {
    return GetItemValidationStatusesTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    this._result = await this.validationService.getItemValidationStatuses(handler);
    this.status = 'OK';
  }
}
