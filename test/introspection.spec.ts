import { describe, expect, it } from "vitest";
import { addDocStringsToIntrospection } from "../src/introspection";
import type { IntrospectionSchema } from "../src/types";

describe("addDocStringsToIntrospection", () => {
  const mockSchema: IntrospectionSchema = {
    __schema: {
      types: [
        {
          name: "User",
          description: null,
          fields: [
            { name: "balance", description: null },
            { name: "type", description: null },
          ],
        },
      ],
    },
  };

  it("should add descriptions to types", () => {
    const docs = {
      User: "A user in the system",
    };

    const result = addDocStringsToIntrospection(mockSchema, docs);
    expect(result.__schema.types[0].description).toBe("A user in the system");
  });

  it("should add descriptions to fields", () => {
    const docs = {
      "User.balance": "User balance",
      "User.type": "User type",
    };

    const result = addDocStringsToIntrospection(mockSchema, docs);
    expect(result.__schema.types[0].fields?.[0].description).toBe(
      "User balance",
    );
    expect(result.__schema.types[0].fields?.[1].description).toBe("User type");
  });

  it("should handle missing types gracefully", () => {
    const docs = {
      NonExistent: "This type does not exist",
    };

    const result = addDocStringsToIntrospection(mockSchema, docs);
    expect(result).toEqual(mockSchema);
  });

  it("should throw error for invalid schema", () => {
    const invalidSchema = { __schema: { types: null } };

    expect(() => {
      // biome-ignore lint/suspicious/noExplicitAny:
      addDocStringsToIntrospection(invalidSchema as any, {});
    }).toThrow("Invalid introspection data structure");
  });
});
