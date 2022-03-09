import { Item, ItemMembership, Member } from 'graasp';
import { v4 } from 'uuid';

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
  }
];

export const ITEM_VALIDATIONS_STATUS = [
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
  }
];