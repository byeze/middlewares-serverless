import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";

/**
 * Extended Context with dynamic properties and error support.
 */
export type ExtendedContext = Context & {
  error?: unknown;
  [key: string]: unknown;
};

/**
 * Middleware hook type definition.
 * Allows modification of event, context, and optional response.
 */
export type MiddlewareHook = (
  event: APIGatewayProxyEvent,
  context: ExtendedContext,
  response?: APIGatewayProxyResult | null,
  // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
) => Promise<APIGatewayProxyResult | void>;

/**
 * Middleware utility class.
 */
class MiddlewareUtil {
  private beforeHooks: MiddlewareHook[] = [];
  private afterHooks: MiddlewareHook[] = [];
  private onErrorHooks: MiddlewareHook[] = [];
  private finallyHooks: MiddlewareHook[] = [];

  /**
   * Register a before hook.
   *
   * @param hook - The hook function to be executed before the main handler.
   */
  useBefore(hook: MiddlewareHook): void {
    this.beforeHooks.push(hook);
  }

  /**
   * Register an after hook.
   *
   * @param hook - The hook function to be executed after the main handler.
   */
  useAfter(hook: MiddlewareHook): void {
    this.afterHooks.push(hook);
  }

  /**
   * Register an onError hook.
   *
   * @param hook - The hook function to be executed if an error occurs.
   */
  useOnError(hook: MiddlewareHook): void {
    this.onErrorHooks.push(hook);
  }

  /**
   * Register a finally hook.
   *
   * @param hook - The hook function to be executed at the end, regardless of success or error.
   */
  useFinally(hook: MiddlewareHook): void {
    this.finallyHooks.push(hook);
  }

  /**
   * Executes hooks in the provided list.
   * Allows modification of event, context, and response.
   *
   * @param hooks - The list of hooks to be executed.
   * @param event - The event object.
   * @param context - The extended context object.
   * @param response - The current response, if available.
   * @returns A modified response if provided by a hook.
   */
  private async executeHooks(
    hooks: MiddlewareHook[],
    event: APIGatewayProxyEvent,
    context: ExtendedContext,
    response?: APIGatewayProxyResult | null,
  ): Promise<APIGatewayProxyResult | null> {
    for (const hook of hooks) {
      const hookResponse = await hook(event, context, response);
      if (hookResponse) {
        return hookResponse; // Short-circuit if a hook returns a response
      }
    }
    return null;
  }

  /**
   * Wraps the handler with middleware hooks.
   *
   * @param handler - The original handler function.
   * @returns A function that applies middleware before and after the handler.
   */
  handler(
    handler: (
      event: APIGatewayProxyEvent,
      context: ExtendedContext,
    ) => Promise<APIGatewayProxyResult>,
  ): (
    event: APIGatewayProxyEvent,
    context: ExtendedContext,
  ) => Promise<APIGatewayProxyResult> {
    return async (
      event: APIGatewayProxyEvent,
      context: ExtendedContext,
    ): Promise<APIGatewayProxyResult> => {
      let response: APIGatewayProxyResult | null = null;

      try {
        // Execute before hooks
        const beforeResponse = await this.executeHooks(
          this.beforeHooks,
          event,
          context,
        );
        if (beforeResponse) {
          return beforeResponse; // Short-circuit if a before hook returns a response
        }

        // Execute the main handler
        response = await handler(event, context);

        // Execute after hooks
        const afterResponse = await this.executeHooks(
          this.afterHooks,
          event,
          context,
          response,
        );
        return afterResponse || response; // Use modified response if provided
      } catch (error) {
        context.error = error; // Attach error to context for onError hooks
        // Execute onError hooks
        const errorResponse = await this.executeHooks(
          this.onErrorHooks,
          event,
          context,
        );
        if (errorResponse) {
          return errorResponse; // Use error response if provided
        }
        throw error; // Rethrow if not handled
      } finally {
        // Execute finally hooks
        await this.executeHooks(this.finallyHooks, event, context, response);
      }
    };
  }
}

export default MiddlewareUtil;
