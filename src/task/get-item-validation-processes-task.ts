// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { ItemValidationStatus } from '../types';

export class GetItemValidationProcessesTask extends BaseValidationTask<ItemValidationStatus[]> {
  get name(): string {
    return GetItemValidationProcessesTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService) {
    super(member, validationService);
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    this._result = await this.validationService.getItemValidationProcesses(handler);
    this.status = 'OK';
  }
}
