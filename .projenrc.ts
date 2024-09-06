import { DeployableAwsCdkTypeScriptApp } from 'deployable-awscdk-app-ts';
import { NodePackageManager } from 'projen/lib/javascript';
import { TrailingComma } from 'projen/lib/javascript/prettier';

const project = new DeployableAwsCdkTypeScriptApp({
  name: 'cdk-appsync-challenge',
  description: 'CDK AppSync API Challenge',
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: '9',
  minNodeVersion: '20.17.0',
  cdkVersion: '2.155.0',
  defaultReleaseBranch: 'main',
  deps: [],
  devDeps: [
    'deployable-awscdk-app-ts',
    '@faker-js/faker',
    '@aws-sdk/client-cloudformation',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/lib-dynamodb',
  ],
  projenrcTs: true,
  tsconfig: {
    compilerOptions: {
      target: 'ES2022',
      lib: ['ES2022'],
    },
  },
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
      // semi: false,
      trailingComma: TrailingComma.ALL,
    },
  },
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

project.vscode?.extensions.addRecommendations(
  'dbaeumer.vscode-eslint',
  'esbenp.prettier-vscode',
);

project.vscode?.settings.addSetting(
  'editor.defaultFormatter',
  'esbenp.prettier-vscode',
);
project.vscode?.settings.addSetting('editor.formatOnSave', true);

project.addTask('db:seed', {
  description:
    'Seeds DynamoDB Table with example data for queries in the GraphQL API in dev. Note: this requires that your current shell session is loaded with the target account via AWS CLI profile.',
  exec: 'npx ts-node src/util/seed.ts',
});

project.synth();
