import { StatusCodes } from 'http-status-codes';

import { BaseGraaspError } from '@graasp/sdk';

import { PLUGIN_NAME } from './constants';

export class InvalidFileItemError extends BaseGraaspError {
  origin = PLUGIN_NAME;
  constructor(data?: unknown) {
    super(
      {
        code: 'GPVERR001',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'File properties are invalid.',
      },
      data,
    );
  }
}

export class FailedImageClassificationRequestError extends BaseGraaspError {
  origin = PLUGIN_NAME;
  constructor(data?: unknown) {
    super(
      {
        code: 'GPVERR002',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Image classification request failed',
      },
      data,
    );
  }
}

export class ProcessNotFoundError extends BaseGraaspError {
  origin = PLUGIN_NAME;
  constructor(data?: unknown) {
    super(
      {
        code: 'GPVERR003',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Process Not Found',
      },
      data,
    );
  }
}

export class ProcessExecutionError extends BaseGraaspError {
  origin = PLUGIN_NAME;
  constructor(process: string, data?: unknown) {
    super(
      {
        code: 'GPVERR004',
        statusCode: StatusCodes.BAD_REQUEST,
        message: `An error occurs during execution process: ${process}`,
      },
      data,
    );
  }
}

export class ItemValidationError extends BaseGraaspError {
  constructor(data?: unknown) {
    super(
      {
        code: 'GPVERR005',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'An error occurs while validating the item',
      },
      data,
    );
  }
}
