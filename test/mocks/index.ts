import { Request, Response } from "undici";

export const createMockContext = (
  queryBody: string | Record<string, unknown>,
  responseData: unknown,
) => {
  const body =
    typeof queryBody === "string" ? queryBody : JSON.stringify(queryBody);
  const responseBody =
    typeof responseData === "string"
      ? responseData
      : JSON.stringify(responseData);

  return {
    req: {
      raw: new Request("http://test.com", {
        method: "POST",
        body,
      }),
    },
    res: new Response(responseBody, {
      headers: { "Content-Type": "application/json" },
    }),
  };
};
