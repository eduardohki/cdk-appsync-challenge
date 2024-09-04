import { App, RemovalPolicy } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { AppSyncStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new AppSyncStack(app, 'test', { removalPolicy: RemovalPolicy.DESTROY });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
