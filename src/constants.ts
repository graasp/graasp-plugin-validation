export const VALIDATION_SUCCESS_MESSAGE = 'Validation passed.';

export const buildValidationFailMessage = (suspiciousFields: string[]) => 
  (`Validation failed. The item may contain inappropriate words in ${suspiciousFields.join(', ')}`);

export enum Status {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Success = 'success',
  Failure = 'failure',
  Pending = 'pending',
}

export const ValidationProcesses = {
  BadWordsDetection: {
    name: 'bad-words-detection',
  },
  AggressiveAndHateSpeech: {
    name: 'aggressive-or-hate-speech-detection',
  },
};
  
