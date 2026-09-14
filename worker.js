// Cloudflare Worker — CORS proxy for accountmtapi.mobilelegends.com
// deploy at dash.cloudflare.com → Workers → Create → paste → Deploy
// free tier: 100k req/day, no card required

const UPSTREAM = 'https://accountmtapi.mobilelegends.com/';

export default {
  async fetch(request) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin':  '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
          'Access-Control-Max-Age':       '86400',
        },
      });
    }
    if (request.method !== 'POST') {
      return new Response('POST only', { status: 405 });
    }

    let target = UPSTREAM;
    let payload;

    // two accepted shapes:
    // 1) { url, payload }  — site sends target + body
    // 2) raw moonton body  — site sends body directly
    try {
      const j = await request.json();
      if (j && j.url && j.payload) {
        target  = j.url;
        payload = j.payload;
      } else {
        payload = j;
      }
    } catch {
      return new Response('bad json', { status: 400 });
    }

    const upstream = await fetch(target, {
      method:  'POST',
      headers: {
        'Content-Type':     'application/json',
        'User-Agent':       'Mozilla/5.0',
        'X-Requested-With': 'com.mobile.legends',
        'Accept':           'application/json',
      },
      body: JSON.stringify(payload),
    });

    const body = await upstream.text();
    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type':                'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control':               'no-store',
      },
    });
  },
};