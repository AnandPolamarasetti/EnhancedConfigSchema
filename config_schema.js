const functionNamePattern = '^[a-zA-Z0-9-_]+$';
const stagePattern = '^[a-zA-Z0-9-]+$';

const schema = {
  type: 'object',
  properties: {
    /**
     * Org Name
     * Alphanumeric, lowercase only
     * Validation copied from Serverless Platform as of 01/2024
     * Minimum length is 2
     */
    org: {
      type: 'string',
      pattern: '^[a-z0-9]*$',
      minLength: 2,
      maxLength: 39,
    },
    /**
     * App Name
     * Alphanumeric, lowercase only, hyphens allowed,
     * cannot start or end with hyphen, no double hyphens
     * Validation copied from Serverless Platform as of 01/2024
     * Minimum length is 2
     */
    app: {
      type: 'string',
      pattern: '^(?!-)[a-z0-9]+(?:-[a-z0-9]+)*(?<!-)$',
      minLength: 2,
      maxLength: 39,
    },
    /**
     * Outputs
     * Can be string, number, boolean, array, or object
     * For use with the Serverless Platform's Outputs feature
     */
    outputs: {
      type: 'object',
      additionalProperties: {
        anyOf: [
          { type: 'string' },
          { type: 'number' },
          { type: 'boolean' },
          { type: 'array' },
          { type: 'object' },
        ],
      },
    },
    /**
     * Modes for config validation:
     * - error: throws an error
     * - warn: logs error to console without throwing an error
     * - off: disables validation
     * Default is `warn`, will be set to `error` in v2
     */
    configValidationMode: { enum: ['error', 'warn', 'off'] },
    // Deprecated
    console: {
      anyOf: [
        { type: 'boolean' },
        { type: 'object' },
      ],
      description: 'Deprecated. Use other logging configurations instead.',
    },
    custom: {
      type: 'object',
      properties: {},
      required: [],
      // User can add custom properties for their own use
    },
    dashboard: {
      type: 'object',
      properties: {
        disableMonitoring: { type: 'boolean' },
      },
      additionalProperties: false,
    },
    deprecationNotificationMode: {
      enum: ['error', 'warn', 'warn:summary'],
    },
    disabledDeprecations: {
      anyOf: [
        { const: '*' },
        {
          type: 'array',
          items: { $ref: '#/definitions/errorCode' },
        },
      ],
    },
    build: {
      anyOf: [
        { type: 'string' },
        {
          type: 'object',
          properties: {},
        },
      ],
    },
    frameworkVersion: { type: 'string' },
    functions: {
      type: 'object',
      patternProperties: {
        [functionNamePattern]: {
          type: 'object',
          properties: {
            name: { type: 'string' }, // name property is added by service class
            events: {
              type: 'array',
              items: {
                anyOf: [
                  {
                    type: 'object',
                    properties: { __schemaWorkaround__: { const: null } },
                    required: ['__schemaWorkaround__'],
                    additionalProperties: false,
                  },
                ],
              },
            },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
    package: {
      type: 'object',
      properties: {
        artifact: { type: 'string' },
        exclude: { type: 'array', items: { type: 'string' } },
        excludeDevDependencies: { type: 'boolean' },
        include: { type: 'array', items: { type: 'string' } },
        individually: { type: 'boolean' },
        path: { type: 'string' },
        patterns: { type: 'array', items: { type: 'string' } },
      },
      additionalProperties: false,
    },
    params: {
      type: 'object',
      patternProperties: {
        [stagePattern]: {
          type: 'object',
        },
      },
      additionalProperties: false,
    },
    stages: {
      type: 'object',
      patternProperties: {
        [stagePattern]: {
          type: 'object',
          properties: {
            observability: {
              anyOf: [
                { type: 'boolean' },
                { enum: ['axiom', 'dashboard'] },
                {
                  type: 'object',
                  properties: {
                    provider: { enum: ['axiom', 'dashboard'] },
                    dataset: { type: 'string' },
                  },
                  required: ['provider'],
                  additionalProperties: false,
                },
              ],
            },
            resolvers: {
              type: 'object',
            },
          },
        },
      },
      additionalProperties: false,
    },
    plugins: {
      anyOf: [
        {
          type: 'object',
          properties: {
            localPath: { type: 'string' },
            modules: { type: 'array', items: { type: 'string' } },
          },
          additionalProperties: false,
          required: ['modules'],
        },
        { type: 'array', items: { type: 'string' } },
      ],
    },
    projectDir: {
      type: 'string',
      pattern: '^(\\.\\/?|(\\.\\/)?\\.\\.(\\/\\.\\.)*\\/?)$',
    },
    provider: {
      type: 'object',
      properties: {
        // "name" is configured as const by loaded provider
      },
      required: ['name'],
      additionalProperties: false,
    },
    service: { $ref: '#/definitions/serviceName' },
    useDotenv: { const: true },
    variablesResolutionMode: { type: 'string', enum: ['20210219', '20210326'] },
  },
  additionalProperties: false,
  required: ['provider', 'service'],
  definitions: {
    errorCode: {
      type: 'string',
      pattern: '^[A-Z0-9_]+$',
    },
    functionName: {
      type: 'string',
      pattern: functionNamePattern,
    },
    serviceName: { type: 'string', pattern: '^[a-zA-Z][0-9a-zA-Z-]+$' },
    stage: { type: 'string', pattern: stagePattern },
  },
};

export default schema;
