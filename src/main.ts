import { App, CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

interface AppSyncStackProps extends StackProps {
  /** Defines the removal policy applied to stateful resources in the Stack.
   *
   * Useful for preventing orphaned stateful resources upon Stack deletion in non-prod environments.
   */
  removalPolicy: RemovalPolicy;
}

export class AppSyncStack extends Stack {
  constructor(scope: Construct, id: string, props: AppSyncStackProps) {
    super(scope, id, props);

    const table = new TableV2(this, 'Orders', {
      billing: Billing.onDemand(),
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      removalPolicy: props.removalPolicy,
      // prevent accidental table deletion when the data is to be retained
      deletionProtection: props.removalPolicy === RemovalPolicy.DESTROY ? false : true,
    });

    new CfnOutput(this, 'DynamoDBTableName', {
      description: 'The name of the DynamoDB Table used as the the GraphQL API data source.',
      value: table.tableName,
    });

  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new AppSyncStack(app, 'AppSyncChallengeDev', { env: devEnv, removalPolicy: RemovalPolicy.DESTROY });

app.synth();
