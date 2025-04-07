import { HttpErrors } from "@/libs/http-errors.lib";
import type { APIGatewayProxyEvent } from "aws-lambda";

/**
 * Middleware to transform the JSON body of an incoming request.
 * Parses `event.body` into a JavaScript object if it is a JSON string.
 */
const jsonBodyTransformer = async (
  event: APIGatewayProxyEvent,
): Promise<void> => {
  const contentType =
    event.headers["content-type"] || event.headers["Content-Type"];
  const isBase64Content = event.isBase64Encoded;
  if (event.body && contentType?.toLowerCase() === "application/json") {
    try {
      const base64Content = Buffer.from(
        event.body as unknown as string,
        "base64",
      ).toString("utf8");
      event.body = JSON.parse(isBase64Content ? base64Content : event.body);
    } catch (error) {
      throw new HttpErrors.BadRequest({
        message: "Invalid JSON in request body.",
        code: "INVALID_JSON_BODY",
      });
    }
  }
};

export default jsonBodyTransformer;
