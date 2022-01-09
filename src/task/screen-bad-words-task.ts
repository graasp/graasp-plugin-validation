// global
import { DatabaseTransactionHandler, ItemService, Member } from 'graasp';
import BadWordsFilter from 'bad-words';
import { stripHtml } from '../utils';
// local
import { ValidationService } from '../db-service';
import { BaseValidationTask } from '../task/base-validation-task';

type InputType = { itemId: string };

export class ScreenBadWordsTask extends BaseValidationTask<boolean> {
  input: InputType;
  itemService: ItemService;

  get name(): string {
    return ScreenBadWordsTask.name;
  }

  constructor(member: Member, validationService: ValidationService, input: InputType) {
    super(member, validationService);
    this.input = input;
    this.itemService = new ItemService();
  }

  checkBadWrods = (documents: string[]) => {
    const strings = documents?.filter(Boolean).map((entry) => stripHtml(entry));
    const badWordsFilter = new BadWordsFilter();
    for (const index in strings) {
      if (badWordsFilter.isProfane(strings[index])) {
        return true;
      }
    }
    return false;
  };

  async run(handler: DatabaseTransactionHandler): Promise<void> {
    this.status = 'RUNNING';

    const { itemId } = this.input;
    const item = await this.itemService.get(itemId, handler);
    const suspicious = this.checkBadWrods([item.name, item.description]);
    if (suspicious) {
      this.status = 'FAIL';
      this._result = true;
      this._message = 'Validation failed. The item may contain inappropriate words in name or description.';
    }
    else {
      this.status = 'OK';
      this._result = false;
      this._message = 'Validation passed.';
    }
  }
}