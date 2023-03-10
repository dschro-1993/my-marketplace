import { injectLambdaContext } from '@aws-lambda-powertools/logger';
import { logMetrics } from '@aws-lambda-powertools/metrics';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer';
import middy from '@middy/core';
import { logger, metrics, tracer } from './powertools';

export interface AppsyncEvent<T> {
  info: {
    fieldName: T;
  };

  arguments: any;
}

export const connectMiddleware =(handler?: any) => middy(handler)
  // Use the middleware by passing the Metrics instance as a parameter
  .use(logMetrics(metrics))
  .use(injectLambdaContext(logger, { logEvent: true }))
  .use(captureLambdaHandler(tracer, { captureResponse: false }));


