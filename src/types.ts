/**
 * A mapping of GraphQL type/field names to their documentation strings.
 * Keys can be either type names or field names in the format "TypeName.fieldName".
 *
 * @example
 * ```typescript
 * const docs: DocStrings = {
 *   User: "Represents a user in the system",
 *   "User.balance": "The user's balance"
 * };
 * ```
 */
export interface DocStrings {
  [key: string]: string;
}

/**
 * Structure of a GraphQL request body.
 */
export interface GraphQLRequestBody {
  /** The GraphQL query string */
  query?: string;
  /** Variables passed with the query */
  variables?: Record<string, unknown>;
  /** Name of the operation to execute */
  operationName?: string;
}

/**
 * Represents a field in the GraphQL schema introspection.
 */
export interface IntrospectionField {
  /** Name of the field */
  name: string;
  /** Optional description of the field */
  description?: string | null;
}

/**
 * Represents a type in the GraphQL schema introspection.
 */
export interface IntrospectionType {
  /** Name of the type */
  name: string;
  /** Optional description of the type */
  description?: string | null;
  /** Fields belonging to this type */
  fields?: IntrospectionField[] | null;
  /** Input fields belonging to this type */
  inputFields?: IntrospectionField[] | null;
}

/**
 * Structure of a GraphQL introspection schema.
 */
export interface IntrospectionSchema {
  __schema: {
    types: IntrospectionType[];
  };
}

/**
 * Structure of a GraphQL introspection response.
 */
export interface IntrospectionResponse {
  data: IntrospectionSchema;
}

export interface DocMap {
  [key: string]: string;
}
