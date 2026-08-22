/**
 * A stand-in for the Pathway API, so the browser suites exercise the REAL give
 * form rather than its "not switched on yet" panel.
 *
 * Without this, `PATHWAY_API_URL` is unset in CI, `/give` renders the honest
 * fallback, and the accessibility and responsive checks pass having never seen
 * a single input — which is worse than not running them, because the report
 * says "give-en: no violations" either way.
 *
 * It is deliberately not a mock library: the page talks to it over HTTP exactly
 * as it will talk to Pathway, including the HMAC, so the signing code runs for
 * real. It verifies the signature and refuses an unsigned request, because a
 * stub that accepts anything would hide the case where the website forgets to
 * sign.
 *
 *   node tests/stub-pathway.mjs          # listens on 3111, or STUB_PORT
 */
import { createServer } from "node:http";
import { createHmac, timingSafeEqual } from "node:crypto";

const PORT = Number(process.env.STUB_PORT ?? 3111);
const SECRET = process.env.STUB_SECRET ?? "playwright-giving-secret";

const FUNDS = [
  { code: "offering", name: "Offering" },
  { code: "tithe", name: "Tithe" },
  { code: "mission", name: "Missions" },
];

/**
 * What the status endpoint will say about each gift this stub created.
 *
 * The real API reads the ledger; here the outcome is chosen from the giver's
 * number so a test can reach every branch:
 *   …777  the gift fails (cancelled on the handset)
 *   …666  it never resolves (the push expires)
 *   any other  it succeeds
 */
const STATUS_BY_TXN = new Map();
let seq = 0;

const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json", "content-length": Buffer.byteLength(payload) });
  res.end(payload);
};

/** The same scheme the real receiver uses: t=<unix>,v1=<hex> over `${t}.${body}`. */
function signatureValid(header, rawBody) {
  const m = /^t=(\d{1,12}),v1=([0-9a-f]{64})$/.exec((header ?? "").trim());
  if (!m) return false;
  const expected = createHmac("sha256", SECRET).update(`${m[1]}.${rawBody}`).digest("hex");
  const a = Buffer.from(m[2], "hex");
  const b = Buffer.from(expected, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "GET" && url.pathname === "/v1/giving/funds") {
    return json(res, 200, {
      funds: FUNDS,
      currency: "KES",
      min_minor: 1000,
      max_minor: 15_000_000,
      providers: [
        { key: "mpesa", label: "M-Pesa", enabled: true },
        { key: "airtel", label: "Airtel Money", enabled: false },
      ],
    });
  }

  // "Has it landed yet?" — what turns "check your phone" into "thank you".
  // The outcome is driven by the number that gave, so a browser test can reach
  // each branch on demand; the real API decides it from the ledger.
  if (req.method === "POST" && url.pathname === "/v1/webhooks/website-giving/status") {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      if (!signatureValid(req.headers["x-nuruplace-signature"], raw)) {
        return json(res, 401, { error: { code: "AUTH_REQUIRED", message: "Signature does not match" } });
      }
      const { transaction_id: id } = JSON.parse(raw);
      const outcome = STATUS_BY_TXN.get(id);
      if (!outcome) return json(res, 404, { error: { code: "NOT_FOUND", message: "unknown gift" } });
      return json(res, 200, {
        status: outcome.status,
        amount_minor: outcome.amount_minor,
        currency: "KES",
        fund: "Offering",
        receipt_code: outcome.status === "succeeded" ? "SJ12ABC345" : null,
        settled_at: outcome.status === "succeeded" ? new Date(0).toISOString() : null,
      });
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/v1/webhooks/website-giving") {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      if (!signatureValid(req.headers["x-nuruplace-signature"], raw)) {
        return json(res, 401, { error: { code: "AUTH_REQUIRED", message: "Signature does not match" } });
      }
      let body;
      try {
        body = JSON.parse(raw);
      } catch {
        return json(res, 400, { error: { code: "VALIDATION_FAILED", message: "Body is not valid JSON" } });
      }
      // Two behaviours the suite needs to be able to reach on demand, chosen by
      // the number given — the real API decides them from state the browser
      // cannot set up.
      if (String(body.phone_number).endsWith("999")) {
        res.setHeader("retry-after", "540");
        return json(res, 429, { error: { code: "RATE_LIMITED", message: "Too many giving requests" } });
      }
      if (String(body.phone_number).endsWith("888")) {
        return json(res, 400, {
          error: { code: "VALIDATION_FAILED", message: "That amount is above the M-Pesa limit for one payment" },
        });
      }
      // A distinct id per gift, and a remembered outcome the status endpoint
      // will report. Driven by the last digits of the number so a browser test
      // can ask for a success, a refusal, or a gift that never resolves.
      seq += 1;
      const id = `00000000-0000-4000-8000-${String(seq).padStart(12, "0")}`;
      const phone = String(body.phone_number);
      const status = phone.endsWith("777") ? "failed" : phone.endsWith("666") ? "processing" : "succeeded";
      STATUS_BY_TXN.set(id, { status, amount_minor: body.amount_minor });
      return json(res, 201, {
        transaction_id: id,
        provider: "mpesa",
        provider_ref: `stub_stk_${seq}`,
        status: "processing",
        idempotency_key: body.idempotency_key,
        reused: false,
      });
    });
    return;
  }

  json(res, 404, { error: { code: "NOT_FOUND", message: url.pathname } });
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[stub-pathway] listening on http://127.0.0.1:${PORT}`);
});
