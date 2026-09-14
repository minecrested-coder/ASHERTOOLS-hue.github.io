// Cloudflare Worker — CORS relay for accountmtapi.mobilelegends.com
// deploy: dash.cloudflare.com → Workers & Pages → Create → paste → Deploy
// free tier: 100k requests/day, no card required
//
// after deploy, copy the *.workers.dev URL and paste it into the
// "custom worker url" field on any ASHER tab.

const UPSTREAM = 'https://accountmtapi.mobilelegends.com/';

// lock down by origin after you know your github.io url. leave ['*'] while testing.
const ALLOWED_ORIGINS = ['*'];
// e.g. ['https://yourname.github.io']

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';
    const allowOrigin = ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)
      ? (ALLOWED_ORIGINS.includes('*') ? '*' : origin)
      : null;

    if (!allowOrigin) {
      return new Response('origin not allowed', { status: 403 });
    }

    const cors = {
      'Access-Control-Allow-Origin':  allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
      'Access-Control-Max-Age':       '86400',
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405, headers: cors });
    }

    // two accepted body shapes:
    //   1) { url, payload }  → site targets a specific endpoint (account, role_list, etc.)
    //   2) raw moonton body  → site sends the JSON directly, we go to UPSTREAM
    let target  = UPSTREAM;
    let payload;

    let parsed;
    try {
      parsed = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: 'bad json' }), {
        status: 400, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    if (parsed && typeof parsed === 'object' && parsed.url && parsed.payload) {
      target  = String(parsed.url);
      payload = parsed.payload;
    } else {
      payload = parsed;
    }

    // only allow Moonton hosts — prevents this worker being abused as an open proxy
    const host = (() => { try { return new URL(target).host; } catch { return ''; } })();
    if (!host.endsWith('.mobilelegends.com')) {
      return new Response(JSON.stringify({ error: 'target not allowed' }), {
        status: 403, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    let upstream;
    try {
      upstream = await fetch(target, {
        method: 'POST',
        headers: {
          'Content-Type':     'application/json',
          'User-Agent':       'Mozilla/5.0',
          'X-Requested-With': 'com.mobile.legends',
          'Accept':           'application/json',
        },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'upstream fetch failed', detail: e.message }), {
        status: 502, headers: { ...cors, 'Content-Type': 'application/json' },
      });
    }

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        ...cors,
        'Content-Type':  'application/json',
        'Cache-Control': 'no-store',
      },
    });
  },
};