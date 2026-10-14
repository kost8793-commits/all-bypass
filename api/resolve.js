/**
 * All Bypass - Complete Multi-Service Bypass Resolver Engine (JavaScript for Vercel)
 */

export function detectServiceFromUrl(url, fallbackService = 'safelinku') {
  const u = (url || '').trim().toLowerCase();
  if (u.includes('sub2unlock')) return 'sub2unlock';
  if (u.includes('sub4unlock')) return 'sub4unlock';
  if (u.includes('linkvertise') || /^\d+\/[\w-]+$/.test(u)) return 'linkvertise';
  if (u.includes('scriptpastebins')) return 'scriptpastebins';
  if (u.includes('pastebin')) return 'pastebin';
  if (u.includes('pastelua')) return 'pastelua';
  if (u.includes('link2unlock')) return 'link2unlock';
  if (u.includes('tpi.li')) return 'tpili';
  if (u.includes('sfl.gl') || u.includes('safelinku')) return 'safelinku';
  if (u.includes('platoboost') || u.includes('platorelay')) return 'platoboost';

  return fallbackService || 'safelinku';
}

export function normalizeInputUrl(service, rawUrl) {
  let u = (rawUrl || '').trim();
  if (!u) return '';

  const svc = (service || '').toLowerCase().trim();

  if (svc === 'linkvertise' && !/^https?:\/\//i.test(u)) {
    u = 'https://linkvertise.com/' + u.replace(/^\/+/, '');
  } else if (svc === 'pastebin' && !/^https?:\/\//i.test(u)) {
    u = 'https://pastebin.com/' + u.replace(/^\/+/, '');
  } else if (svc === 'scriptpastebins' && !/^https?:\/\//i.test(u)) {
    u = 'https://scriptpastebins.com/' + u.replace(/^\/+/, '').replace(/\/?$/, '/');
  } else if (svc === 'pastelua' && !/^https?:\/\//i.test(u)) {
    u = 'https://pastelua.com/' + u.replace(/^\/+/, '');
  } else if (svc === 'sub4unlock' && !/^https?:\/\//i.test(u)) {
    u = u.includes('.') ? 'https://' + u : 'https://sub4unlock.co/' + u;
  } else if (svc === 'sub2unlock' && !/^https?:\/\//i.test(u)) {
    u = u.includes('.') ? 'https://' + u : 'https://sub2unlock.com/' + u;
  } else if (svc === 'link2unlock' && !/^https?:\/\//i.test(u)) {
    u = u.includes('.') ? 'https://' + u : 'https://link2unlock.com/' + u;
  } else if (svc === 'safelinku' && !/^https?:\/\//i.test(u)) {
    u = u.includes('.') ? 'https://' + u : 'https://sfl.gl/' + u;
  } else if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(u) && /^[\w.-]+\.[a-z]{2,}\//i.test(u)) {
    u = 'https://' + u;
  }

  return u;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

