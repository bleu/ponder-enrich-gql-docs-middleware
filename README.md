# Ponder GraphQL Documentation Middleware

A powerful middleware for enriching your Ponder GraphQL API documentation with detailed descriptions, making your API more discoverable and easier to use.

[![npm version](https://img.shields.io/npm/v/ponder-enrich-gql-docs-middleware.svg)](https://www.npmjs.com/package/ponder-enrich-gql-docs-middleware)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

✨ **Easy Integration** - Drop-in middleware for your Ponder GraphQL setup  
📝 **Rich Documentation** - Add detailed descriptions to types, fields, and queries  
🔄 **Automatic Generation** - Helper functions to generate common documentation patterns  
🎯 **Type Safety** - Full TypeScript support with comprehensive type definitions  
🚀 **Zero Runtime Overhead** - Only processes introspection queries  
📦 **Built-in Patterns** - Common GraphQL patterns like pagination and filtering included

## Installation

```bash
npm install ponder-enrich-gql-docs-middleware
# or
pnpm add ponder-enrich-gql-docs-middleware
# or
yarn add ponder-enrich-gql-docs-middleware
```

## Quick Start

```typescript
import {
  createDocumentationMiddleware,
  extendWithBaseDefinitions,
  generateFilterDocs,
  generatePageDocs,
} from "ponder-enrich-gql-docs-middleware";
import { ponder } from "ponder:registry";
import { graphql } from "ponder";

// Define your documentation
const docs = extendWithBaseDefinitions({
  // Define your types
  User: "Represents a user in the system",
  "User.email": "The user's email address",
  "User.name": "The user's full name",

  // Generate pagination documentation
  ...generatePageDocs("User", "user"),
});

// Add the middleware to your GraphQL endpoint
const middleware = createDocumentationMiddleware(docs);
ponder.use("/graphql", middleware);
ponder.use("/graphql", graphql());
```

## Documentation Helpers

### Base Definitions

The package includes common GraphQL definitions out of the box:

- Standard scalar types (JSON, BigInt, Boolean, String, Int)
- Pagination fields (hasNextPage, hasPreviousPage, startCursor, endCursor)
- Query arguments (where, orderBy, orderDirection, before, after, limit)
- Filter operators (equals, not, in, contains, starts_with, etc.)

### Helper Functions

#### `generatePageDocs(typeName, description)`

Creates documentation for pagination-related fields:

```typescript
const pageDocs = generatePageDocs("User", "system user");
// Generates docs for: UserPage, UserPage.items, UserPage.pageInfo, etc.
```

#### `generateQueryDocs(typeName, description)`

Generates documentation for standard query fields:

```typescript
const queryDocs = generateQueryDocs("User", "system user");
// Generates docs for: User, Users, Users.where, Users.orderBy, etc.
```

#### `generateTypeDocSet(typeName, description, fields)`

Combines multiple documentation generators for a complete type:

```typescript
const userDocs = generateTypeDocSet("User", "system user", {
  "User.email": "User email address",
  "User.name": "User full name",
});
```

## Example Output

After adding the middleware, your GraphQL API documentation will be enriched in introspection queries, making it more readable in tools like GraphiQL:

```graphql
# What tools like GraphiQL will show
type User {
  """
  The user's email address
  """
  email: String

  """
  The user's full name
  """
  name: String
}
```

Note: This middleware only affects the documentation returned in introspection queries. It does not modify your actual schema.graphql file or change any runtime behavior of your API.

## Configuration Options

```typescript
const middleware = createDocumentationMiddleware(docs, {
  debug: true, // Enable debug logging
  path: "/graphql", // GraphQL endpoint path
});
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Run tests: `pnpm test`
4. Check types: `pnpm typecheck`
5. Lint code: `pnpm lint`

## License

MIT © [José Ribeiro](https://github.com/ribeirojose)
