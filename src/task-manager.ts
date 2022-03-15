import { ItemService, Member } from 'graasp';
import { ValidationService } from './db-service';
import { ValidationTaskManager } from './interface/validation-task-manager';
import { DetectBadWordsTask } from './task/detect-bad-words-task';
import { GetItemValidationStatusesTask } from './task/get-item-validation-statuses-task';
import { GetValidationReviewsTask } from './task/get-validation-reviews-task';
import { GetItemValidationAndReviewsTask } from './task/get-item-validation-and-reviews-task';
import { UpdateItemValidationReviewTask } from './task/update-validation-review-task';
import { ItemValidationReview } from './types';
import { GetItemValidationReviewStatusesTask } from './task/get-item-validation-review-statuses-task';

export class TaskManager implements ValidationTaskManager {
  private validationService: ValidationService;

  constructor(validationService: ValidationService) {
    this.validationService = validationService;
  }

  getDetectBadWordsTaskName(): string {
    return DetectBadWordsTask.name;
  }
  getGetItemValidationReviewsTaskName(): string {
    return GetValidationReviewsTask.name;
  }
  getGetItemValidationAndReviewsTaskName(): string {
    return GetItemValidationAndReviewsTask.name;
  }
  getUpdateItemValidationReviewTaskName(): string {
    return GetValidationReviewsTask.name;
  }
  getGetItemValidationStatusesTaskName(): string {
    return GetItemValidationStatusesTask.name;
  }
  getGetItemValidationReviewStatusesTaskName(): string {
    return this.getGetItemValidationReviewStatusesTaskName.name;
  }

  createDetectBadWordsTask(
    member: Member,
    itemService: ItemService,
    itemId: string,
  ): DetectBadWordsTask {
    return new DetectBadWordsTask(member, this.validationService, itemService, { itemId });
  }
  createGetItemValidationReviewsTask(member: Member): GetValidationReviewsTask {
    return new GetValidationReviewsTask(member, this.validationService);
  }
  createGetItemValidationAndReviewsTask(
    member: Member,
    itemId: string,
  ): GetItemValidationAndReviewsTask {
    return new GetItemValidationAndReviewsTask(member, this.validationService, { itemId });
  }
  createUpdateItemValidationReviewTask(
    member: Member,
    id: string,
    data: Partial<ItemValidationReview>,
  ): UpdateItemValidationReviewTask {
    return new UpdateItemValidationReviewTask(member, this.validationService, {
      id,
      status: data.status,
      reason: data.reason,
    });
  }
  createGetItemValidationStatusesTask(member: Member): GetItemValidationStatusesTask {
    return new GetItemValidationStatusesTask(member, this.validationService);
  }
  createGetItemValidationReviewStatusesTask(member: Member): GetItemValidationReviewStatusesTask {
    return new GetItemValidationReviewStatusesTask(member, this.validationService);
  }
}
