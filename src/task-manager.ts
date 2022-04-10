import { Actor, ItemService, Member, TaskRunner } from 'graasp';
import { ItemValidationService } from './db-service';
import { CreateItemValidationTask } from './task/create-item-validation-task';
import { GetItemValidationStatusesTask } from './task/get-item-validation-statuses-task';
import { GetValidationReviewsTask } from './task/get-validation-reviews-task';
import { GetLastItemValidationsAndReviewsTask } from './task/get-last-item-validation-and-reviews-task';
import { UpdateItemValidationReviewTask } from './task/update-validation-review-task';
import { GetItemValidationReviewStatusesTask } from './task/get-item-validation-review-statuses-task';
import { GetItemValidationGroupsTask } from './task/get-item-validation-groups-task';
import { SetEnabledForItemValidationProcessTask } from './task/set-enabled-for-item-validation-process-task';
import { FileTaskManager } from 'graasp-plugin-file';
import {
  SetEnabledForItemValidationProcessTaskInput,
  UpdateItemValidationReviewTaskInput,
} from './types';

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
    return GetLastItemValidationsAndReviewsTask.name;
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
  getSetEnabledForItemValidationProcessTaskName(): string {
    return SetEnabledForItemValidationProcessTask.name;
  }

  createCreateItemValidationTask(
    member: Member,
    itemService: ItemService,
    fTM: FileTaskManager,
    runner: TaskRunner<Actor>,
    serviceItemType: string,
    classifierApi: string,
    itemId: string,
  ): CreateItemValidationTask {
    return new CreateItemValidationTask(
      member,
      this.itemValidationService,
      itemService,
      fTM,
      runner,
      serviceItemType,
      classifierApi,
      { itemId },
    );
  }
  createGetItemValidationReviewsTask(member: Member): GetValidationReviewsTask {
    return new GetValidationReviewsTask(member, this.itemValidationService);
  }
  createGetItemValidationAndReviewsTask(
    member: Member,
    itemId: string,
  ): GetLastItemValidationsAndReviewsTask {
    return new GetLastItemValidationsAndReviewsTask(member, this.itemValidationService, { itemId });
  }
  createUpdateItemValidationReviewTask(
    member: Member,
    id: string,
    data: UpdateItemValidationReviewTaskInput,
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
  createGetItemValidationGroupsTask(
    member: Member,
    itemValidationId: string,
  ): GetItemValidationGroupsTask {
    return new GetItemValidationGroupsTask(member, this.itemValidationService, {
      itemValidationId,
    });
  }
  createSetEnabledForItemValidationProcessTask(
    member: Member,
    id: string,
    data: SetEnabledForItemValidationProcessTaskInput,
  ): SetEnabledForItemValidationProcessTask {
    return new SetEnabledForItemValidationProcessTask(member, this.itemValidationService, {
      id,
      enabled: data.enabled,
    });
  }
}
