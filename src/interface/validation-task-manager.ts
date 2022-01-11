// global
import { Actor, ItemService, Member, Task } from 'graasp';


export interface ValidationTaskManager<A extends Actor = Actor> {
  getScreenBadWordsTaskName(): string;

  createScreenBadWordsTask(member: Member, itemService: ItemService, itemId: string): Task<A, boolean>;
}