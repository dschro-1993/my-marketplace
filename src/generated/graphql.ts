import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
};

export type CreateOpportunityRequest = {
  description: Scalars['String'];
  name: Scalars['String'];
  reporter: Scalars['String'];
};

export type CreateUserRequest = {
  email: Scalars['String'];
  name: Scalars['String'];
};

export type DeleteOpportunityRequest = {
  id?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
};

export type DeleteUserRequest = {
  id: Scalars['ID'];
};

export type Entity = {
  createdDate: Scalars['Date'];
  id: Scalars['ID'];
  lastModifiedDate: Scalars['Date'];
};

export type GetOpportunitiesResponse = {
  __typename?: 'GetOpportunitiesResponse';
  opportunities?: Maybe<Array<Maybe<Opportunity>>>;
};

export type GetUserByEmailRequest = {
  email: Scalars['String'];
};

export type GetUserByIdRequest = {
  id: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createOpportunity?: Maybe<Scalars['Boolean']>;
  createUser?: Maybe<Scalars['Boolean']>;
  deleteOpportunity?: Maybe<Scalars['Boolean']>;
  deleteUser?: Maybe<Scalars['Boolean']>;
  updateOpportunity?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateOpportunityArgs = {
  event: CreateOpportunityRequest;
};


export type MutationCreateUserArgs = {
  event: CreateUserRequest;
};


export type MutationDeleteOpportunityArgs = {
  event: DeleteOpportunityRequest;
};


export type MutationDeleteUserArgs = {
  event: DeleteUserRequest;
};


export type MutationUpdateOpportunityArgs = {
  event: UpdateOpportunityRequest;
};


export type MutationUpdateUserArgs = {
  event: UpdateUserRequest;
};

export type Opportunity = Entity & {
  __typename?: 'Opportunity';
  createdDate: Scalars['Date'];
  description: Scalars['String'];
  id: Scalars['ID'];
  lastModifiedDate: Scalars['Date'];
  name: Scalars['String'];
  reporter: User;
};

export type OpportunityList = {
  __typename?: 'OpportunityList';
  opportunities?: Maybe<Array<Maybe<Opportunity>>>;
};

export type Query = {
  __typename?: 'Query';
  getOpportunities?: Maybe<GetOpportunitiesResponse>;
  getUserByEmail?: Maybe<User>;
  getUserById?: Maybe<User>;
};


export type QueryGetUserByEmailArgs = {
  event: GetUserByEmailRequest;
};


export type QueryGetUserByIdArgs = {
  id: GetUserByIdRequest;
};

export type UpdateOpportunityRequest = {
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  reporter: Scalars['String'];
};

export type UpdateUserRequest = {
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type User = Entity & {
  __typename?: 'User';
  createdDate: Scalars['Date'];
  email: Scalars['String'];
  id: Scalars['ID'];
  lastModifiedDate: Scalars['Date'];
  name: Scalars['String'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;


/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  CreateOpportunityRequest: CreateOpportunityRequest;
  CreateUserRequest: CreateUserRequest;
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DeleteOpportunityRequest: DeleteOpportunityRequest;
  DeleteUserRequest: DeleteUserRequest;
  Entity: ResolversTypes['Opportunity'] | ResolversTypes['User'];
  GetOpportunitiesResponse: ResolverTypeWrapper<GetOpportunitiesResponse>;
  GetUserByEmailRequest: GetUserByEmailRequest;
  GetUserByIdRequest: GetUserByIdRequest;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Opportunity: ResolverTypeWrapper<Opportunity>;
  OpportunityList: ResolverTypeWrapper<OpportunityList>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateOpportunityRequest: UpdateOpportunityRequest;
  UpdateUserRequest: UpdateUserRequest;
  User: ResolverTypeWrapper<User>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateOpportunityRequest: CreateOpportunityRequest;
  CreateUserRequest: CreateUserRequest;
  Date: Scalars['Date'];
  DeleteOpportunityRequest: DeleteOpportunityRequest;
  DeleteUserRequest: DeleteUserRequest;
  Entity: ResolversParentTypes['Opportunity'] | ResolversParentTypes['User'];
  GetOpportunitiesResponse: GetOpportunitiesResponse;
  GetUserByEmailRequest: GetUserByEmailRequest;
  GetUserByIdRequest: GetUserByIdRequest;
  ID: Scalars['ID'];
  Mutation: {};
  Opportunity: Opportunity;
  OpportunityList: OpportunityList;
  Query: {};
  String: Scalars['String'];
  UpdateOpportunityRequest: UpdateOpportunityRequest;
  UpdateUserRequest: UpdateUserRequest;
  User: User;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type EntityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Entity'] = ResolversParentTypes['Entity']> = {
  __resolveType: TypeResolveFn<'Opportunity' | 'User', ParentType, ContextType>;
  createdDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModifiedDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
};

export type GetOpportunitiesResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetOpportunitiesResponse'] = ResolversParentTypes['GetOpportunitiesResponse']> = {
  opportunities?: Resolver<Maybe<Array<Maybe<ResolversTypes['Opportunity']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createOpportunity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateOpportunityArgs, 'event'>>;
  createUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'event'>>;
  deleteOpportunity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteOpportunityArgs, 'event'>>;
  deleteUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationDeleteUserArgs, 'event'>>;
  updateOpportunity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateOpportunityArgs, 'event'>>;
  updateUser?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'event'>>;
};

export type OpportunityResolvers<ContextType = any, ParentType extends ResolversParentTypes['Opportunity'] = ResolversParentTypes['Opportunity']> = {
  createdDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModifiedDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reporter?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OpportunityListResolvers<ContextType = any, ParentType extends ResolversParentTypes['OpportunityList'] = ResolversParentTypes['OpportunityList']> = {
  opportunities?: Resolver<Maybe<Array<Maybe<ResolversTypes['Opportunity']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getOpportunities?: Resolver<Maybe<ResolversTypes['GetOpportunitiesResponse']>, ParentType, ContextType>;
  getUserByEmail?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByEmailArgs, 'event'>>;
  getUserById?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetUserByIdArgs, 'id'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastModifiedDate?: Resolver<ResolversTypes['Date'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Date?: GraphQLScalarType;
  Entity?: EntityResolvers<ContextType>;
  GetOpportunitiesResponse?: GetOpportunitiesResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Opportunity?: OpportunityResolvers<ContextType>;
  OpportunityList?: OpportunityListResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

