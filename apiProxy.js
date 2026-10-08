/**
 * Server-side GitHub API Proxy
 * Handles requests to /api/github/... by proxying to https://api.github.com/...
 * 
 * Security:
 * - Uses server-side process.env.GITHUB_TOKEN
 * - Authenticates with Authorization: Bearer ${process.env.GITHUB_TOKEN}
 * - Never returns token to client browser or in response headers
 * - In-memory LRU cache to prevent rate limit exhaustion
 */

// Cache key -> { status, headers, body, timestamp }
const proxyCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache for successes & 404s
const RATE_LIMIT_CACHE_TTL_MS = 60 * 1000; // 60s cache for rate-limited responses

/**
 * Handles incoming request to /api/github/...
 * Works with both native Node http.Server (server.js) and Connect/Vite dev server middleware.
 */
export async function handleGithubProxy(req, res) {
  // CORS & Preflight headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Accept, Content-Type, X-GitHub-Token, Authorization');

  if (req.method === 'OPTIONS') {
    if (res.writeHead) {
      res.writeHead(204);
    } else {
      res.statusCode = 204;
    }
    res.end();
    return;
  }

  try {
    const rawUrl = req.url || '';
    const parsedUrl = new URL(rawUrl, `http://${req.headers?.host || 'localhost'}`);
    
    // Strip /api/github prefix
    const targetPath = parsedUrl.pathname.replace(/^\/api\/github/, '') + parsedUrl.search;

    if (!targetPath || targetPath === '/' || targetPath === '') {
      const errBody = JSON.stringify({ error: 'Missing GitHub API target path' });
      if (res.writeHead) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
      } else {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
      }
      res.end(errBody);
      return;
    }

    // Client can optionally provide custom personal token via X-GitHub-Token header
    const clientCustomToken = req.headers?.['x-github-token'] || '';
    const serverToken = (typeof process !== 'undefined' && process.env?.GITHUB_TOKEN) || '';
    const activeToken = (clientCustomToken || serverToken).trim();

    // Cache key differentiates custom token requests from default server token
    const cacheKey = `${targetPath}:${clientCustomToken ? 'custom' : 'server'}`;
    const now = Date.now();
    const cached = proxyCache.get(cacheKey);

    if (cached) {
      const ttl = (cached.status === 403 || cached.status === 429) ? RATE_LIMIT_CACHE_TTL_MS : CACHE_TTL_MS;
      if (now - cached.timestamp < ttl) {
        if (res.writeHead) {
          res.writeHead(cached.status, {
            ...cached.headers,
            'X-Proxy-Cache': 'HIT',
          });
        } else {
          res.statusCode = cached.status;
          Object.entries(cached.headers).forEach(([k, v]) => res.setHeader(k, v));
          res.setHeader('X-Proxy-Cache', 'HIT');
        }
        res.end(cached.body);
        return;
      }
    }

    const githubUrl = `https://api.github.com${targetPath}`;
    const forwardHeaders = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'GitHub-Roast-And-Rescue-App/2.0',
    };

    // Add authenticated GitHub token server-side
    if (activeToken) {
      forwardHeaders['Authorization'] = `Bearer ${activeToken}`;
    }

    const ghRes = await fetch(githubUrl, {
      method: req.method || 'GET',
      headers: forwardHeaders,
    });

    const body = await ghRes.text();
    const status = ghRes.status;

    let responseBody = body;
    // Feature 2: For user search autocomplete, return minimal public fields required by the UI
    if (status === 200 && targetPath.startsWith('/search/users')) {
      try {
        const parsed = JSON.parse(body);
        if (Array.isArray(parsed.items)) {
          const minimalItems = parsed.items.slice(0, 8).map((u) => ({
            login: u.login,
            id: u.id,
            avatar_url: u.avatar_url,
            html_url: u.html_url,
            score: u.score || 1,
            type: u.type || 'User',
          }));
          responseBody = JSON.stringify({
            total_count: parsed.total_count,
            items: minimalItems,
          });
        }
      } catch {
        // Fallback to raw response if JSON parse fails
        responseBody = body;
      }
    }

    const responseHeaders = {
      'Content-Type': 'application/json',
      'X-Proxy-Cache': 'MISS',
    };

    // Forward GitHub rate limit headers to client telemetry (critical for UI indicators)
    const rateRemaining = ghRes.headers.get('x-ratelimit-remaining');
    const rateReset = ghRes.headers.get('x-ratelimit-reset');
    const rateLimit = ghRes.headers.get('x-ratelimit-limit');

    if (rateRemaining !== null) responseHeaders['X-RateLimit-Remaining'] = rateRemaining;
    if (rateReset !== null) responseHeaders['X-RateLimit-Reset'] = rateReset;
    if (rateLimit !== null) responseHeaders['X-RateLimit-Limit'] = rateLimit;

    // Cache responses for successful queries, 404s, and rate limits
    if (status === 200 || status === 404 || status === 403 || status === 429) {
      if (proxyCache.size > 500) {
        const oldestKey = proxyCache.keys().next().value;
        proxyCache.delete(oldestKey);
      }
      proxyCache.set(cacheKey, {
        status,
        headers: responseHeaders,
        body: responseBody,
        timestamp: now,
      });
    }

    if (res.writeHead) {
      res.writeHead(status, responseHeaders);
    } else {
      res.statusCode = status;
      Object.entries(responseHeaders).forEach(([k, v]) => res.setHeader(k, v));
    }
    res.end(responseBody);
  } catch (err) {
    console.error('[GitHub Proxy Error]:', err.message);
    const errBody = JSON.stringify({
      error: 'Failed to contact GitHub API via server proxy',
      message: err.message,
    });
    if (res.writeHead) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    } else {
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
    }
    res.end(errBody);
  }
}

/**
 * Clear the proxy cache (useful for testing)
 */
export function clearProxyCache() {
  proxyCache.clear();
}
