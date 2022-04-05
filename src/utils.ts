import { ReadStream } from 'fs';
import { Actor, Member, TaskRunner } from 'graasp';
import { FileTaskManager } from 'graasp-plugin-file';
import { DownloadFileInputType } from 'graasp-plugin-file/dist/tasks/download-file-task';
import path from 'path';
import { ItemValidationStatuses } from './constants';

export const stripHtml = (str: string) => str?.replace(/<[^>]*>?/gm, '');

export const getStatusIdByName = (statuses: any[], name?: string): string => {
  // if no status is supplied, default is pending
  if (!name) name = ItemValidationStatuses.Pending;
  return statuses?.find((entry) => entry.name === name)?.id;
};

export const buildStoragePath = (itemId: string) => path.join(__dirname, itemId);

export const downloadFile = async (
  { filepath, itemId, mimetype, fileStorage }: DownloadFileInputType,
  fTM: FileTaskManager,
  member: Member,
  runner: TaskRunner<Actor>,
) => {
  const task = fTM.createDownloadFileTask(member, {
    filepath,
    itemId,
    mimetype,
    fileStorage,
  });

  // if file not found, an error will be thrown by this line
  const fileStream = (await runner.runSingle(task)) as ReadStream;
  return fileStream.path;
};
