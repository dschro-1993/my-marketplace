import { nanoid } from 'nanoid';
import { CreateOpportunityRequest, Opportunity, UpdateOpportunityRequest } from '../../generated/graphql';
import { CrudRepository } from '../lib/dynamodb';
import { Entity } from '../lib/entity';
import { translateFromDataObjectToUser, userRepository } from '../user/repo';

export interface OpportunityDataObject extends Entity {
  n: string; // name
  d: string; // description
  r: string; // reporter id
}

export const translateCreateOpportunityRequestToDataObject = (opportunity: CreateOpportunityRequest) => {
  const timestamp = new Date().toISOString();

  return {
    id: nanoid(),
    n: opportunity.name,
    d: opportunity.description,
    r: opportunity.reporter, // reporter id
    ca: timestamp,
    ua: timestamp,
  };
};

export const translateUpdateOpportunityRequestToDataObject = (opportunity: UpdateOpportunityRequest) => {
  const timestamp = new Date().toISOString();

  return {
    id: opportunity.id,
    n: opportunity.name,
    d: opportunity.description,
    r: opportunity.reporter, // reporter id
    ua: timestamp,
  };
};

export const translateFromDataObjectToOpportunity = async (opportunityDataObject: OpportunityDataObject): Promise<Opportunity> => {

  const reporter = await userRepository().get({ id: opportunityDataObject.r });
  if (!reporter) throw new Error(`Reporter with id ${opportunityDataObject.r} not found`);

  return {
    id: opportunityDataObject.id,
    name: opportunityDataObject.n,
    description: opportunityDataObject.d,
    reporter: translateFromDataObjectToUser(reporter!),
    createdDate: new Date(opportunityDataObject.ca),
    lastModifiedDate: new Date(opportunityDataObject.ua),
  };
};

export const translateFromDataObjectsToOpportunities = async (opportunityDataObjects: OpportunityDataObject[]): Promise<Opportunity[]> => {

  const opportunities: Opportunity[] = [];
  for (const opportunityDataObject of opportunityDataObjects) {
    opportunities.push(await translateFromDataObjectToOpportunity(opportunityDataObject));
  }

  return opportunities;
};

export const opportunityRepository = () => new CrudRepository<OpportunityDataObject>('foo');