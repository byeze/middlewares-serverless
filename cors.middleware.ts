import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

/**
 * CORS middleware to add headers for open CORS.
 */
const corsMiddleware = async (
  event: APIGatewayProxyEvent,
  context: Context,
  response?: APIGatewayProxyResult | null,
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
): Promise<APIGatewayProxyResult | void> => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (response) {
    response.headers = { ...response.headers, ...headers };
    return response;
  }

  // Pre-flight request handling
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }
};

export default corsMiddleware;
