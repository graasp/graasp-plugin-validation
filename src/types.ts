export type contentForValidation = {
  name: string,
  value: string
}

export type ItemValidation = {
  id: string,
  itemId: string,
  processId: string,
  statusId: string,
  status: string,
  result: string,
  updateAt: string,
  createAt: string,
}

export type ItemValidationReview = {
  id: string,
  validationId: string,
  reviewerId: string,
  statusId: string,
  status: string,
  reason: string,
  updateAt: string,
  createAt: string,
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
  createAt: string,
}

export type ItemValidationStatus = {
  validationStatusId: string,
  reviewStatusId: string,
  validationResult: string,
  reviewResult: string,
}