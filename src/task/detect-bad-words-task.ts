// global
import { DatabaseTransactionHandler, ItemService, Member } from 'graasp';
import BadWordsFilter from 'bad-words';
// local
import { ValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { contentForValidation, ItemValidation } from '../types';
import { buildValidationFailMessage, Status, VALIDATION_SUCCESS_MESSAGE } from '../constants';
import { buildWordList, stripHtml } from '../utils';

type InputType = { itemId: string };

export class DetectBadWordsTask extends BaseValidationTask<string[]> {
  input: InputType;
  itemService: ItemService;

  get name(): string {
    return DetectBadWordsTask.name;
  }

  constructor(member: Member, validationService: ValidationService, itemService: ItemService, input: InputType) {
    super(member, validationService);
    this.itemService = itemService;
    this.input = input;
  }

  checkBadWrods = (documents: contentForValidation[]) => {
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
    const { id: processId } = await this.validationService.getProcessId('bad words detection', handler);

    // Add record of this validation process
    const itemValidationEntry = await this.validationService.createAutomaticValidationRecord(itemId, processId, handler);

    const item = await this.itemService.get(itemId, handler);
    const suspiciousFields = this.checkBadWrods([
      {name: 'name', value: item.name}, 
      {name: 'description', value: stripHtml(item.description)}
    ]);

    // Update record after the process finishes
    const updatedItemValidationEntry = suspiciousFields.length > 0 ? 
      {...itemValidationEntry, status: Status.Fail, result: suspiciousFields.toString()} :
      {...itemValidationEntry, status: Status.Success, result: ''};
    await this.validationService.updateAutomaticValidationRecord(updatedItemValidationEntry as ItemValidation, handler);

    // set task status, result and message
    this.status = 'OK';  // The task status is always 'OK', since the task itself completed successfully
    this._result = suspiciousFields;
    if (updatedItemValidationEntry.status === Status.Fail) {
      this._message = buildValidationFailMessage(suspiciousFields);
      this.validationService.createManualReviewRecord(updatedItemValidationEntry.id, handler);
    }
    else {
      this._message = VALIDATION_SUCCESS_MESSAGE;
    }
  }
}