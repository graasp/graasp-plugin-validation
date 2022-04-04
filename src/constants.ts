export const SUCCESS_MESSAGE = 'Item validation passed.';

export const TMP_FOLDER_PATH = './tmp';

export const IMAGE_FILE_EXTENSIONS = ['.png', '.jpg' , '.jpeg' , '.jfif' , '.pjpeg' , '.pjp', ];

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
  ImageChecking = 'image-classification'
}

export enum ITEM_TYPE {
  LINK = 'embeddedLink',
  APP = 'app',
  DOCUMENT = 'document',
  FOLDER = 'folder',
  S3FILE = 's3File',
  LOCALFILE = 'file',
}

export const PREDICTION_THRESHOLD = 0.3;
