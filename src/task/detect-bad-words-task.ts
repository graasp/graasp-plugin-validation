// global
import { DatabaseTransactionHandler, ItemService, Member } from 'graasp';
import BadWordsFilter from 'bad-words';
// local
import { ValidationService } from '../db-service';
import { BaseValidationTask } from './base-validation-task';
import { contentForValidation } from '../types';
import { buildValidationFailMessage, VALIDATION_SUCCESS_MESSAGE } from '../constants';
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
    const processId = await this.validationService.getProcessId('bad words detection', handler);
    // Add record of this validation process
    const itemValidationEntry = await this.validationService.createAutomaticValidationRecord(itemId, processId, handler);
    const item = await this.itemService.get(itemId, handler);
    const suspiciousFields = this.checkBadWrods([
      {name: 'name', value: item.name}, 
      {name: 'description', value: stripHtml(item.description)}
    ]);
    
    this.validationService.updateAutomaticValidationRecord(itemValidationEntry, handler);
    if (suspiciousFields.length > 0) {
      this.status = 'FAIL';
      this._result = suspiciousFields;
      this._message = buildValidationFailMessage(suspiciousFields);
    }
    else {
      this.status = 'OK';
      this._result = suspiciousFields;
      this._message = VALIDATION_SUCCESS_MESSAGE;
    }
  }
}