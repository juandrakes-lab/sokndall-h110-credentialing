// Thin wrapper over the Pexels REST API (no SDK dependency needed for a
// couple of calls). Server-only: PEXELS_API_KEY must never be exposed to
// the client — Pexels uses the raw key as the Authorization header value
// (no "Bearer " prefix), unlike Resend/Polar.

async function pexelsFetch(path) {
  const res = await fetch(`https://api.pexels.com/v1/${path}`, {
    headers: { Authorization: process.env.PEXELS_API_KEY },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Pexels error ${res.status}: ${body}`);
  }

  return res.json();
}

// query: search term, e.g. "medical office". perPage: 1-80.
export async function searchPhotos(query, { perPage = 10, orientation } = {}) {
  const params = new URLSearchParams({ query, per_page: String(perPage) });
  if (orientation) params.set("orientation", orientation); // "landscape" | "portrait" | "square"
  const data = await pexelsFetch(`search?${params}`);
  return data.photos;
}

export async function curatedPhotos({ perPage = 10 } = {}) {
  const data = await pexelsFetch(`curated?per_page=${perPage}`);
  return data.photos;
}
