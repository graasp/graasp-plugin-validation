// global
import { Actor, ItemService, Member, Task } from 'graasp';

export interface ValidationTaskManager<A extends Actor = Actor> {
  getCreateItemValidationTaskName(): string;

  createCreateItemValidationTask(
    member: Member,
    itemService: ItemService,
    itemId: string,
  ): Task<A, string>;
}
