import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
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
  reporter: UserRequest;
};

export type DeleteOpportunityRequest = {
  id: Scalars['ID'];
};

export type GetOpportunitiesResponse = {
  __typename?: 'GetOpportunitiesResponse';
  opportunities?: Maybe<Array<Maybe<Opportunity>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createOpportunity?: Maybe<Scalars['Boolean']>;
  deleteOpportunity?: Maybe<Scalars['Boolean']>;
  updateOpportunity?: Maybe<Scalars['Boolean']>;
};


export type MutationCreateOpportunityArgs = {
  event?: InputMaybe<CreateOpportunityRequest>;
};


export type MutationDeleteOpportunityArgs = {
  event?: InputMaybe<DeleteOpportunityRequest>;
};


export type MutationUpdateOpportunityArgs = {
  event?: InputMaybe<UpdateOpportunityRequest>;
};

export type Opportunity = {
  __typename?: 'Opportunity';
  createdDate: Scalars['Date'];
  description: Scalars['String'];
  id: Scalars['ID'];
  lastModifiedDate: Scalars['Date'];
  name: Scalars['String'];
  reporter: User;
};

export type Query = {
  __typename?: 'Query';
  getOpportunities?: Maybe<GetOpportunitiesResponse>;
};

export type UpdateOpportunityRequest = {
  description: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  reporter: UserRequest;
};

export type User = {
  __typename?: 'User';
  createdDate: Scalars['Date'];
  email: Scalars['String'];
  id: Scalars['ID'];
  lastModifiedDate: Scalars['Date'];
  name: Scalars['String'];
};

export type UserRequest = {
  id: Scalars['ID'];
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
  Date: ResolverTypeWrapper<Scalars['Date']>;
  DeleteOpportunityRequest: DeleteOpportunityRequest;
  GetOpportunitiesResponse: ResolverTypeWrapper<GetOpportunitiesResponse>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Opportunity: ResolverTypeWrapper<Opportunity>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  UpdateOpportunityRequest: UpdateOpportunityRequest;
  User: ResolverTypeWrapper<User>;
  UserRequest: UserRequest;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean'];
  CreateOpportunityRequest: CreateOpportunityRequest;
  Date: Scalars['Date'];
  DeleteOpportunityRequest: DeleteOpportunityRequest;
  GetOpportunitiesResponse: GetOpportunitiesResponse;
  ID: Scalars['ID'];
  Mutation: {};
  Opportunity: Opportunity;
  Query: {};
  String: Scalars['String'];
  UpdateOpportunityRequest: UpdateOpportunityRequest;
  User: User;
  UserRequest: UserRequest;
};

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date';
}

export type GetOpportunitiesResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['GetOpportunitiesResponse'] = ResolversParentTypes['GetOpportunitiesResponse']> = {
  opportunities?: Resolver<Maybe<Array<Maybe<ResolversTypes['Opportunity']>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createOpportunity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationCreateOpportunityArgs>>;
  deleteOpportunity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationDeleteOpportunityArgs>>;
  updateOpportunity?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, Partial<MutationUpdateOpportunityArgs>>;
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

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getOpportunities?: Resolver<Maybe<ResolversTypes['GetOpportunitiesResponse']>, ParentType, ContextType>;
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
  GetOpportunitiesResponse?: GetOpportunitiesResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Opportunity?: OpportunityResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

