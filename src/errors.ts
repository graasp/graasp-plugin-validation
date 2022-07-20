import { StatusCodes } from 'http-status-codes';

import { ErrorFactory } from '@graasp/sdk';

import { PLUGIN_NAME } from './constants';

const GraaspError = ErrorFactory(PLUGIN_NAME);

export class InvalidFileItemError extends GraaspError {
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

export class FailedImageClassificationRequestError extends GraaspError {
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

export class ProcessNotFoundError extends GraaspError {
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

export class ProcessExecutionError extends GraaspError {
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

export class ItemValidationError extends GraaspError {
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
