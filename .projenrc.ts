import { DeployableAwsCdkTypeScriptApp } from 'deployable-awscdk-app-ts';
import { javascript } from 'projen';
const project = new DeployableAwsCdkTypeScriptApp({
  name: 'cdk-appsync-challenge',
  description: 'CDK AppSync API Challenge',
  packageManager: javascript.NodePackageManager.PNPM,
  defaultReleaseBranch: 'main',
  cdkVersion: '2.155.0',
  deps: [],
  devDeps: ['deployable-awscdk-app-ts'],
  projenrcTs: true,
});

project.synth();
