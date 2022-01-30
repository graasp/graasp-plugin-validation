export const VALIDATION_SUCCESS_MESSAGE = 'Validation passed.';

export const buildValidationFailMessage = (suspiciousFields: string[]) => 
  (`Validation failed. The item may contain inappropriate words in ${suspiciousFields.join(' ,')}`);

export enum Status {
  Accept = 'accept',
  Reject = 'reject',
  Success = 'success',
  Fail = 'fail',
}

  
