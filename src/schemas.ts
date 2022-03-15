export const allReview = {
  params: {},
  additionalProperties: false,
};

export const allStatus = {
  params: {},
  additionalProperties: false,
};

export const validation = {
  params: {
    itemId: {
      $ref: 'http://graasp.org/#/definitions/uuid',
    },
  },
  required: ['itemId'],
  additionalProperties: false,
};

export const validationReview = {
  params: {
    id: {
      $ref: 'http://graasp.org/#/definitions/uuid',
    },
  },
  body: {
    status: {
      type: 'string',
    },
    reason: {
      type: 'string',
    },
  },
  required: ['id'],
  additionalProperties: false,
};
