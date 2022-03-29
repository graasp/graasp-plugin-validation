// global
import { DatabaseTransactionHandler, Item, ItemService, Member } from 'graasp';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import {
  ItemValidationProcesses,
  ItemValidationReviewStatuses,
  ItemValidationStatuses,
  ITEM_TYPE,
} from '../constants';
import { getStatusIdByName, stripHtml } from '../utils';
import { checkBadWords } from '../processes/badWordsDetection';

type InputType = { itemId: string };

export class CreateItemValidationTask extends BaseValidationTask<string> {
  input: InputType;
  itemService: ItemService;

  get name(): string {
    return CreateItemValidationTask.name;
  }

  constructor(
    member: Member,
    validationService: ItemValidationService,
    itemService: ItemService,
    input: InputType,
  ) {
    super(member, validationService);
    this.itemService = itemService;
    this.input = input;
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

    // get map for all statuses
    const iVStatuses = await this.validationService.getItemValidationStatuses(handler);

    // get item
    const item = await this.itemService.get(itemId, handler);

    // recursively validate item and subitems
    const validateItem = async (item: Item) => {
      // run each process on item
      enabledProcesses.forEach(async (process) => {
        // create pending entry
        const iVGEntry = await this.validationService.createItemValidationGroup(
          item?.id,
          iVId,
          process.id,
          getStatusIdByName(iVStatuses, ItemValidationStatuses.Pending),
          handler,
        );

        let status = '';

        // run the process, update status
        switch (process.name) {
          case ItemValidationProcesses.BadWordsDetection:
            const suspiciousFields = checkBadWords([
              { name: 'name', value: item.name },
              { name: 'description', value: stripHtml(item.description) },
            ]);
            status = suspiciousFields.length > 0 ? ItemValidationStatuses.Failure : ItemValidationStatuses.Success;
            break;
          default:
            break;
        }

        // need review if any process failed
        if (status === ItemValidationStatuses.Failure) needReview = true;

        // update status
        await this.validationService.updateItemValidationGroup(iVGEntry.id, getStatusIdByName(iVStatuses, status), handler);
      });

      if (item?.type == ITEM_TYPE.FOLDER) {
        const subItems = await this.itemService.getChildren(item, handler);
        subItems.forEach(async (subitem) => {
          await validateItem(subitem);
        });
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

    this._message = 'Item validation task executed.';
    // the result is only used for testing
    this._result = needReview? 'pending manual review' : 'success';
    // The task status is always 'OK', since the task itself completed successfully
    this.status = 'OK';
  }
}
