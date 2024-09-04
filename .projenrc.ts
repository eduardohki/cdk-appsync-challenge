import { DeployableAwsCdkTypeScriptApp } from 'deployable-awscdk-app-ts';
import { javascript } from 'projen';
const project = new DeployableAwsCdkTypeScriptApp({
  cdkVersion: '2.155.0',
  defaultReleaseBranch: 'main',
  devDeps: ['deployable-awscdk-app-ts'],
  name: 'cdk-appsync-challenge',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();