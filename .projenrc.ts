import { DeployableAwsCdkTypeScriptApp } from 'deployable-awscdk-app-ts';
import { NodePackageManager } from 'projen/lib/javascript';
import { TrailingComma } from 'projen/lib/javascript/prettier';

const project = new DeployableAwsCdkTypeScriptApp({
  authorName: 'Eduardo Hernacki',
  authorEmail: 'services@runlevel0.me',
  name: 'cdk-appsync-challenge',
  description: 'CDK AppSync API Challenge',
  packageManager: NodePackageManager.PNPM,
  pnpmVersion: '9',
  minNodeVersion: '20.17.0',
  cdkVersion: '2.155.0',
  defaultReleaseBranch: 'main',
  docgen: true,
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
    include: ['src/**/*.ts'],
  },
  prettier: true,
  prettierOptions: {
    settings: {
      singleQuote: true,
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
  'GraphQL.vscode-graphql',
  'sodatea.velocity',
  'bpruitt-goddard.mermaid-markdown-syntax-highlighting',
);

project.vscode?.settings.addSetting(
  'editor.defaultFormatter',
  'esbenp.prettier-vscode',
);

project.vscode?.settings.addSetting('editor.formatOnSave', true);

project.addTask('db:seed', {
  description:
    'Seeds DynamoDB Table with random data for queries in the GraphQL API in dev. Note: this requires that your current shell session is loaded with the target account via AWS CLI profile.',
  exec: 'npx ts-node src/util/seed.ts',
});

// change docgen parameters to fix warnings and render graphql in README.md
const docgen = project.tasks.tryFind('docgen');
if (docgen) {
  docgen.reset(
    'typedoc src --disableSources --exclude src/util/*.ts --entryPointStrategy expand --highlightLanguages graphql --highlightLanguages mermaid --out docs/',
  );
}

project.synth();
