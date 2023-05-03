export default {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid', required: true },
        title: { type: 'string', required: true },
        description: { type: 'string', required: false },
        priority: { type: 'string', required: true },
        complete: { type: 'boolean', required: true }
    }
};
