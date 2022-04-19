import fs from 'fs';
import axios from 'axios';
import { IMAGE_CLASSIFIER_PREDICTION_THRESHOLD, ItemValidationStatuses } from '../constants';
import { FailedImageClassificationRequestError } from '../errors';
import { NudeNetImageClassifierResponse } from '../types';

export const sendRequestToClassifier = async (
  classifierApi: string,
  encodedImage: string,
): Promise<NudeNetImageClassifierResponse> => {
  const data = { image: encodedImage };
  const response = await axios
    .post(classifierApi, {
      data,
    })
    .then(({ data }) => data)
    .catch((error) => {
      console.log(error);
      throw new FailedImageClassificationRequestError(error);
    });
  return response;
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
