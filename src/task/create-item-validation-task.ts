// global
import { Actor, DatabaseTransactionHandler, Item, ItemService, Member, TaskRunner } from 'graasp';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import {
  ItemValidationProcesses,
  ItemValidationReviewStatuses,
  ItemValidationStatuses,
  ITEM_TYPE,
} from '../constants';
import { getStatusIdByName } from '../utils';
import { handleProcesses } from '../processes/handler';
import { FileTaskManager } from 'graasp-plugin-file';
import { ProcessNotFoundError } from '../errors';
import { ItemValidationProcess } from '../types';

type InputType = { itemId: string };

export class CreateItemValidationTask extends BaseValidationTask<string> {
  input: InputType;
  itemService: ItemService;
  fTM: FileTaskManager;
  runner: TaskRunner<Actor>;
  serviceItemType: string;

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
    input: InputType,
  ) {
    super(member, validationService);
    this.itemService = itemService;
    this.input = input;
    this.fTM = fTM;
    this.runner = runner;
    this.serviceItemType = serviceItemType;
  }

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    const { itemId } = this.input;

    // create record in item-validation
    const iVId = await this.validationService.createItemValidation(
      itemId,
      handler,
    );
    // variable to indicate if manual review is needed
    let needReview = false;

    // get all enabled processes
    const enabledProcesses = await this.validationService.getEnabledProcesses(handler);
    console.log(enabledProcesses);

    // get map for all statuses
    const iVStatuses = await this.validationService.getItemValidationStatuses(handler);

    // get item
    const item = await this.itemService.get(itemId, handler);

    // recursively validate item and subitems
    const validateItem = async (item: Item) => {

      const executeProcess = async (process: ItemValidationProcess) => {
        if (process?.name === ItemValidationProcesses.ImageChecking && item?.type !== this.serviceItemType)
        return;

        // create pending entry
        const iVGEntry = await this.validationService.createItemValidationGroup(
          item?.id,
          iVId,
          process.id,
          getStatusIdByName(iVStatuses, ItemValidationStatuses.Pending),
          handler,
        ).then(data => data);
        console.log(iVGEntry);

        const status = await handleProcesses(process, item, this.fTM, this.actor, this.runner);
        console.log('status', status);
        
        if (status === '')
          throw new ProcessNotFoundError(process.name);

        // need review if any process failed
        if (status === ItemValidationStatuses.Failure) needReview = true;

        console.log('prepare to update: ', iVGEntry.id);
        // update status
        const updatedEntry = await this.validationService.updateItemValidationGroup(iVGEntry.id, getStatusIdByName(iVStatuses, status), handler);
        console.log('item validation group entry updated: ', updatedEntry);
      };

      // execute each process on item
      await Promise.all(enabledProcesses.map(async (process) => {
        await executeProcess(process);
      }));

      if (item?.type === ITEM_TYPE.FOLDER) {
        const subItems = await this.itemService.getChildren(item, handler);
        await Promise.all(subItems.map(async (subitem) => {
          await validateItem(subitem);
        }));
      }
    };

    await validateItem(item);

    // create entry for review
    const iVRStatuses = await this.validationService.getItemValidationReviewStatuses(handler);
    if (needReview) await this.validationService.createItemValidationReview(
      iVId,
      getStatusIdByName(iVRStatuses, ItemValidationReviewStatuses.Pending),
      handler,
    );

    console.log('All finishing...');

    this._message = 'Item validation task executed.';
    // the result is only used for testing
    this._result = needReview? 'pending manual review' : 'success';
    // The task status is always 'OK', since the task itself completed successfully
    this.status = 'OK';
  }
}
