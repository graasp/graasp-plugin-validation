import { ItemService, Member } from 'graasp';
import { ValidationService } from './db-service';
import { ValidationTaskManager } from './interface/validation-task-manager';
import { DetectBadWordsTask } from  './task/detect-bad-words-task';

export class TaskManager implements ValidationTaskManager {
  private validationService: ValidationService;

  constructor(validationService: ValidationService) {
    this.validationService = validationService;
  }

  getScreenBadWordsTaskName(): string { return DetectBadWordsTask.name; }

  createScreenBadWordsTask(member: Member, itemService: ItemService, itemId: string): DetectBadWordsTask {
    return new DetectBadWordsTask(member, this.validationService, itemService, {itemId});
  }
}