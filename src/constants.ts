export const SUCCESS_MESSAGE = 'Item validation passed.';

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

export enum ItemValidationProcesses {
  BadWordsDetection = 'bad-words-detection',
  AggressiveAndHateSpeech = 'aggressive-or-hate-speech-detection',
  ImageChecking = 'image-checking'
}

export enum ITEM_TYPE {
  FOLDER = 'folder',
  APP = 'app',
  DOCUMENT = 'document'
}
