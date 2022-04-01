import { ReadStream } from 'fs';
import { Actor, Item, Member, TaskRunner } from 'graasp';
import { FileTaskManager, LocalFileItemExtra, S3FileItemExtra } from 'graasp-plugin-file';
import { FILE_ITEM_TYPES } from 'graasp-plugin-file-item';
import path from 'path';
import mime from 'mime-types';
import { IMAGE_FILE_EXTENSIONS, ItemValidationProcesses, ItemValidationStatuses } from '../constants';
import { ItemValidationProcess } from '../types';
import { buildStoragePath, stripHtml } from '../utils';
import { checkBadWords } from './badWordsDetection';
import { classifyImage } from './imageClassification';
import { InvalidFileItemError } from '../errors';
import { DownloadFileInputType } from 'graasp-plugin-file/dist/tasks/download-file-task';

export const handleProcesses = async (process: ItemValidationProcess, item: Item, fTM: FileTaskManager, member: Member, runner: TaskRunner<Actor>): Promise<string> => {
  const downloadFile = async ({
    filepath,
    itemId,
    mimetype,
    fileStorage,
  }: DownloadFileInputType) => {
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

  switch (process.name) {
    case ItemValidationProcesses.BadWordsDetection:
      const suspiciousFields = checkBadWords([
        { name: 'name', value: item.name },
        { name: 'description', value: stripHtml(item.description) },
      ]);
      return suspiciousFields.length > 0 ? ItemValidationStatuses.Failure : ItemValidationStatuses.Success;
      break;
    case ItemValidationProcesses.ImageChecking:
      let filepath = '';
      let mimetype = '';
      // check for service type and assign filepath, mimetype respectively
      if (item?.type === FILE_ITEM_TYPES.S3) {
        const s3Extra = item?.extra as S3FileItemExtra;
        filepath = s3Extra?.s3File?.path;
        mimetype = s3Extra?.s3File?.mimetype;
      } else {
        const fileExtra = item.extra as LocalFileItemExtra;
        filepath = fileExtra?.file?.path;
        mimetype = fileExtra?.file?.mimetype;
      }

      if (!filepath || !mimetype) {
        throw new InvalidFileItemError(item);
      }
      
      let ext = path.extname(item.name);
      if (!ext) {
        // only add a dot in case of building file name with mimetype, otherwise there will be two dots in file name
        ext = `.${mime.extension(mimetype)}`;
      }

      // if file is not an image, return success
      if (!IMAGE_FILE_EXTENSIONS.includes(ext))
        return ItemValidationStatuses.Success;

      const fileStorage = buildStoragePath(item.id);
      console.log(fileStorage);

      const filePath = await downloadFile({filepath, itemId: item?.id, mimetype, fileStorage}) as string;
      const status = await classifyImage(filePath);
      return status;
      break;
    default:
      break;
  }
  return '';
};
