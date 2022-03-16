export const SUCCESS_MESSAGE = 'Item validation passed.';

export const buildItemValidationFailMessage = (suspiciousFields: string[]) =>
  `Item validation failed. The item may contain inappropriate words in ${suspiciousFields.join(', ')}`;

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
