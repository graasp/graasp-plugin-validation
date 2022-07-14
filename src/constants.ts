export const PLUGIN_NAME = 'graasp-plugin-validation';

export const SUCCESS_MESSAGE = 'Item validation passed.';

export const TMP_FOLDER_PATH = './tmp';

export const IMAGE_FILE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.jfif', '.pjpeg', '.pjp'];

export const SUCCESS_RESULT = 'success';
export const FAILURE_RESULT = 'Automatic checking failed. Waiting for manual review.';

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
  AggressiveAndHateSpeech = 'aggressive-langauge-classification',
  ImageChecking = 'image-classification',
}

export const IMAGE_CLASSIFIER_PREDICTION_THRESHOLD = 0.3;
