export interface User {
  id: string;
  name: string;
  email: string;
  createdDate: Date;
  lastModifiedDate: Date;
}

export interface Opportunity {
  id: string;
  name: string;
  description: string;
  reporter: User;
  createdDate: Date;
  lastModifiedDate: Date;
}

export interface CreateOpportunityRequest extends Opportunity { }
export interface UpdateOpportunityRequest extends Opportunity {
  id: string;
}

export interface DeleteOpportunityRequest {
  id: string;
}

export interface GetOpportunitiesResponse {
  opportunities: Opportunity[];
}