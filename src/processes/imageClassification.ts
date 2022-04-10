import axios from 'axios';
import fs from 'fs';
import { IMAGE_CLASSIFIER_PREDICTION_THRESHOLD, ItemValidationStatuses } from '../constants';
import { FailedImageClassificationRequestError } from '../errors';
import { NudeNetImageClassifierResponse } from '../types';

export const sendRequestToClassifier = async (classifierApi: string, encodedImage: string) => {
  const data = { image: encodedImage };
  const response = await axios
    .post(classifierApi, {
      data,
    })
    .then(
      (response) => {
        return response.data;
      },
      (error) => {
        console.log(error);
        throw new FailedImageClassificationRequestError(error);
      },
    );
  return response;
};

export const classifyImage = async (classifierApi: string, filePath: string) => {
  const image = fs.readFileSync(filePath);
  const encodedImage = image.toString('base64');
  const response = (await sendRequestToClassifier(
    classifierApi,
    encodedImage,
  )) as NudeNetImageClassifierResponse;
  const prediction = response?.prediction?.image;
  if (!prediction) throw new FailedImageClassificationRequestError('Invalid Response');
  else if (prediction.unsafe > IMAGE_CLASSIFIER_PREDICTION_THRESHOLD) {
    return ItemValidationStatuses.Failure;
  }
  return ItemValidationStatuses.Success;
};
