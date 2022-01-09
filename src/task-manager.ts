import { Member } from 'graasp';
import { ValidationService } from './db-service';
import { ValidationTaskManager } from './interface/validation-task-manager';
import { ScreenBadWordsTask } from './task/screen-bad-words-task';

export class TaskManager implements ValidationTaskManager {
  private validationService: ValidationService;

  constructor(validationService: ValidationService) {
    this.validationService = validationService;
  }

  getScreenBadWordsTaskName(): string { return ScreenBadWordsTask.name; }

  createScreenBadWordsTask(member: Member, itemId: string): ScreenBadWordsTask {
    return new ScreenBadWordsTask(member, this.validationService, {itemId: itemId});
  }
}