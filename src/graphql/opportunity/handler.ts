import { AppsyncEvent, connectMiddleware } from '../lib/handler';
import { CreateOpportunityRequest, CreateOpportunityResponse, DeleteOpportunityRequest, GetOpportunitiesResponse, UpdateOpportunityRequest, UpdateOpportunityResponse } from '../lib/model';

const enum FieldName {
  getOpportunities = 'getOpportunities',
  deleteOpportunity = 'deleteOpportunity',
  updateOpportunity = 'updateOpportunity',
  createOpportunity = 'createOpportunity',
}

const getOpportunities = async (): Promise<GetOpportunitiesResponse> => {
  return { opportunities: [] };
};

const deleteOpportunity = async (event: DeleteOpportunityRequest) => {
};

const updateOpportunity = async (event: UpdateOpportunityRequest): Promise<UpdateOpportunityResponse> => {
  return event as UpdateOpportunityResponse;
};

const createOpportunity = async (event: CreateOpportunityRequest): Promise<CreateOpportunityResponse> => {
  return event as CreateOpportunityResponse;
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