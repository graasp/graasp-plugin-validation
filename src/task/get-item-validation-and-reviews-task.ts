// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { ItemValidationAndReview } from '../types';

type InputType = { itemId: string };

export class GetItemValidationAndReviewsTask extends BaseValidationTask<ItemValidationAndReview[]> {
  input: InputType;
  get name(): string {
    return GetItemValidationAndReviewsTask.name;
  }

  constructor(member: Member, validationService: ValidationService, input: InputType) {
    super(member, validationService);
    this.input = input;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';
    const { itemId } = this.input;

    // Add record of this validation process
    const validationRecords = await this.validationService.getItemValidationAndReviews(
      itemId,
      handler,
    );

    this.status = 'OK';
    this._result = validationRecords;
  }
}
