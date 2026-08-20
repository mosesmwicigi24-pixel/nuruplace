/**
 * Liveness probe for the container healthcheck and the box deploy gate.
 *
 * Deliberately outside the [locale] segment and excluded from the proxy, so it
 * answers 200 directly rather than 307-redirecting to /en/healthz. A redirect
 * would make the health gate pass on a broken app.
 */
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ status: "ok" }, { status: 200 });
}
