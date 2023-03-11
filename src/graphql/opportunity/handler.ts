import { opportunityRepository, translateCreateOpportunityRequestToDataObject, translateFromDataObjectToOpportunity } from './repo';
import { CreateOpportunityRequest, DeleteOpportunityRequest, OpportunityList, UpdateOpportunityRequest } from '../../generated/graphql';
import { AppsyncEvent, connectMiddleware } from '../lib/handler';

const enum FieldName {
  getOpportunities = 'getOpportunities',
  deleteOpportunity = 'deleteOpportunity',
  updateOpportunity = 'updateOpportunity',
  createOpportunity = 'createOpportunity',
}

const getOpportunities = async (): Promise<OpportunityList> => {
  const opportunities = await opportunityRepository()
    .scan()
    .then((items) => Promise.all(items.map((item) => translateFromDataObjectToOpportunity(item))));

  return {
    opportunities: opportunities,
  };
};

const deleteOpportunity = async (event: DeleteOpportunityRequest): Promise<boolean> => {

  await opportunityRepository().delete(event);

  return true;
};

const updateOpportunity = async (event: UpdateOpportunityRequest): Promise<boolean> => {
  await opportunityRepository().update(
    { id: event.id },
    event,
  );

  return true;
};

const createOpportunity = async (event: CreateOpportunityRequest): Promise<boolean> => {
  const dto = await translateCreateOpportunityRequestToDataObject(event);
  await opportunityRepository().put(dto);

  return true;
};

export const handler = connectMiddleware(
  async (event: AppsyncEvent<FieldName>) => {
    switch (event.info.fieldName) {
      case 'getOpportunities':
        return getOpportunities();
      case 'deleteOpportunity':
        return deleteOpportunity(event.arguments);
      case 'updateOpportunity':
        return updateOpportunity(event.arguments);
      case 'createOpportunity':
        return createOpportunity(event.arguments);
      default:
        return null;
    }
  },
);