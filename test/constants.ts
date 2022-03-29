import { Item, ItemMembership, Member } from 'graasp';
import { v4 } from 'uuid';
import { ItemValidation, ItemValidationGroup, ItemValidationStatus } from '../src/types';

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

export const BAD_ITEM = {
  id: 'id-bad',
  name: 'normal name',
  description: 'Shit!',
  type: 'app',
};

export const GOOD_ITEM = {
  id: 'id-good',
  name: 'normal name',
  description: 'Some random description',
  type: 'document',
};

export const SAMPLE_VALIDATION_PROCESS = [
  {
    id: 'process-id-1',
    name: 'bad-words-detection',
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
  itemValidationProcessId: 'process-id',
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
