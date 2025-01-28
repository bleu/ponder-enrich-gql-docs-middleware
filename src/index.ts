export * from "./types";
export * from "./introspection";
export * from "./middleware";
export * from "./base-definitions";

// Usage example:
/*
import { 
  createDocumentationMiddleware, 
  extendWithBaseDefinitions,
  generateFilterDocs,
  generatePageDocs 
} from '@your-org/graphql-docs';
import { ponder } from 'ponder:registry';
import { graphql } from 'ponder';

// Define custom documentation and combine with base definitions
const docs = extendWithBaseDefinitions({
  // Define your types
  tokenPaid: "Represents a token that was paid by a user",
  "tokenPaid.address": "Ethereum address that paid the token",
  "tokenPaid.amount": "Number of tokens that were paid",

  // Automatically generate filter documentation
  ...generateFilterDocs('address', 'Filter by token address'),
  ...generateFilterDocs('amount', 'Filter by token amount'),

  // Automatically generate pagination documentation
  ...generatePageDocs('tokenPaid', 'token payment'),

  // Your other custom types...
  tokenBorrowed: "Represents a token that was borrowed",
  "tokenBorrowed.address": "Ethereum address that borrowed the token",
  "tokenBorrowed.amount": "Number of tokens that were borrowed",
  ...generateFilterDocs('address', 'Filter by borrower address'),
  ...generateFilterDocs('amount', 'Filter by borrowed amount'),
  ...generatePageDocs('tokenBorrowed', 'token borrow'),
});

// Common GraphQL scalars, pagination fields, and filter operators 
// are automatically included via extendWithBaseDefinitions

const middleware = createDocumentationMiddleware(docs, {
  debug: true,
  path: '/graphql'
});

ponder.use('/graphql', middleware);
ponder.use('/graphql', graphql());
*/
