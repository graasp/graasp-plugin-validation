import { Actor, FileItemType, ItemService, Member, TaskRunner } from '@graasp/sdk';
import { FileTaskManager } from 'graasp-plugin-file';

import { ItemValidationService } from './db-service';
import { CreateItemValidationTask } from './task/create-item-validation-task';
import { GetItemValidationGroupsTask } from './task/get-item-validation-groups-task';
import { GetItemValidationReviewStatusesTask } from './task/get-item-validation-review-statuses-task';
import { GetItemValidationStatusesTask } from './task/get-item-validation-statuses-task';
import { GetLastItemValidationsAndReviewsTask } from './task/get-last-item-validation-and-reviews-task';
import { GetValidationReviewsTask } from './task/get-validation-reviews-task';
import { SetEnabledForItemValidationProcessTask } from './task/set-enabled-for-item-validation-process-task';
import { UpdateItemValidationReviewTask } from './task/update-validation-review-task';
import {
  SetEnabledForItemValidationProcessTaskInput,
  UpdateItemValidationReviewTaskInput,
} from './types';
import { GetItemValidationProcessesTask } from './task/get-item-validation-processes-task';

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
  getGetItemValidationProcessesTaskName(): string {
    return GetItemValidationProcessesTask.name;
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
    fileItemType: FileItemType,
    classifierApi: string,
    itemId: string,
  ): CreateItemValidationTask {
    return new CreateItemValidationTask(
      member,
      this.itemValidationService,
      itemService,
      fTM,
      runner,
      fileItemType,
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
  createGetItemValidationProcessesTask(member: Member): GetItemValidationProcessesTask {
    return new GetItemValidationProcessesTask(member, this.itemValidationService);
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
