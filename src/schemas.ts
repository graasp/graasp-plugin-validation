const validation = {
  params: {
    itemId: {
      type: 'UUID'
    },
  },
  required: 'itemId',
  additionalProperties: false,
};

export { validation };