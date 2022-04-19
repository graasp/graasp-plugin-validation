import { Actor, Item, Member, TaskRunner } from 'graasp';
import {
  FileTaskManager,
  LocalFileItemExtra,
  S3FileItemExtra,
  ServiceMethod,
} from 'graasp-plugin-file';
import path from 'path';
import mime from 'mime-types';
import {
  IMAGE_FILE_EXTENSIONS,
  ItemValidationProcesses,
  ItemValidationStatuses,
} from '../constants';
import { ItemValidationProcess } from '../types';
import { downloadFile, stripHtml } from '../utils';
import { checkBadWords } from './badWordsDetection';
import { classifyImage } from './imageClassification';
import { InvalidFileItemError, ProcessNotFoundError } from '../errors';
import { FastifyLoggerInstance } from 'fastify';

export const handleProcesses = async (
  process: ItemValidationProcess,
  item: Item,
  fTM: FileTaskManager,
  member: Member,
  runner: TaskRunner<Actor>,
  classifierApi: string,
  fileStorage: string,
  log: FastifyLoggerInstance,
): Promise<string> => {
  switch (process.name) {
    case ItemValidationProcesses.BadWordsDetection:
      const suspiciousFields = checkBadWords([
        { name: 'name', value: item.name },
        { name: 'description', value: stripHtml(item.description) },
      ]);
      return suspiciousFields.length > 0
        ? ItemValidationStatuses.Failure
        : ItemValidationStatuses.Success;
    case ItemValidationProcesses.ImageChecking:
      let filepath = '';
      let mimetype = '';
      // check for service type and assign filepath, mimetype respectively
      if (item?.type === ServiceMethod.S3) {
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
      if (!IMAGE_FILE_EXTENSIONS.includes(ext)) {
        return ItemValidationStatuses.Success;
      }

      const filePath = await downloadFile(
        { filepath, itemId: item?.id, mimetype, fileStorage },
        fTM,
        member,
        runner,
      );
      const status = await classifyImage(classifierApi, filePath).catch((error) => {
        log.error(error);
        return ItemValidationStatuses.Failure;
      });
      return status;
    default:
      throw new ProcessNotFoundError(process?.name);
  }
};
