import type { DocMap } from "./types";

// src/base-definitions.ts
export const baseDefinitions = {
  // Standard scalar types
  scalars: {
    JSON: "The `JSON` scalar type represents JSON values as specified by ECMA-404",
    BigInt:
      "Arbitrary precision integer, useful for representing large numbers",
    Boolean: "True or false value",
    String: "UTF-8 character sequence used for text data",
    Int: "32-bit integer between -(2^31) and 2^31 - 1",
  },

  // Common page info and pagination
  pagination: {
    PageInfo: "Information about pagination in a connection",
    "PageInfo.hasNextPage":
      "Whether there are more records after the current page",
    "PageInfo.hasPreviousPage":
      "Whether there are more records before the current page",
    "PageInfo.startCursor":
      "Cursor pointing to the first record in the current page",
    "PageInfo.endCursor":
      "Cursor pointing to the last record in the current page",
    totalCount: "Total number of records matching the query",
    items: "List of items in the current page",
  },

  // Query arguments
  queryArgs: {
    where: "Filter conditions to apply",
    orderBy: "Field to order results by",
    orderDirection: "Direction to order results (asc/desc)",
    before: "Fetch records before this cursor",
    after: "Fetch records after this cursor",
    limit: "Maximum number of records to return",
  },

  // Filter operators
  filterOperators: {
    AND: "Combine multiple conditions with AND",
    OR: "Combine multiple conditions with OR",
    equals: "Exact match",
    not: "Negates the condition",
    in: "Match any value in the provided list",
    not_in: "Match none of the values in the provided list",
    gt: "Greater than",
    gte: "Greater than or equal",
    lt: "Less than",
    lte: "Less than or equal",
    contains: "String contains the value",
    not_contains: "String does not contain the value",
    starts_with: "String starts with the value",
    ends_with: "String ends with the value",
    not_starts_with: "String does not start with the value",
    not_ends_with: "String does not end with the value",
  },
};

// Helper function to generate filter field docs
export function generateFilterDocs(fieldName: string, baseDesc = ""): DocMap {
  const prefix = fieldName ? `${fieldName}_` : "";
  return {
    [`${fieldName}`]: `${baseDesc} (exact match)`,
    [`${prefix}not`]: `${baseDesc} (exclude match)`,
    [`${prefix}in`]: `${baseDesc} (match any in list)`,
    [`${prefix}not_in`]: `${baseDesc} (match none in list)`,
    [`${prefix}gt`]: `${baseDesc} (greater than)`,
    [`${prefix}gte`]: `${baseDesc} (greater than or equal)`,
    [`${prefix}lt`]: `${baseDesc} (less than)`,
    [`${prefix}lte`]: `${baseDesc} (less than or equal)`,
    [`${prefix}contains`]: `${baseDesc} (contains substring)`,
    [`${prefix}not_contains`]: `${baseDesc} (does not contain substring)`,
    [`${prefix}starts_with`]: `${baseDesc} (starts with)`,
    [`${prefix}ends_with`]: `${baseDesc} (ends with)`,
    [`${prefix}not_starts_with`]: `${baseDesc} (does not start with)`,
    [`${prefix}not_ends_with`]: `${baseDesc} (does not end with)`,
  };
}

// Helper to generate page type docs
export function generatePageDocs(typeName: string, description = ""): DocMap {
  return {
    [`${typeName}Page`]: `Paginated list of ${description || typeName} records`,
    [`${typeName}Page.items`]: `List of ${description || typeName} records`,
    [`${typeName}Page.pageInfo`]: baseDefinitions.pagination.PageInfo,
    [`${typeName}Page.totalCount`]: baseDefinitions.pagination.totalCount,
  };
}

/**
 * Generate documentation for a query field based on its type name
 */
export function generateQueryDocs(typeName: string, description = ""): DocMap {
  const baseDesc = description || `${typeName} record`;
  const pluralName = `${typeName}s`;

  return {
    // Single record query
    [typeName]: `Get a single ${baseDesc} by address`,

    // List query with filters and pagination
    [pluralName]: `Get a list of ${baseDesc}s with optional filtering and pagination`,
    [`${pluralName}.where`]: `Filter conditions for ${baseDesc}s`,
    [`${pluralName}.orderBy`]: `Field to order ${baseDesc}s by`,
    [`${pluralName}.orderDirection`]: `Direction to order ${baseDesc}s (asc/desc)`,
    [`${pluralName}.before`]: "Fetch records before this cursor",
    [`${pluralName}.after`]: "Fetch records after this cursor",
    [`${pluralName}.limit`]: "Maximum number of records to return",
  };
}

export function generateTypeDocSet(
  typeName: string,
  description: string,
  fields: Record<string, string> = {},
): DocMap {
  return {
    // Attach doc to the actual type name, i.e. "User"
    [typeName]: description,
    // Also attach field docs with "User.fieldName"
    ...fields,
    // Possibly remove the `[typeName].description` key if not needed
    // Because "User.description" won't match anything in the schema

    // Pagination docs, query docs, etc.
    ...Object.entries(fields).reduce(
      (acc, [fieldName, fieldDesc]) => ({
        ...acc,
        ...generateFilterDocs(fieldName, fieldDesc),
      }),
      {},
    ),
    ...generatePageDocs(typeName, description),
    ...generateQueryDocs(typeName, description),
  };
}

export function extendWithBaseDefinitions(
  userDocs: Record<string, string>,
): DocMap {
  return {
    // Add scalar descriptions
    ...baseDefinitions.scalars,

    // Add pagination field descriptions
    ...baseDefinitions.pagination,

    // Add user's custom docs
    ...userDocs,
  };
}
