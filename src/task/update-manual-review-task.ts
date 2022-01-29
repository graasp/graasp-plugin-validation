// global
import { DatabaseTransactionHandler, Member } from 'graasp';
// local
import { ValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { ItemValidationReview } from '../types';

type InputType = { id: string, status?: string, reason?: string };

export class UpdateManualReviewTask extends BaseValidationTask<ItemValidationReview> {
  input: InputType;
  reviewer: Member;

  get name(): string {
    return UpdateManualReviewTask.name;
  }

  constructor(member: Member, validationService: ValidationService, input: InputType) {
    super(member, validationService);
    this.input = input;
    this.reviewer = member;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    const { id, status, reason } = this.input;
    const reviewerId = this.reviewer.id;

    // Update manual record
    const entry = await this.validationService.updateManualValidationRecord(
      id, status, reason, reviewerId, handler);

    this.status = 'OK';
    this._result = entry;
  }
}