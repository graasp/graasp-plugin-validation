import { ItemService, Member } from 'graasp';
import { ValidationService } from './db-service';
import { ValidationTaskManager } from './interface/validation-task-manager';
import { DetectBadWordsTask } from  './task/detect-bad-words-task';
import { GetPendingReviewsTask } from './task/get-pending-reviews-task';
import { GetValidationStatusTask } from './task/get-validation-status-task';
import { UpdateItemValidationReviewTask } from './task/update-validation-review-task';
import { ItemValidationReview } from './types';

export class TaskManager implements ValidationTaskManager {
  private validationService: ValidationService;

  constructor(validationService: ValidationService) {
    this.validationService = validationService;
  }

  getScreenBadWordsTaskName(): string { return DetectBadWordsTask.name; }
  getGetManualReviewTaskName(): string { return GetPendingReviewsTask.name; }
  getGetValidationStatusTaskName(): string { return GetValidationStatusTask.name; }
  getUpdateManualReviewTaskName(): string { return GetPendingReviewsTask.name; }

  createScreenBadWordsTask(member: Member, itemService: ItemService, itemId: string): DetectBadWordsTask {
    return new DetectBadWordsTask(member, this.validationService, itemService, {itemId});
  }
  createGetManualReviewTask(member: Member): GetPendingReviewsTask {
    return new GetPendingReviewsTask(member, this.validationService);
  }
  createGetValidationStatusTask(member: Member, itemId: string): GetValidationStatusTask {
    return new GetValidationStatusTask(member, this.validationService, {itemId});
  }
  createUpdateManualReviewTask(member: Member, id: string, data: Partial<ItemValidationReview>): UpdateItemValidationReviewTask {
    return new UpdateItemValidationReviewTask(member, this.validationService, { id, status: data.status, reason: data.reason });
  }
}
