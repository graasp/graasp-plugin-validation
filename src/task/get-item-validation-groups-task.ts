// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { ItemValidationGroup } from '../types';

type InputType = { itemValidationId: string };

export class GetItemValidationGroupsTask extends BaseValidationTask<ItemValidationGroup[]> {
  input: InputType;
  get name(): string {
    return GetItemValidationGroupsTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService, input: InputType) {
    super(member, validationService);
    this.input = input;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';
    const { itemValidationId } = this.input;

    // Add record of this validation process
    const validationGroups = await this.validationService.getItemValidationGroups(
      itemValidationId,
      handler,
    );

    this.status = 'OK';
    this._result = validationGroups;
  }
}
