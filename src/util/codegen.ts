/* eslint-disable import/no-extraneous-dependencies */
import * as path from 'node:path';
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    path.join(__dirname, '../api/schema.graphql'),
    `
scalar AWSDate
scalar AWSTime
scalar AWSDateTime
scalar AWSTimestamp
scalar AWSEmail
scalar AWSJSON
scalar AWSURL
scalar AWSPhone
scalar AWSIPAddress
scalar BigInt
scalar Double
`,
  ],
  config: {
    scalars: {
      AWSJSON: 'string',
      AWSDate: 'string',
      AWSTime: 'string',
      AWSDateTime: 'string',
      AWSTimestamp: 'number',
      AWSEmail: 'string',
      AWSURL: 'string',
      AWSPhone: 'string',
      AWSIPAddress: 'string',
      BigInt: 'bigint',
      Double: 'number',
    },
  },
  generates: {
    [path.join(__dirname, '../api/types/AppSync.ts')]: {
      plugins: ['typescript'],
    },
  },
};

export default config;
