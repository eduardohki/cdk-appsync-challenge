import { DeployableAwsCdkTypeScriptApp } from 'deployable-awscdk-app-ts';
import { javascript } from 'projen';

const project = new DeployableAwsCdkTypeScriptApp({
  name: 'cdk-appsync-challenge',
  description: 'CDK AppSync API Challenge',
  packageManager: javascript.NodePackageManager.PNPM,
  defaultReleaseBranch: 'main',
  cdkVersion: '2.155.0',
  deps: [
    '@aws-appsync/utils',
  ],
  devDeps: [
    'deployable-awscdk-app-ts',
    '@faker-js/faker',
    '@aws-sdk/client-cloudformation',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/lib-dynamodb',
    '@graphql-codegen/cli',
    '@graphql-codegen/typescript',
  ],
  projenrcTs: true,
  deployOptions: {
    environments: [
      {
        name: 'dev',
        awsCredentials: {
          region: 'eu-central-1',
        },
      },
    ],
  },
});

project.addTask('db:seed', {
  description: 'Seeds DynamoDB Table with example data for queries in the GraphQL API in dev. This requires that your current shell session is configured with the target account AWS CLI profile.',
  exec: 'npx ts-node src/util/seed.ts',
});

project.addTask('codegen', {
  description: 'Runs the code generation for our AppSync API based on our GraphQL schema.',
  exec: 'npx graphql-codegen -c src/util/codegen.ts',
});

project.synth();
