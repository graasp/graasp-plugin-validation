export const SUCCESS_MESSAGE = 'Validation passed.';

export const buildValidationFailMessage = (suspiciousFields: string[]) =>
  `Validation failed. The item may contain inappropriate words in ${suspiciousFields.join(', ')}`;

export enum ItemValidationStatuses {
  Success = 'success',
  Failure = 'failure',
  Pending = 'pending',
}

export enum ItemValidationReviewStatuses {
  Accepted = 'accepted',
  Rejected = 'rejected',
  Pending = 'pending',
}

export const ItemValidationProcesses = {
  BadWordsDetection: {
    name: 'bad-words-detection',
  },
  AggressiveAndHateSpeech: {
    name: 'aggressive-or-hate-speech-detection',
  },
  ImageChecking: {
    name: 'image-checking',
  },
};