async function resolveSub2Unlock(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const nextDataMatch = html.match(
      /<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/
    );
    if (nextDataMatch) {
      try {
        const parsed = JSON.parse(nextDataMatch[1]);
        const unlockedLink =
          parsed?.props?.pageProps?.sink?.data?.unlocked_link ||
          parsed?.props?.pageProps?.unlocked_link;
        if (unlockedLink) {
          return {
            project: 'bypass-tools:sub2unlock:bypass',
            data: {
              ok: true,
              originalUrl: url,
              destinationUrl: unlockedLink,
              finalUrl: unlockedLink,
            },
            timestamp: new Date().toISOString(),
          };
        }
      } catch (e) {}
    }

    const linkMatch = html.match(/"unlocked_link"\s*:\s*"([^"]+)"/);
    if (linkMatch && linkMatch[1]) {
      const link = decodeHtmlEntities(linkMatch[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/'));
      return {
        project: 'bypass-tools:sub2unlock:bypass',
        data: {
          ok: true,
          originalUrl: url,
          destinationUrl: link,
          finalUrl: link,
        },
        timestamp: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn('Sub2Unlock native error:', e);
  }
  return null;
}

async function resolveSub4Unlock(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const dataPageMatch = html.match(/data-page="([^"]+)"/);
    if (dataPageMatch) {
      try {
        const jsonStr = decodeHtmlEntities(dataPageMatch[1]);
        const parsed = JSON.parse(jsonStr);
        const linkObj = parsed?.props?.link;
        const targetUrl = linkObj?.url;
        if (targetUrl) {
          return {
            project: 'bypass-tools:sub4unlock:resolve',
            data: {
              inputUrl: url,
              alias: linkObj?.alias || '',
              linkId: linkObj?.id,
              finalUrl: decodeHtmlEntities(targetUrl),
              confirmed: true,
            },
            timestamp: new Date().toISOString(),
          };
        }
      } catch (e) {}
    }

    const targetMatch = html.match(/"url"\s*:\s*"(https?:\/\/[^"]+)"/);
    if (targetMatch && !targetMatch[1].includes('sub4unlock')) {
      const targetUrl = decodeHtmlEntities(targetMatch[1].replace(/\\\//g, '/'));
      return {
        project: 'bypass-tools:sub4unlock:resolve',
        data: {
          inputUrl: url,
          finalUrl: targetUrl,
          confirmed: true,
        },
        timestamp: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn('Sub4Unlock native error:', e);
  }
  return null;
}

async function resolvePastebin(url) {
  try {
    const idMatch = url.match(/(?:pastebin\.com\/(?:raw\/)?|^)([A-Za-z0-9]{6,12})$/i);
    const pasteId = idMatch
      ? idMatch[1]
      : url.replace(/^https?:\/\/pastebin\.com\//, '').replace(/^raw\//, '').trim();

    if (!pasteId) return null;

    const rawRes = await fetch(`https://pastebin.com/raw/${pasteId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (rawRes.ok) {
      const rawText = await rawRes.text();
      return {
        project: 'bypass-tools:pastebin:raw',
        data: {
          provider: 'pastebin',
          id: pasteId,
          url: `https://pastebin.com/${pasteId}`,
          content: rawText,
          text: rawText,
          size: rawText.length,
          lines: rawText.split('\n').length,
        },
        timestamp: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn('Pastebin native error:', e);
  }
  return null;
}

async function resolveScriptPastebins(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const scriptMatch = html.match(/loadstring\([^<]+\)/) || html.match(/<code[^>]*>([\s\S]*?)<\/code>/);
    if (scriptMatch) {
      let script = decodeHtmlEntities(scriptMatch[1] || scriptMatch[0]);
      script = script.replace(/<[^>]+>/g, '').trim();
      return {
        project: 'bypass-tools:scriptpastebins:resolve',
        data: {
          url: url,
          script: script,
          text: script,
        },
        timestamp: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn('Scriptpastebins native error:', e);
  }
  return null;
}

async function resolveHttpRedirect(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
    });
    const finalUrl = res.url;
    if (finalUrl && finalUrl !== url) {
      return {
        project: 'bypass-tools:direct:redirect',
        data: {
          inputUrl: url,
          finalUrl: finalUrl,
        },
        timestamp: new Date().toISOString(),
      };
    }
  } catch (e) {
    console.warn('Redirect unshortener error:', e);
  }
  return null;
}

function isKnownShortlink(url) {
  const u = (url || '').toLowerCase();
  return (
    u.includes('sfl.gl') ||
    u.includes('safelinku') ||
    u.includes('sub2unlock') ||
    u.includes('sub4unlock') ||
    u.includes('linkvertise') ||
    u.includes('link2unlock') ||
    u.includes('tpi.li') ||
    u.includes('platoboost') ||
    u.includes('platorelay')
  );
}

async function resolveSingleStep(service, normalizedUrl) {
  if (service === 'sub2unlock') {
    const nativeResult = await resolveSub2Unlock(normalizedUrl);
    if (nativeResult) return { status: 200, body: nativeResult };
  } else if (service === 'sub4unlock') {
    const nativeResult = await resolveSub4Unlock(normalizedUrl);
    if (nativeResult) return { status: 200, body: nativeResult };
  } else if (service === 'pastebin') {
    const nativeResult = await resolvePastebin(normalizedUrl);
    if (nativeResult) return { status: 200, body: nativeResult };
  } else if (service === 'scriptpastebins') {
    const nativeResult = await resolveScriptPastebins(normalizedUrl);
    if (nativeResult) return { status: 200, body: nativeResult };
  }

  try {
    const upstreamUrl = `https://tarzbypass.vercel.app/api/resolve?service=${encodeURIComponent(service)}&url=${encodeURIComponent(normalizedUrl)}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8500);

    const upstreamRes = await fetch(upstreamUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        Referer: 'https://tarzbypass.vercel.app/',
      },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    const contentType = upstreamRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await upstreamRes.json();
      if (upstreamRes.ok && (data?.data?.finalUrl || data?.data?.text || data?.data?.primaryUrl || data?.data?.script)) {
        return { status: 200, body: data };
      }
      if (upstreamRes.status === 400 || upstreamRes.status === 404 || upstreamRes.status === 429) {
        return { status: upstreamRes.status, body: data };
      }
    }
  } catch (upstreamErr) {
    console.warn('Upstream fetch error:', upstreamErr);
  }

  if (service === 'pastebin') {
    const res = await resolvePastebin(normalizedUrl);
    if (res) return { status: 200, body: res };
  }
  if (service === 'scriptpastebins') {
    const res = await resolveScriptPastebins(normalizedUrl);
    if (res) return { status: 200, body: res };
  }
  if (service === 'sub2unlock') {
    const res = await resolveSub2Unlock(normalizedUrl);
    if (res) return { status: 200, body: res };
  }
  if (service === 'sub4unlock') {
    const res = await resolveSub4Unlock(normalizedUrl);
    if (res) return { status: 200, body: res };
  }

  if (/^https?:\/\//i.test(normalizedUrl)) {
    const redirectRes = await resolveHttpRedirect(normalizedUrl);
    if (redirectRes) return { status: 200, body: redirectRes };
  }

  return {
    status: 404,
    body: {
      content: { code: 'not_found', project: `bypass-tools:${service}:resolve` },
      message: 'Link tidak ditemukan atau layanan sedang bermasalah',
    },
  };
}

export async function executeResolution(service, rawUrl) {
  let targetUrl = (rawUrl || '').trim();
  if (!targetUrl) {
    return { status: 400, body: { error: 'invalid_url', message: 'Parameter "url" diperlukan' } };
  }

  let detectedSvc = detectServiceFromUrl(targetUrl, service);
  let normalizedUrl = normalizeInputUrl(detectedSvc, targetUrl);

  let result = await resolveSingleStep(detectedSvc, normalizedUrl);
  if (result.status !== 200 || !result.body?.data) {
    return result;
  }

  let hops = 0;
  let currentFinal =
    result.body.data.finalUrl ||
    result.body.data.primaryUrl ||
    (result.body.data.unlocks && result.body.data.unlocks[0] && result.body.data.unlocks[0].url) ||
    '';

  while (currentFinal && isKnownShortlink(currentFinal) && currentFinal !== normalizedUrl && hops < 2) {
    hops++;
    const nextSvc = detectServiceFromUrl(currentFinal);
    const nextNormalized = normalizeInputUrl(nextSvc, currentFinal);
    const nextResult = await resolveSingleStep(nextSvc, nextNormalized);

    if (nextResult.status === 200 && nextResult.body?.data) {
      const nextFinal =
        nextResult.body.data.finalUrl ||
        nextResult.body.data.primaryUrl ||
        nextResult.body.data.text ||
        '';

      if (nextFinal && nextFinal !== currentFinal) {
        result.body.data.intermediateUrl = currentFinal;
        result.body.data.finalUrl = nextFinal;
        if (nextResult.body.data.text) {
          result.body.data.text = nextResult.body.data.text;
        }
        currentFinal = nextFinal;
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return result;
}

export default async function handler(req, res) {
  if (res.setHeader) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
  }

  if (req.method === 'OPTIONS') {
    return res.status ? res.status(204).end() : res.sendStatus(204);
  }

  let service = '';
  let url = '';

  if (req.query) {
    service = req.query.service || '';
    url = req.query.url || '';
  } else if (req.url) {
    try {
      const parsed = new URL(req.url, 'http://localhost');
      service = parsed.searchParams.get('service') || '';
      url = parsed.searchParams.get('url') || '';
    } catch (e) {}
  }

  const result = await executeResolution(service, url);

  if (res.status) {
    return res.status(result.status).json(result.body);
  } else {
    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(result.body));
  }
}
