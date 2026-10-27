export function getApprovedRequestToken(
  params: Pick<URLSearchParams, "get">,
  storedToken: string | null,
): string | null {
  const token = params.get("request_token");
  return params.get("approved") === "true" &&
    storedToken &&
    token === storedToken
    ? token
    : null;
}
