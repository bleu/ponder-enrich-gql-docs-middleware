import { ponder } from "ponder:registry";
import { graphql } from "ponder";

import {
  createDocumentationMiddleware,
  extendWithBaseDefinitions,
  generateTypeDocSet,
} from "ponder-enrich-gql-docs-middleware";

const docs = extendWithBaseDefinitions({
  ...generateTypeDocSet("tokenPaid", "token payment", {
    "tokenPaid.address": "Ethereum address that paid the token",
    "tokenPaid.amount": "Number of tokens that were paid",
  }),
});

ponder.use("/graphql", createDocumentationMiddleware(docs));
ponder.use("/graphql", graphql());
