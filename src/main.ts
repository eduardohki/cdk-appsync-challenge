import * as path from 'node:path';
import { App, CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import {
  AuthorizationType,
  Definition,
  FieldLogLevel,
  GraphqlApi,
  MappingTemplate,
} from 'aws-cdk-lib/aws-appsync';
import { AttributeType, Billing, TableV2 } from 'aws-cdk-lib/aws-dynamodb';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

/**
 * Stack properties for configuring deployment environment specific settings.
 */
export interface AppSyncStackProps extends StackProps {
  /** Defines the retention for all logs generated by resources in the Stack */
  logRetentionDays: RetentionDays;
  /** Defines the removal policy applied to stateful resources in the Stack.
   *
   * Useful for preventing orphaned stateful resources upon Stack deletion in non-prod environments.
   */
  removalPolicy: RemovalPolicy;
}

/**
 * CDK Stack for setting an AppSync API backed by a DynamoDB Table,
 * using the single table pattern.
 */
export class AppSyncStack extends Stack {
  constructor(scope: Construct, id: string, props: AppSyncStackProps) {
    super(scope, id, props);

    const table = new TableV2(this, 'Orders', {
      billing: Billing.onDemand(),
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      removalPolicy: props.removalPolicy,
      // prevent accidental table deletion when the data is to be retained
      deletionProtection:
        props.removalPolicy === RemovalPolicy.DESTROY ? false : true,
    });

    new CfnOutput(this, 'DynamoDBTableName', {
      description:
        'The name of the DynamoDB Table used as the the GraphQL API data source.',
      value: table.tableName,
    });

    const api = new GraphqlApi(this, 'Api', {
      name: 'Orders',
      definition: Definition.fromFile(
        path.join(__dirname, 'api/schema.graphql'),
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
        },
      },
      logConfig: {
        retention: props.logRetentionDays,
        fieldLogLevel: FieldLogLevel.ALL,
      },
      xrayEnabled: true,
    });

    new CfnOutput(this, 'GraphQlUrl', {
      description: 'The GraphQL URL of the AppSync API.',
      value: api.graphqlUrl,
    });

    const dataSource = api.addDynamoDbDataSource('Table', table);

    dataSource.createResolver('OrderTypeCustomerField', {
      typeName: 'Order',
      fieldName: 'customer',
      requestMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/Order.customer.req.vtl',
        ),
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/Order.customer.res.vtl',
        ),
      ),
    });

    dataSource.createResolver('OrderTypeProductsField', {
      typeName: 'Order',
      fieldName: 'products',
      requestMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/Order.products.req.vtl',
        ),
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/Order.products.res.vtl',
        ),
      ),
    });

    dataSource.createResolver('OrderProductTypeProductField', {
      typeName: 'OrderProduct',
      fieldName: 'product',
      requestMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/OrderProduct.product.req.vtl',
        ),
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/OrderProduct.product.res.vtl',
        ),
      ),
    });

    dataSource.createResolver('OrderProductTypeOrderField', {
      typeName: 'OrderProduct',
      fieldName: 'order',
      requestMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/OrderProduct.order.req.vtl',
        ),
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/OrderProduct.order.res.vtl',
        ),
      ),
    });

    dataSource.createResolver('OrdersQuery', {
      typeName: 'Query',
      fieldName: 'orders',
      requestMappingTemplate: MappingTemplate.fromFile(
        path.resolve(__dirname, 'api/resolver-templates/Query.orders.req.vtl'),
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.resolve(__dirname, 'api/resolver-templates/Query.orders.res.vtl'),
      ),
    });

    dataSource.createResolver('CustomerTypeOrdersField', {
      typeName: 'Customer',
      fieldName: 'orders',
      requestMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/Customer.orders.req.vtl',
        ),
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/Customer.orders.res.vtl',
        ),
      ),
    });

    dataSource.createResolver('ProductTypeOrdersField', {
      typeName: 'Product',
      fieldName: 'orders',
      requestMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/Product.orders.req.vtl',
        ),
      ),
      responseMappingTemplate: MappingTemplate.fromFile(
        path.resolve(
          __dirname,
          'api/resolver-templates/Product.orders.res.vtl',
        ),
      ),
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new AppSyncStack(app, 'AppSyncChallengeDev', {
  env: devEnv,
  removalPolicy: RemovalPolicy.DESTROY,
  logRetentionDays: RetentionDays.ONE_WEEK,
});

app.synth();
