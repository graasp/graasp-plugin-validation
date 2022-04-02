import axios from 'axios';
import fs from 'fs';
import { CLASSIFIER_ENDPOINT, ItemValidationStatuses, PREDICTION_THRESHOLD } from '../constants';
import { FaildImageClassificationRequestError } from '../errors';
import { ImageClassifierResponse } from '../types';

export const sendRequestToClassifier = async (encodedImage: string) => {
  const data = {'image': encodedImage};
  // ATTENTION: the url should be substitute with the url of real prod container when deployed
  const response = await axios.post(CLASSIFIER_ENDPOINT, {
    data,
  })
  .then((response) => {
    return(response.data);
  }, (error) => {
    console.log(error);
    throw new FaildImageClassificationRequestError(error);
  });
  return response;
};

export const classifyImage = async (filePath: string) => {
  const image = fs.readFileSync(filePath);
  const encodedImage = image.toString('base64');
  const response = await sendRequestToClassifier(encodedImage) as ImageClassifierResponse;
  const prediction = response?.prediction?.image;
  console.log(prediction);
  if (!prediction)
    throw new FaildImageClassificationRequestError('Invalid Response');
  else if (prediction.unsafe > PREDICTION_THRESHOLD)
    return ItemValidationStatuses.Failure;
  return ItemValidationStatuses.Success;
};
