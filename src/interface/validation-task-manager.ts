// global
import { Actor, ItemService, Member, Task } from 'graasp';

export interface ValidationTaskManager<A extends Actor = Actor> {
  getDetectBadWordsTaskName(): string;

  createDetectBadWordsTask(
    member: Member,
    itemService: ItemService,
    itemId: string,
  ): Task<A, string[]>;
}
