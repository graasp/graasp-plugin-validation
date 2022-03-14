// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { Status } from '../types';

export class GetAllStatusTask extends BaseValidationTask<Status[]> {
  get name(): string {
    return GetAllStatusTask.name;
  }

  constructor(member: Member, validationService: ValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    // Add record of this validation process
    const entries = await this.validationService.getAllStatus(handler);

    this.status = 'OK';
    this._result = entries;
  }
}
