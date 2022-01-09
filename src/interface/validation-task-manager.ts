// global
import { Actor, Member, Task } from 'graasp';


export interface ValidationTaskManager<A extends Actor = Actor> {
  getScreenBadWordsTaskName(): string;

  createScreenBadWordsTask(member: Member, itemId: string): Task<A, boolean>;
}