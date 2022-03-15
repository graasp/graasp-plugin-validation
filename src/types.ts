export type contentForValidation = {
  name: string;
  value: string;
};

export type ItemValidation = {
  id: string;
  itemId: string;
  itemValidationProcessId: string;
  statusId: string;
  status: string;
  result: string;
  updatedAt: string;
  createdAt: string;
};

export type ItemValidationReview = {
  id: string;
  itemValidationId: string;
  reviewerId: string;
  statusId: string;
  status: string;
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
  validationStatusId: string;
  reviewStatusId: string;
  validationResult: string;
  reviewResult: string;
  validationUpdatedAt: string;
  reviewUpdatedAt: string;
};

export type Status = {
  id: string;
  name: string;
};
