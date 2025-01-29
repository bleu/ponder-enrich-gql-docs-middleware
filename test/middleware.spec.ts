import { parse } from "graphql";
import { Response } from "undici";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createDocumentationMiddleware } from "../src/middleware";
import { createMockContext } from "./mocks";

vi.mock("graphql", () => ({
  parse: vi.fn(),
}));

describe("createDocumentationMiddleware", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should pass through non-introspection queries", async () => {
    const middleware = createDocumentationMiddleware({});
    const context = createMockContext({ query: "query { user { id } }" }, null);
    const next = vi.fn();
    // biome-ignore lint/suspicious/noExplicitAny:
    (parse as any).mockReturnValue({
      definitions: [
        {
          kind: "OperationDefinition",
          selectionSet: {
            selections: [{ kind: "Field", name: { value: "user" } }],
          },
        },
      ],
    });
    // @ts-expect-error
    await middleware(context, next);
    expect(next).toHaveBeenCalled();
  });

  it("should process introspection queries", async () => {
    const docs = { User: "A user in the system" };
    const schema = {
      data: {
        __schema: {
          types: [{ name: "User", description: null }],
        },
      },
    };

    const middleware = createDocumentationMiddleware(docs);
    const context = createMockContext(
      "query { __schema { types { name } } }",
      schema,
    );
    const next = vi.fn();
    // biome-ignore lint/suspicious/noExplicitAny:
    (parse as any).mockReturnValue({
      definitions: [
        {
          kind: "OperationDefinition",
          selectionSet: {
            selections: [{ kind: "Field", name: { value: "__schema" } }],
          },
        },
      ],
    });
    // biome-ignore lint/suspicious/noExplicitAny:
    await middleware(context as any, next);

    expect(next).toHaveBeenCalled();
  });

  it("should handle invalid JSON", async () => {
    const middleware = createDocumentationMiddleware({});
    const context = {
      req: {
        raw: {
          clone: () => ({
            text: () => Promise.resolve("invalid json"),
          }),
        },
      },
    };
    const next = vi.fn();

    // biome-ignore lint/suspicious/noExplicitAny:
    await middleware(context as any, next);
    expect(next).toHaveBeenCalled();
  });
});
