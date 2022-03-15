// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { Status } from '../types';

export class GetItemValidationStatusesTask extends BaseValidationTask<Status[]> {
  get name(): string {
    return GetItemValidationStatusesTask.name;
  }

  constructor(member: Member, validationService: ValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    this._result = await this.validationService.getItemValidationStatuses(handler);
    this.status = 'OK';
  }
}
