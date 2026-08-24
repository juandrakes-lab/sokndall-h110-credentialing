// Vercel Cron calls the route with `Authorization: Bearer <CRON_SECRET>`.
// Reject anything else so these routes can't be triggered by a random
// request hitting a guessed URL.
export function isAuthorizedCronRequest(request) {
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${process.env.CRON_SECRET}`;
}
