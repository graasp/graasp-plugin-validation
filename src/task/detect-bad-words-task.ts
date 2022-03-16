// global
import { DatabaseTransactionHandler, ItemService, Member } from 'graasp';
import BadWordsFilter from 'bad-words';
// local
import { ItemValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { contentForValidation, ItemValidation } from '../types';
import {
  buildItemValidationFailMessage,
  ItemValidationProcesses,
  ItemValidationStatuses,
  SUCCESS_MESSAGE,
} from '../constants';
import { buildWordList, stripHtml } from '../utils';

type InputType = { itemId: string };

export class DetectBadWordsTask extends BaseValidationTask<string[]> {
  input: InputType;
  itemService: ItemService;

  get name(): string {
    return DetectBadWordsTask.name;
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

  checkBadWords = (documents: contentForValidation[]) => {
    const contents = documents?.filter(Boolean);
    const badWordsFilter = new BadWordsFilter();
    buildWordList(badWordsFilter);
    const suspiciousFields = [];
    for (const index in contents) {
      if (badWordsFilter.isProfane(contents[index].value)) {
        suspiciousFields.push(contents[index].name);
      }
    }
    return suspiciousFields;
  };

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    const { itemId } = this.input;
    const { id: processId } = await this.validationService.getProcessId(
      ItemValidationProcesses.BadWordsDetection.name,
      handler,
    );

    // Add record of this validation process
    const itemValidationEntry = await this.validationService.createItemValidation(
      itemId,
      processId,
      handler,
    );

    const item = await this.itemService.get(itemId, handler);
    const suspiciousFields = this.checkBadWords([
      { name: 'name', value: item.name },
      { name: 'description', value: stripHtml(item.description) },
    ]);

    // Update record after the process finishes
    const updatedItemValidationEntry: ItemValidation =
      suspiciousFields.length > 0
        ? {
            ...itemValidationEntry,
            status: ItemValidationStatuses.Failure,
            result: suspiciousFields.toString(),
          }
        : { ...itemValidationEntry, status: ItemValidationStatuses.Success, result: '' };
    await this.validationService.updateItemValidation(updatedItemValidationEntry, handler);

    // set task status, result and message
    this._result = suspiciousFields;
    if (updatedItemValidationEntry.status === ItemValidationStatuses.Failure) {
      this._message = buildItemValidationFailMessage(suspiciousFields);
      await this.validationService.createItemValidationReview(
        updatedItemValidationEntry.id,
        handler,
      );
    } else {
      this._message = SUCCESS_MESSAGE;
    }
    this.status = 'OK'; // The task status is always 'OK', since the task itself completed successfully
  }
}
