import { FileItemType, LocalFileConfiguration, S3FileConfiguration } from '@graasp/sdk';

export interface GraaspPluginValidationOptions {
  // classifierApi is the host api of the container running the image classifier
  classifierApi: string;
  fileItemType: FileItemType;
  fileConfigurations: { s3: S3FileConfiguration; local: LocalFileConfiguration };
}

export type SetEnabledForItemValidationProcessTaskInput = {
  enabled: boolean;
};

export type UpdateItemValidationReviewTaskInput = {
  status?: string;
  reason?: string;
};

export type contentForValidation = {
  name: string;
  value: string;
};

export type ItemValidation = {
  id: string;
  itemId: string;
  createdAt: string;
};

export type ItemValidationGroup = {
  id: string;
  itemId: string;
  itemValidationId: string;
  processId: string;
  statusId: string;
  result: string;
  updatedAt: string;
  createdAt: string;
};

export type ItemValidationReview = {
  id: string;
  itemValidationId: string;
  reviewerId: string;
  statusId: string;
  reason: string;
  updatedAt: string;
  createdAt: string;
};

export type ItemValidationProcess = {
  id: string;
  name: string;
};

export type FullValidationRecord = {
  id: string;
  itemId: string;
  reviewStatusId: string;
  validationStatusId: string;
  validationResult: string;
  process: string;
  createdAt: string;
};

export type ItemValidationAndReview = {
  itemValidationId: string;
  reviewStatusId: string;
  reviewReason: string;
  createdAt: string;
};

export type ItemValidationStatus = {
  id: string;
  name: string;
};

export type ItemValidationReviewStatus = {
  id: string;
  name: string;
};

export type NudeNetImageClassifierResponse = {
  prediction?: {
    image?: {
      unsafe: number;
      safe: number;
    };
  };
};
