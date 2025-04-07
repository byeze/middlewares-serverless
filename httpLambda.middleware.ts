import MiddlewareUtil from ".";
import corsMiddleware from "./cors.middleware";
import errorHandler from "./errorHandler.middleware";
import jsonBodyTransformer from "./jsonBodyTransformer.middleware";

export const httpLambdaMiddleware = (handler: any) => {
  const middleware = new MiddlewareUtil();
  middleware.useBefore(jsonBodyTransformer);
  middleware.useFinally(corsMiddleware);
  middleware.useOnError(errorHandler);
  return middleware.handler(handler);
};
