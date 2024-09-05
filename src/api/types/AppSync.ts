export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  AWSDate: { input: string; output: string };
  AWSDateTime: { input: string; output: string };
  AWSEmail: { input: string; output: string };
  AWSIPAddress: { input: string; output: string };
  AWSJSON: { input: string; output: string };
  AWSPhone: { input: string; output: string };
  AWSTime: { input: string; output: string };
  AWSTimestamp: { input: number; output: number };
  AWSURL: { input: string; output: string };
  BigInt: { input: bigint; output: bigint };
  Double: { input: number; output: number };
};

export type Customer = {
  __typename?: 'Customer';
  email: Scalars['String']['output'];
  fullName: Scalars['String']['output'];
  orders?: Maybe<Array<Maybe<Order>>>;
};

export type Order = {
  __typename?: 'Order';
  customer?: Maybe<Customer>;
  customerEmail: Scalars['String']['output'];
  date: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  products?: Maybe<Array<Maybe<OrderProduct>>>;
  totalAmount: Scalars['Float']['output'];
};

export type OrderProduct = {
  __typename?: 'OrderProduct';
  id: Scalars['ID']['output'];
  order?: Maybe<Order>;
  orderId: Scalars['ID']['output'];
  product?: Maybe<Product>;
  productId: Scalars['ID']['output'];
  quantity: Scalars['Int']['output'];
};

export type Product = {
  __typename?: 'Product';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  orders?: Maybe<Array<Maybe<OrderProduct>>>;
  price: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  orders: Array<Order>;
};
