// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { ItemValidationAndReview } from '../types';

type InputType = { itemId: string };

export class GetItemValidationsAndReviewsTask extends BaseValidationTask<ItemValidationAndReview> {
  input: InputType;
  get name(): string {
    return GetItemValidationsAndReviewsTask.name;
  }

  constructor(member: Member, validationService: ItemValidationService, input: InputType) {
    super(member, validationService);
    this.input = input;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';
    const { itemId } = this.input;

    // Add record of this validation process
    const validationRecord = await this.validationService.getItemValidationAndReviews(
      itemId,
      handler,
    );

    this.status = 'OK';
    this._result = validationRecord;
  }
}
