import { opportunityRepository, translateFromDataObjectToOpportunity, translateOpportunityToDataObject } from '../dynamodb/opportunity';
import { AppsyncEvent, connectMiddleware } from '../lib/handler';
import { CreateOpportunityRequest, DeleteOpportunityRequest, GetOpportunitiesResponse, UpdateOpportunityRequest } from '../lib/model';

const enum FieldName {
  getOpportunities = 'getOpportunities',
  deleteOpportunity = 'deleteOpportunity',
  updateOpportunity = 'updateOpportunity',
  createOpportunity = 'createOpportunity',
}

const getOpportunities = async (): Promise<GetOpportunitiesResponse> => {

  const opportunities = await opportunityRepository()
    .scan()
    .then((items) => Promise.all(items.map((item) => translateFromDataObjectToOpportunity(item))));

  return {
    opportunities: opportunities,
  };
};

const deleteOpportunity = async (event: DeleteOpportunityRequest): Promise<void> => {
  await opportunityRepository().delete(event);
};

const updateOpportunity = async (event: UpdateOpportunityRequest): Promise<void> => {
  await opportunityRepository().update(
    { id: event.id },
    event,
  );
};

const createOpportunity = async (event: CreateOpportunityRequest): Promise<void> => {
  const dto = await translateOpportunityToDataObject(event);
  await opportunityRepository().put(dto);
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
    }
  },
);