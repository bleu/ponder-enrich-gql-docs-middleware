import type { DocStrings, IntrospectionSchema } from "./types";

/**
 * Enhances an introspection schema with additional documentation strings.
 *
 * @param introspectionData - The original introspection schema
 * @param docs - Documentation strings to add to the schema
 * @returns The enhanced schema with added documentation
 * @throws {Error} If the introspection data structure is invalid
 *
 * @example
 * ```typescript
 * const docs = {
 *   User: "Represents a user",
 *   "User.balance": "User's balance"
 * };
 *
 * const enhancedSchema = addDocStringsToIntrospection(schema, docs);
 * ```
 */
export function addDocStringsToIntrospection(
  introspectionData: IntrospectionSchema,
  docs: DocStrings,
): IntrospectionSchema {
  if (
    !introspectionData?.__schema?.types ||
    !Array.isArray(introspectionData.__schema.types)
  ) {
    throw new Error("Invalid introspection data structure");
  }

  const types = introspectionData.__schema.types;

  for (const [typeDotField, desc] of Object.entries(docs)) {
    const [typeName, fieldName] = typeDotField.split(".");
    const typeObj = types.find((t) => t.name === typeName);
    if (!typeObj) continue;

    // If there is NO dot (no fieldName), it's a type-level doc
    if (!fieldName) {
      typeObj.description = desc;
      continue;
    }

    // 1) If it's an object or interface type, fields live in `fields`
    if (Array.isArray(typeObj.fields)) {
      const fieldObj = typeObj.fields.find((f) => f.name === fieldName);
      if (fieldObj) fieldObj.description = desc;
    }

    // 2) If it's an input object type, fields live in `inputFields`
    if (Array.isArray(typeObj.inputFields)) {
      const inputFieldObj = typeObj.inputFields.find(
        (f) => f.name === fieldName,
      );
      if (inputFieldObj) inputFieldObj.description = desc;
    }
  }

  return introspectionData;
}
