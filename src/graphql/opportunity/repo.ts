import { OPPORTUNITIES_TABLE_NAME } from '../../constructs/dynamo';
import { CrudRepository } from '../lib/dynamodb';
import { DataObjectEntity } from '../lib/entity';
import { Opportunity } from '../lib/model';
import { translateFromDataObjectToUser, userRepository } from '../user/repo';

export interface OpportunityDataObject extends DataObjectEntity {
  n: string; // name
  d: string; // description
  r: string; // reporter id
}

export const translateOpportunityToDataObject = async (opportunity: Opportunity): Promise<OpportunityDataObject> => {
  return {
    id: opportunity.id,
    n: opportunity.name,
    d: opportunity.description,
    r: opportunity.reporter.id,
    createdAt: opportunity.createdDate.toISOString(),
    updatedAt: opportunity.lastModifiedDate.toISOString(),
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
    createdDate: new Date(opportunityDataObject.createdAt),
    lastModifiedDate: new Date(opportunityDataObject.updatedAt),
  };
};

export const opportunityRepository = () => new CrudRepository<OpportunityDataObject>(OPPORTUNITIES_TABLE_NAME);