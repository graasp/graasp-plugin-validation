import { mkdirSync, rmSync } from 'fs';

import { FastifyLoggerInstance } from 'fastify';

import {
  Actor,
  DatabaseTransactionHandler,
  Item,
  ItemService,
  ItemType,
  Member,
  TaskRunner,
  TaskStatus,
} from '@graasp/sdk';
import { FileTaskManager } from 'graasp-plugin-file';

import {
  FAILURE_RESULT,
  ItemValidationProcesses,
  ItemValidationReviewStatuses,
  ItemValidationStatuses,
  SUCCESS_RESULT,
} from '../constants';
import { ItemValidationService } from '../db-service';
import { ItemValidationError, ProcessExecutionError } from '../errors';
import { handleProcesses } from '../processes/handler';
import { ItemValidationProcess, ItemValidationStatus } from '../types';
import { buildStoragePath, getStatusIdByName } from '../utils';
import { BaseValidationTask } from './base-validation-task';

type InputType = { itemId: string };

export class CreateItemValidationTask extends BaseValidationTask<string> {
  input: InputType;
  itemService: ItemService;
  fTM: FileTaskManager;
  runner: TaskRunner<Actor>;
  serviceItemType: string;
  classifierApi: string;
  // flag to indicate if item needs manual review
  // set as class attribute as it's accessed by different class functions
  needReview: boolean;

  get name(): string {
    return CreateItemValidationTask.name;
  }

  constructor(
    member: Member,
    validationService: ItemValidationService,
    itemService: ItemService,
    fTM: FileTaskManager,
    runner: TaskRunner<Actor>,
    serviceItemType: string,
    classifierApi: string,
    input: InputType,
  ) {
    super(member, validationService);
    this.itemService = itemService;
    this.input = input;
    this.fTM = fTM;
    this.runner = runner;
    this.serviceItemType = serviceItemType;
    this.classifierApi = classifierApi;
    this.needReview = false;
  }

  // recursively validate item and subitems
  validateItem = async (
    item: Item,
    iVId: string,
    enabledProcesses: ItemValidationProcess[],
    iVStatuses: ItemValidationStatus[],
    handler: DatabaseTransactionHandler,
    log: FastifyLoggerInstance,
    fileStorage: string,
  ) => {
    const executeProcess = async (process: ItemValidationProcess) => {
      // if item is not of type 'file', skip the image checking
      if (
        process?.name === ItemValidationProcesses.ImageChecking &&
        item?.type !== this.serviceItemType
      ) {
        return;
      }

      // create pending entry
      const iVGEntry = await this.validationService
        .createItemValidationGroup(
          item?.id,
          iVId,
          process.id,
          getStatusIdByName(iVStatuses, ItemValidationStatuses.Pending),
          handler,
        )
        .then((data) => data);

      // run the process on item
      const status = await handleProcesses(
        process,
        item,
        this.fTM,
        this.actor,
        this.runner,
        this.classifierApi,
        fileStorage,
        log,
      ).catch((error) => {
        // log the error
        log.error(error);
        // if some error happend during the execution of a process, it is counted as failure
        return ItemValidationStatuses.Failure;
      });

      // need review if any process failed
      if (status === ItemValidationStatuses.Failure) {
        this.needReview = true;
      }

      // update status
      await this.validationService.updateItemValidationGroup(
        iVGEntry.id,
        getStatusIdByName(iVStatuses, status),
        handler,
      );
    };

    // execute each process on item
    await Promise.all(
      enabledProcesses.map(async (process) => {
        await executeProcess(process).catch((error) => {
          throw new ProcessExecutionError(process.name, error);
        });
      }),
    );

    // recursively validate subitem
    if (item?.type === ItemType.FOLDER) {
      const subItems = await this.itemService.getChildren(item, handler);
      await Promise.all(
        subItems.map(async (subitem) => {
          await this.validateItem(
            subitem,
            iVId,
            enabledProcesses,
            iVStatuses,
            handler,
            log,
            fileStorage,
          ).catch((error) => {
            throw new ItemValidationError(error);
          });
        }),
      );
    }
  };

  async run(handler: DatabaseTransactionHandler, log: FastifyLoggerInstance): Promise<void> {
    this.status = TaskStatus.RUNNING;

    const { itemId } = this.input;

    // create folder to store files
    const fileStorage = buildStoragePath(itemId);
    await mkdirSync(fileStorage, {
      recursive: true,
    });

    // create record in item-validation
    const iVId = await this.validationService.createItemValidation(itemId, handler);

    // get all enabled processes
    const enabledProcesses = await this.validationService.getEnabledProcesses(handler);
    // get map for all statuses
    const iVStatuses = await this.validationService.getItemValidationStatuses(handler);
    // get item
    const item = await this.itemService.get(itemId, handler);

    await this.validateItem(
      item,
      iVId,
      enabledProcesses,
      iVStatuses,
      handler,
      log,
      fileStorage,
    ).catch((error) => {
      log.error(error);
      // if error occurs, we would like a manual review on the item
      this.needReview = true;
    });

    // create entry for review
    const iVRStatuses = await this.validationService.getItemValidationReviewStatuses(handler);
    if (this.needReview)
      await this.validationService.createItemValidationReview(
        iVId,
        getStatusIdByName(iVRStatuses, ItemValidationReviewStatuses.Pending),
        handler,
      );

    this._message = 'Item validation task executed.';
    // the result is only used for testing
    this._result = this.needReview ? FAILURE_RESULT : SUCCESS_RESULT;
    // The task status is always TaskStatus.OK, since the task itself completed successfully
    this.status = TaskStatus.OK;

    // delete tmp folder
    rmSync(fileStorage, { recursive: true });
  }
}
