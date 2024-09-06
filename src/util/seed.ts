/**
 * Script used for seeding data into the DynamoDB Table used in the AppSync API.
 */

/* eslint-disable import/no-extraneous-dependencies */
import {
  CloudFormationClient,
  DescribeStacksCommand,
} from '@aws-sdk/client-cloudformation';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import { faker } from '@faker-js/faker';

// Initialize AWS Clients
const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const cfClient = new CloudFormationClient();

// CloudFormation stack params, as defined by CDK
const STACK_NAME = 'AppSyncChallengeDev';
const CFN_OUTPUT_NAME = 'DynamoDBTableName';

// Function to fetch table name from CloudFormation stack outputs
const getTableNameFromStack = async (
  stackName: string,
  outputName: string,
): Promise<string | undefined> => {
  try {
    const command = new DescribeStacksCommand({ StackName: stackName });
    const response = await cfClient.send(command);
    const stack = response.Stacks?.[0];
    const tableNameOutput = stack?.Outputs?.find(
      (output) => output.OutputKey === outputName,
    );
    return tableNameOutput?.OutputValue;
  } catch (error) {
    console.error('Error fetching stack outputs', error);
    return undefined;
  }
};

// Generate Fake Data for Customers
const generateFakeCustomer = () => {
  const email = faker.internet.email();
  const pk = `CUSTOMER#${email}`;
  return {
    PK: pk, // Use email as unique identifier (PK)
    SK: pk, // SK is the same as PK
    email: email,
    fullName: faker.person.fullName(),
  };
};

// Generate Fake Data for Products
const generateFakeProduct = () => {
  const productId = faker.string.uuid();
  const pk = `PRODUCT#${productId}`;
  return {
    PK: pk, // Product ID as PK
    SK: pk, // SK is the same as PK
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price()), // Convert price to float
  };
};

// Generate Fake Data for Orders
const generateFakeOrder = (customerEmail: string, productIds: string[]) => {
  const orderId = faker.string.uuid();
  const orderDate = faker.date.recent().toISOString();
  const orderProducts = productIds.map((productId) => ({
    PK: `ORDER#${orderId}`,
    SK: `PRODUCT#${productId}`,
    orderId,
    productId,
    quantity: faker.number.int({ min: 1, max: 5 }),
  }));

  return {
    order: {
      PK: `CUSTOMER#${customerEmail}`,
      SK: `ORDER#${orderId}`,
      id: orderId,
      date: orderDate,
      customerEmail: customerEmail,
      totalAmount: orderProducts.reduce((sum, product) => {
        const amount = product.quantity * parseFloat(faker.commerce.price());
        return parseFloat((sum + amount).toFixed(2));
      }, 0),
    },
    orderProducts,
  };
};

// Seed Data into DynamoDB Table
const seedData = async () => {
  // Fetch table name from CloudFormation stack
  const tableName = await getTableNameFromStack(STACK_NAME, CFN_OUTPUT_NAME);
  if (!tableName) {
    console.error('Table name not found in CloudFormation stack outputs.');
    return;
  }

  // Generate 5 fake customers
  const customers = Array.from({ length: 5 }, generateFakeCustomer);

  // Generate 10 fake products
  const products = Array.from({ length: 10 }, generateFakeProduct);

  // Prepare batch write for customers
  const customerRequests = customers.map((customer) => ({
    PutRequest: {
      Item: customer,
    },
  }));

  // Prepare batch write for products
  const productRequests = products.map((product) => ({
    PutRequest: {
      Item: product,
    },
  }));

  // Write Customers and Products to DynamoDB in batches
  try {
    await ddbDocClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: customerRequests,
        },
      }),
    );
    console.log('Customers seeded successfully!');

    await ddbDocClient.send(
      new BatchWriteCommand({
        RequestItems: {
          [tableName]: productRequests,
        },
      }),
    );
    console.log('Products seeded successfully!');
  } catch (error) {
    console.error('Error seeding data to DynamoDB', error);
  }

  // Generate 5 fake orders
  for (const customer of customers) {
    const productIds = products.map((p) => p.PK.split('#')[1]);
    const { order, orderProducts } = generateFakeOrder(
      customer.email,
      productIds,
    );

    const orderRequest = {
      PutRequest: {
        Item: order,
      },
    };

    const orderProductRequests = orderProducts.map((orderProduct) => ({
      PutRequest: {
        Item: orderProduct,
      },
    }));

    try {
      await ddbDocClient.send(
        new BatchWriteCommand({
          RequestItems: {
            [tableName]: [orderRequest, ...orderProductRequests],
          },
        }),
      );
      console.log(`Order ${order.id} seeded successfully!`);
    } catch (error) {
      console.error(`Error seeding order ${order.id} to DynamoDB`, error);
    }
  }
};

// Run the seeding function
seedData().catch((error) => console.error('Seeding error:', error));
