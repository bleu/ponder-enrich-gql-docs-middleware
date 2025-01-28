import { describe, it, expect } from "vitest";
import {
  baseDefinitions,
  generateFilterDocs,
  generatePageDocs,
  extendWithBaseDefinitions,
  generateTypeDocSet,
  generateQueryDocs,
} from "../src/base-definitions";

describe("Base Definitions", () => {
  describe("baseDefinitions", () => {
    it("should contain all required scalar types", () => {
      expect(baseDefinitions.scalars).toHaveProperty("JSON");
      expect(baseDefinitions.scalars).toHaveProperty("BigInt");
      expect(baseDefinitions.scalars).toHaveProperty("Boolean");
      expect(baseDefinitions.scalars).toHaveProperty("String");
      expect(baseDefinitions.scalars).toHaveProperty("Int");
    });

    it("should contain pagination definitions", () => {
      expect(baseDefinitions.pagination).toHaveProperty("PageInfo");
      expect(baseDefinitions.pagination).toHaveProperty("PageInfo.hasNextPage");
      expect(baseDefinitions.pagination).toHaveProperty(
        "PageInfo.hasPreviousPage",
      );
      expect(baseDefinitions.pagination).toHaveProperty("PageInfo.startCursor");
      expect(baseDefinitions.pagination).toHaveProperty("PageInfo.endCursor");
    });

    it("should contain query argument definitions", () => {
      expect(baseDefinitions.queryArgs).toHaveProperty("where");
      expect(baseDefinitions.queryArgs).toHaveProperty("orderBy");
      expect(baseDefinitions.queryArgs).toHaveProperty("orderDirection");
      expect(baseDefinitions.queryArgs).toHaveProperty("before");
      expect(baseDefinitions.queryArgs).toHaveProperty("after");
      expect(baseDefinitions.queryArgs).toHaveProperty("limit");
    });

    it("should contain filter operator definitions", () => {
      expect(baseDefinitions.filterOperators).toHaveProperty("AND");
      expect(baseDefinitions.filterOperators).toHaveProperty("OR");
      expect(baseDefinitions.filterOperators).toHaveProperty("equals");
      expect(baseDefinitions.filterOperators).toHaveProperty("not");
      expect(baseDefinitions.filterOperators).toHaveProperty("contains");
      expect(baseDefinitions.filterOperators).toHaveProperty("starts_with");
    });
  });

  describe("generateFilterDocs", () => {
    it("should generate filter docs for a field", () => {
      const result = generateFilterDocs("address", "Filter by address");

      expect(result).toHaveProperty(
        "address",
        "Filter by address (exact match)",
      );
      expect(result).toHaveProperty(
        "address_not",
        "Filter by address (exclude match)",
      );
      expect(result).toHaveProperty(
        "address_in",
        "Filter by address (match any in list)",
      );
      expect(result).toHaveProperty(
        "address_contains",
        "Filter by address (contains substring)",
      );
    });

    it("should handle empty description", () => {
      const result = generateFilterDocs("address");
      expect(result.address).toBe(" (exact match)");
    });
  });

  describe("generatePageDocs", () => {
    it("should generate pagination docs for a type", () => {
      const result = generatePageDocs("User", "user");

      expect(result).toHaveProperty(
        "UserPage",
        "Paginated list of user records",
      );
      expect(result).toHaveProperty("UserPage.items", "List of user records");
      expect(result).toHaveProperty(
        "UserPage.pageInfo",
        baseDefinitions.pagination.PageInfo,
      );
      expect(result).toHaveProperty(
        "UserPage.totalCount",
        baseDefinitions.pagination.totalCount,
      );
    });

    it("should handle missing description", () => {
      const result = generatePageDocs("User");
      expect(result.UserPage).toBe("Paginated list of User records");
    });
  });

  describe("generateQueryDocs", () => {
    it("should generate query documentation for a type", () => {
      const result = generateQueryDocs("User", "user");

      expect(result.User).toBe("Get a single user by address");
      expect(result.Users).toBe(
        "Get a list of users with optional filtering and pagination",
      );
      expect(result["Users.where"]).toBe("Filter conditions for users");
      expect(result["Users.orderBy"]).toBe("Field to order users by");
    });

    it("should handle missing description", () => {
      const result = generateQueryDocs("User");
      expect(result.User).toBe("Get a single User record by address");
    });
  });

  describe("generateTypeDocSet", () => {
    it("should generate complete documentation for a type", () => {
      const result = generateTypeDocSet("User", "system user", {
        "User.balance": "User balance",
        "User.type": "User type",
      });

      // Now TypeScript knows result is DocMap
      expect(result.User).toBe("Get a single system user by address");
      expect(result.Users).toBe(
        "Get a list of system users with optional filtering and pagination",
      );

      // Check field documentation
      expect(result["User.balance"]).toBe("User balance (exact match)");
      expect(result["User.type"]).toBe("User type (exact match)");

      // Check generated pagination docs
      expect(result.UserPage).toBe("Paginated list of system user records");
      expect(result["UserPage.items"]).toBe("List of system user records");
    });

    it("should work without fields", () => {
      const result = generateTypeDocSet("User", "system user");

      // Check basic type and query docs
      expect(result.User).toBe("Get a single system user by address");
      expect(result.Users).toBe(
        "Get a list of system users with optional filtering and pagination",
      );

      expect(Object.keys(result).length).toBeGreaterThan(3);
    });
  });

  describe("extendWithBaseDefinitions", () => {
    it("should combine user docs with base definitions", () => {
      const userDocs = {
        User: "A custom user type",
        "User.balance": "User balance field",
      };

      const result = extendWithBaseDefinitions(userDocs);

      // Should include base definitions
      expect(result).toHaveProperty("JSON", baseDefinitions.scalars.JSON);
      expect(result).toHaveProperty(
        "PageInfo",
        baseDefinitions.pagination.PageInfo,
      );

      // Should include user definitions
      expect(result).toHaveProperty("User", "A custom user type");
      expect(result).toHaveProperty("User.balance", "User balance field");
    });

    it("should allow overriding base definitions", () => {
      const userDocs = {
        String: "Custom string description",
        PageInfo: "Custom page info description",
      };

      const result = extendWithBaseDefinitions(userDocs);

      expect(result.String).toBe("Custom string description");
      expect(result.PageInfo).toBe("Custom page info description");
    });

    it("should work with empty user docs", () => {
      const result = extendWithBaseDefinitions({});

      expect(result).toHaveProperty("JSON");
      expect(result).toHaveProperty("PageInfo");
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });
  });
});
