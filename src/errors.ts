import { GraaspErrorDetails, GraaspError } from 'graasp';
import { StatusCodes } from 'http-status-codes';

export class GraaspValidationError implements GraaspError {
  name: string;
  code: string;
  message: string;
  statusCode?: number;
  data?: unknown;
  origin: 'plugin' | string;

  constructor({ code, statusCode, message }: GraaspErrorDetails, data?: unknown) {
    this.name = code;
    this.code = code;
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.origin = 'plugin';
  }
}

export class InvalidFileItemError extends GraaspValidationError {
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

export class FailedImageClassificationRequestError extends GraaspValidationError {
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

export class ProcessNotFoundError extends GraaspValidationError {
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

export class ProcessExecutionError extends GraaspValidationError {
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

export class ItemValidationError extends GraaspValidationError {
  constructor(data?: unknown) {
    super(
      {
        code: 'GPVERR005',
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'An error occurs during validating item',
      },
      data,
    );
  }
}
