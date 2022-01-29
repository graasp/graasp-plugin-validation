import { ItemService, Member } from 'graasp';
import { ValidationService } from './db-service';
import { ValidationTaskManager } from './interface/validation-task-manager';
import { DetectBadWordsTask } from  './task/detect-bad-words-task';
import { GetManualReviewTask } from './task/get-manual-review-task';
import { GetValidationStatusTask } from './task/get-validation-status-task';
import { UpdateManualReviewTask } from './task/update-manual-review-task';
import { ItemValidationReview } from './types';

export class TaskManager implements ValidationTaskManager {
  private validationService: ValidationService;

  constructor(validationService: ValidationService) {
    this.validationService = validationService;
  }

  getScreenBadWordsTaskName(): string { return DetectBadWordsTask.name; }
  getGetManualReviewTaskName(): string { return GetManualReviewTask.name; }
  getGetValidationStatusTaskName(): string { return GetValidationStatusTask.name; }
  getUpdateManualReviewTaskName(): string { return GetManualReviewTask.name; }

  createScreenBadWordsTask(member: Member, itemService: ItemService, itemId: string): DetectBadWordsTask {
    return new DetectBadWordsTask(member, this.validationService, itemService, {itemId});
  }
  createGetManualReviewTask(member: Member): GetManualReviewTask {
    return new GetManualReviewTask(member, this.validationService);
  }
  createGetValidationStatusTask(member: Member, itemId: string): GetValidationStatusTask {
    return new GetValidationStatusTask(member, this.validationService, {itemId});
  }
  createUpdateManualReviewTask(member: Member, id: string, data: Partial<ItemValidationReview>): UpdateManualReviewTask {
    return new UpdateManualReviewTask(member, this.validationService, { id, status: data.status, reason: data.reason });
  }
}