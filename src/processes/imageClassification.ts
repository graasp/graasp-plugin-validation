import axios from 'axios';
import fs from 'fs';
import { ItemValidationStatuses } from '../constants';
import { FaildImageClassificationRequestError } from '../errors';
import { ImageClassifierResponse } from '../types';

export const sendRequestToClassifier = async (encodedImage: string) => {
  const data = {'image': encodedImage};
  const response = await axios.post('http://172.17.0.1:8080/sync', {
    data,
  })
  .then((response) => {
    return(response.data);
  }, (error) => {
    console.log(error);
    throw new FaildImageClassificationRequestError(error);
  });
  // const response = {prediction: {image: {
  //   unsafe: 0.5,
  //   safe: 9.5,
  // }}};
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
  else if (prediction.unsafe > 0.3)
    return ItemValidationStatuses.Failure;
  return ItemValidationStatuses.Success;
};
