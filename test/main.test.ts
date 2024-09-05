import { App, RemovalPolicy } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AppSyncStack } from '../src/main';

test('Snapshot', () => {
  const app = new App();
  const stack = new AppSyncStack(app, 'test', {
    removalPolicy: RemovalPolicy.DESTROY,
    logRetentionDays: RetentionDays.ONE_WEEK,
  });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});
