import middy from '@middy/core';
import { Opportunity } from '../model';
import { logger, tracer, metrics } from './common/powertools';
import { logMetrics } from '@aws-lambda-powertools/metrics';
import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import { Context } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME;

const enum FieldName {
  getOpportunities = 'getOpportunities',
  deleteOpportunity = 'deleteOpportunity',
  updateOpportunity = 'updateOpportunity',
  createOpportunity = 'createOpportunity',
}

interface Event {
  info: {
    fieldName: FieldName;
  };

  arguments: {
    id?: string;
    opportunity?: Opportunity;
  };
}

const getOpportunities = async (): Promise<Opportunity[]> => {
  return [];
};

const deleteOpportunity = async () => {
};

const updateOpportunity = async (id?: string, opportunity?: Opportunity): Promise<Opportunity> => {

  if (!id) throw new Error('id is required');
  if (!opportunity) throw new Error('opportunity is required');

  return opportunity;
};

const createOpportunity = async (opportunity?: Opportunity): Promise<Opportunity> => {

  if (!opportunity) throw new Error('opportunity is required');

  return opportunity;
};

const rawHandler = async (event: Event) => {
  switch (event.info.fieldName) {
    case 'getOpportunities':
      return getOpportunities();
    case 'deleteOpportunity':
      return deleteOpportunity();
    case 'updateOpportunity':
      return updateOpportunity(event.arguments.id, event.arguments.opportunity);
    case 'createOpportunity':
      return createOpportunity(event.arguments.opportunity);
  }
};

export const handler = middy(rawHandler)
  // Use the middleware by passing the Metrics instance as a parameter
  .use(logMetrics(metrics))
  // Use the middleware by passing the Logger instance as a parameter
  .use(injectLambdaContext(logger, { logEvent: true }))
  // Use the middleware by passing the Tracer instance as a parameter
  .use(captureLambdaHandler(tracer, { captureResponse: false }));