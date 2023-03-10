import { CrudRepository } from '../lib/dynamodb';
import { DataObjectEntity } from '../lib/entity';
import { Opportunity } from '../lib/model';

export interface OpportunityDataObject extends DataObjectEntity {
  n: string; // name
  d: string; // description
  r: string; // reporter id
}

export const translateToDataObject = (opportunity: Opportunity): OpportunityDataObject => {
  return {
    id: opportunity.id,
    n: opportunity.name,
    d: opportunity.description,
    r: opportunity.reporter.id,
    createdAt: opportunity.createdDate.toISOString(),
    updatedAt: opportunity.lastModifiedDate.toISOString(),
  };
};

export const translateFromDataObject = (opportunityDataObject: OpportunityDataObject): Opportunity => {
  return {
    id: opportunityDataObject.id,
    name: opportunityDataObject.n,
    description: opportunityDataObject.d,
    reporter: opportunityDataObject.r, // TODO: shall we resolve the user here?
    createdDate: new Date(opportunityDataObject.createdAt),
    lastModifiedDate: new Date(opportunityDataObject.updatedAt),
  };
};

export const repository = (tableName: string) => new CrudRepository<OpportunityDataObject>(tableName);