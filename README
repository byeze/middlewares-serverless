# Middlewares Serverless

## Project Purpose

The purpose of this project is to provide a utility for managing middleware in AWS Lambda functions. This utility allows you to easily add before, after, error, and finally hooks to your Lambda handlers, enabling you to modularize and reuse common functionality across multiple Lambda functions.

## Features

- **Middleware Management**: Easily add and manage middleware hooks for before, after, error, and finally stages of Lambda execution.
- **Error Handling**: Centralized error handling middleware to manage and format errors consistently.
- **CORS Support**: Middleware to automatically add CORS headers to responses.
- **JSON Body Transformation**: Middleware to parse JSON bodies of incoming requests.
- **Modular and Reusable**: Middleware hooks can be reused across different Lambda functions.

## Usage Instructions

### Installation

To use this middleware utility in your project, you need to install the necessary dependencies. Assuming you have a Node.js project set up, you can install the dependencies using npm or yarn:

```bash
npm install
# or
yarn install
```

### Setup

1. **Create Middleware Hooks**: Define your middleware hooks in separate files. For example, you can create an error handler, CORS middleware, and JSON body transformer as shown in the provided code.

2. **Initialize Middleware Utility**: Use the `MiddlewareUtil` class to register your middleware hooks and wrap your Lambda handler.

### Example

Here is an example of how to use the middleware utility in your Lambda function:

```ts
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import MiddlewareUtil from "./middlewares-serverless";
import corsMiddleware from "./middlewares-serverless/cors.middleware";
import errorHandler from "./middlewares-serverless/errorHandler.middleware";
import jsonBodyTransformer from "./middlewares-serverless/jsonBodyTransformer.middleware";

// Define your Lambda handler
const myLambdaHandler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // Your handler logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello, world!" }),
  };
};

// Initialize middleware utility
const middleware = new MiddlewareUtil();
middleware.useBefore(jsonBodyTransformer);
middleware.useFinally(corsMiddleware);
middleware.useOnError(errorHandler);

// Wrap your handler with middleware
export const handler = middleware.handler(myLambdaHandler);
```

### License

This project is licensed under the Apache License, Version 2.0. See the [LICENSE](./LICENSE) file for more details.
