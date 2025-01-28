import { parse } from "graphql";
import { addDocStringsToIntrospection } from "./introspection";
import type {
  DocStrings,
  GraphQLRequestBody,
  IntrospectionResponse,
} from "./types";

/**
 * Options for configuring the documentation middleware.
 */
export interface MiddlewareOptions {
  /** Enable debug logging */
  debug?: boolean;
  /** GraphQL endpoint path */
  path?: string;
}

/**
 * Context object passed to the middleware function.
 */
export interface MiddlewareContext {
  req: {
    raw: Request;
  };
  res: Response;
}

/**
 * Creates a middleware function that enhances GraphQL introspection queries with documentation.
 *
 * This middleware intercepts GraphQL introspection queries and adds documentation strings
 * to the schema before returning it to the client. It's particularly useful for adding
 * detailed documentation to your GraphQL API that will show up in tools like GraphiQL.
 *
 * @param docs - Documentation strings to add to the schema
 * @param options - Configuration options for the middleware
 * @returns A middleware function to use in your GraphQL server
 *
 * @example
 * ```typescript
 * import { createDocumentationMiddleware } from '@your-lib/graphql-docs';
 * import { ponder } from 'ponder:registry';
 *
 * const docs = {
 *   User: "Represents a user in the system",
 *   "User.balance": "The user's balance"
 * };
 *
 * const middleware = createDocumentationMiddleware(docs, { debug: true });
 * ponder.use('/graphql', middleware);
 * ```
 */
export function createDocumentationMiddleware(
  docs: DocStrings,
  options: MiddlewareOptions = {},
) {
  const { debug = false } = options;

  const log = debug
    ? (...args: unknown[]) => console.log("[GraphQL Docs]:", ...args)
    : () => {};

  /**
   * The actual middleware function that processes GraphQL requests.
   *
   * @param context - The middleware context containing request and response
   * @param next - Function to call the next middleware
   */
  return async function documentationMiddleware(
    context: MiddlewareContext,
    next: () => Promise<void>,
  ) {
    const body = await context.req.raw.clone().text();
    let parsed: GraphQLRequestBody;

    try {
      parsed = JSON.parse(body);
    } catch (err) {
      log("Failed to parse request body:", err);
      return next();
    }

    if (!parsed?.query) {
      log("No query found in request");
      return next();
    }

    try {
      const document = parse(parsed.query);
      const isIntrospection = document.definitions.some((def) => {
        if (def.kind === "OperationDefinition") {
          return def.selectionSet.selections.some(
            (sel) => sel.kind === "Field" && sel.name.value.startsWith("__"),
          );
        }
        return false;
      });

      if (!isIntrospection) {
        log("Not an introspection query");
        return next();
      }

      await next();

      const response = await context.res.clone().text();
      const json = JSON.parse(response) as IntrospectionResponse;

      if (json?.data?.__schema) {
        log("Enhancing schema with documentation");
        json.data = addDocStringsToIntrospection(json.data, docs);

        context.res = new Response(JSON.stringify(json), {
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (err) {
      log("Error processing GraphQL request:", err);
      throw err;
    }
  };
}
