import { Response } from "undici";
import { describe, expect, it } from "vitest";
import { createDocumentationMiddleware } from "../src/middleware";
import { createMockContext } from "./mocks";

describe("Integration", () => {
  const mockIntrospectionQuery = `
    query IntrospectionQuery {
      __schema {
        types {
          name
          description
          fields {
            name
            description
          }
        }
      }
    }
  `;

  const mockSchema = {
    data: {
      __schema: {
        types: [
          {
            name: "User",
            description: null,
            fields: [
              {
                name: "balance",
                description: null,
              },
            ],
          },
        ],
      },
    },
  };

  it("should enhance schema documentation end-to-end", async () => {
    const docs = {
      User: "A user in the system",
      "User.balance": "User balance",
    };

    const middleware = createDocumentationMiddleware(docs);
    const mockContext = createMockContext(
      { query: mockIntrospectionQuery },
      mockSchema,
    );

    await middleware(mockContext, async () => {
      // After next() is called, we need to ensure the context has
      // the response with the schema before enhancement
      mockContext.res = new Response(JSON.stringify(mockSchema), {
        headers: { "Content-Type": "application/json" },
      });
    });

    // biome-ignore lint/suspicious/noExplicitAny:
    const result = (await mockContext.res.json()) as any;

    expect(result.data.__schema.types[0].description).toBe(
      "A user in the system",
    );
    expect(result.data.__schema.types[0].fields[0].description).toBe(
      "User balance",
    );
  });
});
