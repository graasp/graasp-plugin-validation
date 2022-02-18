export type contentForValidation = {
  name: string,
  value: string
}

export type ItemValidation = {
  id: string,
  itemId: string,
  itemValidationProcessId: string,
  statusId: string,
  status: string,
  result: string,
  updatedAt: string,
  createdAt: string,
}

export type ItemValidationReview = {
  id: string,
  itemValidationId: string,
  reviewerId: string,
  statusId: string,
  status: string,
  reason: string,
  updatedAt: string,
  createdAt: string,
}

export type ItemValidationProcess = {
  id: string,
  name: string,
}

export type FullValidationRecord = {
  id: string,
  itemId: string,
  result: string,
  process: string,
  createdAt: string,
}

export type ItemValidationStatus = {
  validationStatusId: string,
  reviewStatusId: string,
  validationResult: string,
  reviewResult: string,
}