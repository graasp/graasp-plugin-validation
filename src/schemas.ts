export default {
  $id: 'http://graasp.org/items/validation',
  definitions: {
    // item properties to be returned to the client
    itemValidationReview: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        reason: { type: ['string', 'null'] },
      },
      additionalProperties: false,
    },
  }
};

const validation = {
  params: {
    itemId: {
      $ref: 'http://graasp.org/#/definitions/uuid',
    },
  },
  required: ['itemId'],
  additionalProperties: false,
};

const validationReview = {
  params: {
    id: {
      $ref: 'http://graasp.org/#/definitions/uuid',
    },
  },
  body: {
    $ref: 'http://graasp.org/items/validation#/definitions/itemValidationReview',
  },
  required: ['id'],
  additionalProperties: false,
};

export { validation, validationReview };