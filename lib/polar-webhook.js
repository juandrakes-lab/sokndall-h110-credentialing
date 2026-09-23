import { validateEvent, WebhookVerificationError } from "@polar-sh/sdk/webhooks";
import { Webhook, WebhookVerificationError as StandardVerificationError } from "standardwebhooks";

export { WebhookVerificationError };

// Endpoints created since 2026-09-08 use Standard Webhooks: the secret
// "whsec_<base64 key>" must reach the verifier as-is. The SDK's validateEvent
// base64-encodes whatever it is given (the legacy scheme, still used by the
// sandbox endpoint), which gives the wrong key for a Standard endpoint and
// fails every delivery with 403. Both kinds of secret look alike (whsec_...),
// so the legacy check runs first and the Standard one only when it fails; each
// is a full HMAC check, so accepting either is no weaker. A Standard-verified
// event is then handed to the SDK — re-signed with a throwaway key — for its
// typed parsing, which it does not export on its own.
const PARSE_ONLY_KEY = "sokndall-parse-only";

export function verifyEvent(body, headers, secret) {
  try {
    return validateEvent(body, headers, secret);
  } catch (err) {
    if (!(err instanceof WebhookVerificationError)) throw err;
  }
  try {
    new Webhook(secret).verify(body, headers);
  } catch (err) {
    if (err instanceof StandardVerificationError) throw new WebhookVerificationError(err.message);
    throw err;
  }
  const resigner = new Webhook(Buffer.from(PARSE_ONLY_KEY, "utf-8").toString("base64"));
  const sentAt = new Date(Number(headers["webhook-timestamp"]) * 1000);
  const signature = resigner.sign(headers["webhook-id"], sentAt, body);
  return validateEvent(body, { ...headers, "webhook-signature": signature }, PARSE_ONLY_KEY);
}
