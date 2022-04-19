import fs from 'fs';
import fetch from 'node-fetch';
import { IMAGE_CLASSIFIER_PREDICTION_THRESHOLD, ItemValidationStatuses } from '../constants';
import { FailedImageClassificationRequestError } from '../errors';
import { NudeNetImageClassifierResponse } from '../types';

export const sendRequestToClassifier = async (
  classifierApi: string,
  encodedImage: string,
): Promise<NudeNetImageClassifierResponse> => {
  const data = fetch(classifierApi, {
    method: 'POST',
    body: JSON.stringify({ image: encodedImage }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new FailedImageClassificationRequestError(response.statusText);
      }
      return response;
    })
    .then((response) => response.json());

  return data;
};

export const classifyImage = async (
  classifierApi: string,
  filePath: string,
): Promise<ItemValidationStatuses> => {
  const image = fs.readFileSync(filePath);
  const encodedImage = image.toString('base64');
  const response = await sendRequestToClassifier(classifierApi, encodedImage);

  const prediction = response?.prediction?.image;
  if (!prediction) {
    throw new FailedImageClassificationRequestError('Invalid Response');
  }

  if (prediction.unsafe > IMAGE_CLASSIFIER_PREDICTION_THRESHOLD) {
    return ItemValidationStatuses.Failure;
  }
  return ItemValidationStatuses.Success;
};
