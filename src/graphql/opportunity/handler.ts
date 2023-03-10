import { repository, translateFromDataObject, translateToDataObject } from '../dynamodb/opportunity';
import { AppsyncEvent, connectMiddleware } from '../lib/handler';
import { CreateOpportunityRequest, DeleteOpportunityRequest, GetOpportunitiesResponse, UpdateOpportunityRequest } from '../lib/model';

const tableName = process.env.TABLE_NAME!;

const enum FieldName {
  getOpportunities = 'getOpportunities',
  deleteOpportunity = 'deleteOpportunity',
  updateOpportunity = 'updateOpportunity',
  createOpportunity = 'createOpportunity',
}

const getOpportunities = async (): Promise<GetOpportunitiesResponse> => {
  const repo = repository(tableName);
  const opportunities = await repo.scan().then((items) => items.map((item) => translateFromDataObject(item)));
  return {
    opportunities: opportunities,
  };
};

const deleteOpportunity = async (event: DeleteOpportunityRequest): Promise<void> => {
  const repo = repository(tableName);
  await repo.delete(event);
};

const updateOpportunity = async (event: UpdateOpportunityRequest): Promise<void> => {
  const repo = repository(tableName);
  await repo.update({ id: event.id }, event);
};

const createOpportunity = async (event: CreateOpportunityRequest): Promise<void> => {
  const repo = repository(tableName);
  await repo.put(translateToDataObject(event));
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