import { Item, ItemMembership, Member } from 'graasp';
import { ServiceMethod } from 'graasp-plugin-file';
import { v4 } from 'uuid';
import { ItemValidationProcesses, ITEM_TYPE } from '../src/constants';
import { ItemValidationGroup, ItemValidationStatus } from '../src/types';

export const buildMember = (): Partial<Member> => ({
  id: v4(),
  name: 'member',
  email: 'member@email.com',
  extra: {},
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export const buildItemMembership = (): Partial<ItemMembership> => ({
  id: v4(),
  memberId: buildMember().id,
  itemPath: v4().replace(/-/g, '_'),
  creator: v4(),
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
});

export const buildItem = (): Item => {
  const id = v4();
  return {
    id,
    path: id.replace(/-/g, '_'),
    name: id,
    description: 'description',
    type: 'folder',
    extra: {},
    creator: v4(),
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    settings: {
      isPinned: false,
      showChatBox: false,
    },
  };
};

export const DEFAULT_OPTIONS = {
  classifierApi: 'localhost',
  serviceMethod: ServiceMethod.LOCAL,
  serviceOptions: {
    s3: {
      s3Region: 's3Region',
      s3Bucket: 's3Bucket',
      s3AccessKeyId: 's3AccessKeyId',
      s3SecretAccessKey: 's3SecretAccessKey',
    },
    local: {
      storageRootPath: 'storageRootPath',
    },
  },
};

export const BAD_ITEM = {
  id: 'id-bad',
  name: 'normal name',
  description: 'Shit!',
  type: ITEM_TYPE.APP,
};

export const GOOD_ITEM = {
  id: 'id-good',
  name: 'normal name',
  description: 'Some random description',
  type: ITEM_TYPE.DOCUMENT,
};

export const IMAGE_ITEM = {
  id: 'id-image',
  name: 'normal name',
  description: 'Some random description',
  type: ITEM_TYPE.LOCALFILE,
};

export const SAMPLE_VALIDATION_PROCESS = [
  {
    id: 'process-id-1',
    name: ItemValidationProcesses.BadWordsDetection,
  },
  {
    id: 'process-id-2',
    name: ItemValidationProcesses.ImageChecking,
  }
];

export const ITEM_VALIDATION_REVIEWS = [
  {
    id: 'id1',
    itemValidationId: 'item-validation-1',
    statusId: 'status-id-1',
    status: 'pending',
    createdAt: 'timestamp',
  },
  {
    id: 'id2',
    itemValidationId: 'item-validation-2',
    reviewerId: 'admin-id',
    statusId: 'status-id-2',
    status: 'accept',
    reason: '',
    updatedAt: 'ts2',
    createdAt: 'ts1',
  },
];

export const ITEM_VALIDATIONS_STATUSES = [
  {
    validationStatusId: 'pending-id',
    reviewStatusId: 'pending-id',
    validationResult: 'result1',
    reviewResult: 'result2',
  },
  {
    validationStatusId: 'failure-id',
    reviewStatusId: 'accept-id',
    validationResult: 'result',
    reviewResult: 'result',
  },
];

export const itemValidationGroupEntry: ItemValidationGroup = {
  id: 'id',
  itemId: 'item-id',
  itemValidationId: 'iv-id-1',
  processId: 'process-id',
  statusId: 'status-id',
  result: '',
  updatedAt: '',
  createdAt: '',
};

export const MOCK_STATUSES: ItemValidationStatus[] = [
  {
    id: 'id-1',
    name: 'name-1',
  },
  {
    id: 'id-2',
    name: 'name-2',
  },
];

export const IVStauses = [
  {
    id: 'id-1',
    name: 'status-1',
  },
  {
    id: 'id-2',
    name: 'status-2'
  }
];

export const MOCK_CLASSIFIER_API = 'localhost';
