# CDK AppSync Challenge

This repository contains the codebase for deploying an AWS AppSync GraphQL API via CDK.

___Note___: This repository is managed via `Projen`. See <https://projen.io/docs/introduction/getting-started/> to learn more about it.

## Getting Started

### System Requirements

* [Node.js](https://nodejs.org/en/download/) (_latest LTS version_)
* [pnpm](https://pnpm.io/installation)
* [Visual Studio Code](https://code.visualstudio.com/download)
* [The AWS Command Line Interface (AWS CLI)](https://docs.aws.amazon.com/cli/latest/)
* [Granted](https://docs.commonfate.io/granted/introduction) [optional] (_useful for managing AWS CLI Profiles in your Terminal_)

### Setup

After cloning the git repo locally, run `pnpm run projen` to get started.

## Useful Commands

* `pmpm run test`: Run Tests and Linting
* `pnpm run projen`: Rebuild project configuration files
* `pmpm run build`: Build application, generate docs and run tests
* `pnpm run deploy`: Deploys the CDK Stack to your active AWS CLI Profile
* `pnpm run diff`: Compares the local CDK Stack state with a previously deployed one
* `pnpm run db:seed`: Seeds DynamoDB Table with random data for queries in the GraphQL API

## GraphQL API

[Schema](./src/api/schema.graphql)

### Example Query

```graphql
query {
  orders {
    id
    date
    totalAmount
    customer {
      email
      fullName
    }
    products {
      quantity
      product {
        name
        price
      }
    }
  }
}
```
