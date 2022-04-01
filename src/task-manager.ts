import { Actor, ItemService, Member, TaskRunner } from 'graasp';
import { ItemValidationService } from './db-service';
import { CreateItemValidationTask } from './task/create-item-validation-task';
import { GetItemValidationStatusesTask } from './task/get-item-validation-statuses-task';
import { GetValidationReviewsTask } from './task/get-validation-reviews-task';
import { GetItemValidationsAndReviewsTask } from './task/get-item-validation-and-reviews-task';
import { UpdateItemValidationReviewTask } from './task/update-validation-review-task';
import { GetItemValidationReviewStatusesTask } from './task/get-item-validation-review-statuses-task';
import { GetItemValidationGroupsTask } from './task/get-item-validation-groups-task';
import { ToggleEnabledForItemValidationProcessTask } from './task/toggle-enabled-for-item-validation-process-task';
import { FileTaskManager } from 'graasp-plugin-file';

export class TaskManager {
  private itemValidationService: ItemValidationService;

  constructor(validationService: ItemValidationService) {
    this.itemValidationService = validationService;
  }

  getCreateItemValidationTaskName(): string {
    return CreateItemValidationTask.name;
  }
  getGetItemValidationReviewsTaskName(): string {
    return GetValidationReviewsTask.name;
  }
  getGetItemValidationAndReviewsTaskName(): string {
    return GetItemValidationsAndReviewsTask.name;
  }
  getUpdateItemValidationReviewTaskName(): string {
    return GetValidationReviewsTask.name;
  }
  getGetItemValidationStatusesTaskName(): string {
    return GetItemValidationStatusesTask.name;
  }
  getGetItemValidationReviewStatusesTaskName(): string {
    return GetItemValidationReviewStatusesTask.name;
  }
  getGetItemValidationGroupsTaskName(): string {
    return GetItemValidationGroupsTask.name;
  }
  getToggleEnabledForItemValidationProcessTaskName(): string {
    return ToggleEnabledForItemValidationProcessTask.name;
  }


  createCreateItemValidationTask(
    member: Member,
    itemService: ItemService,
    fTM: FileTaskManager,
    runner: TaskRunner<Actor>,
    serviceItemType: string,
    itemId: string,
  ): CreateItemValidationTask {
    return new CreateItemValidationTask(member, this.itemValidationService, itemService, fTM, runner, serviceItemType, { itemId });
  }
  createGetItemValidationReviewsTask(member: Member): GetValidationReviewsTask {
    return new GetValidationReviewsTask(member, this.itemValidationService);
  }
  createGetItemValidationAndReviewsTask(
    member: Member,
    itemId: string,
  ): GetItemValidationsAndReviewsTask {
    return new GetItemValidationsAndReviewsTask(member, this.itemValidationService, { itemId });
  }
  createUpdateItemValidationReviewTask(
    member: Member,
    id: string,
    data: {status: string, reason: string},
  ): UpdateItemValidationReviewTask {
    return new UpdateItemValidationReviewTask(member, this.itemValidationService, {
      id,
      status: data.status,
      reason: data.reason,
    });
  }
  createGetItemValidationStatusesTask(member: Member): GetItemValidationStatusesTask {
    return new GetItemValidationStatusesTask(member, this.itemValidationService);
  }
  createGetItemValidationReviewStatusesTask(member: Member): GetItemValidationReviewStatusesTask {
    return new GetItemValidationReviewStatusesTask(member, this.itemValidationService);
  }
  createGetItemValidationGroupsTask(member: Member, itemValidationId: string): GetItemValidationGroupsTask {
    return new GetItemValidationGroupsTask(member, this.itemValidationService, { itemValidationId });
  }
  createToggleEnabledForItemValidationProcessTask(
    member: Member,
    id: string,
    data: { enabled: boolean },
  ): ToggleEnabledForItemValidationProcessTask {
    return new ToggleEnabledForItemValidationProcessTask(member, this.itemValidationService, {
      id,
      enabled: data.enabled,
    });
  }
}
