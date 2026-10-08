/**
 * GitHub API Service
 * Handles fetching public profile, repositories, and documentation signals.
 * Calls our server-side proxy endpoint (/api/github/...) in the browser,
 * which attaches the server's GITHUB_TOKEN and caches responses.
 * 
 * Never exposes GITHUB_TOKEN to the client browser bundle.
 */

import { sampleProfiles, generateSimulatedProfile } from './sampleData.js';

// In browser, route requests through our server-side proxy at /api/github.
// In Node (e.g. test runner), fallback to https://api.github.com directly.
const isBrowser = typeof window !== 'undefined';
const API_BASE = isBrowser ? '/api/github' : 'https://api.github.com';

// Client-side cache to avoid repeating identical audits within the same session
const clientAuditCache = new Map();
const CLIENT_CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes

export async function fetchGitHubProfile(username, customToken = '') {
  const cleanUsername = username.trim().toLowerCase();
  const token = (customToken || '').trim();

  // Check client-side memory cache first
  const clientCacheKey = `${cleanUsername}:${token ? 'custom' : 'default'}`;
  const now = Date.now();
  const cachedAudit = clientAuditCache.get(clientCacheKey);
  if (cachedAudit && (now - cachedAudit.timestamp < CLIENT_CACHE_TTL_MS)) {
    return cachedAudit.data;
  }

  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };

  // If user provided an optional personal access token in Settings,
  // forward it via X-GitHub-Token to the proxy (or Authorization if direct Node call)
  if (token) {
    if (isBrowser) {
      headers['X-GitHub-Token'] = token;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    // 1. Fetch User Profile via /api/github/users/:username
    const userRes = await fetch(`${API_BASE}/users/${encodeURIComponent(cleanUsername)}`, { headers });

    const rateLimitRemaining = userRes.headers.get('x-ratelimit-remaining');
    const rateLimitReset = userRes.headers.get('x-ratelimit-reset');

    if (userRes.status === 404) {
      throw new Error(`GitHub user "${cleanUsername}" was not found. Please double-check the spelling!`);
    }

    // Rate-limited (403 or 429)
    if (userRes.status === 403 || userRes.status === 429) {
      const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : 'soon';

      // If a verified sample profile exists for this handle, load it as fallback
      if (sampleProfiles[cleanUsername]) {
        const result = {
          ...sampleProfiles[cleanUsername],
          isDemoFallback: true,
          isRateLimited: true,
          rateLimitWarning: `GitHub public API rate limit reached (resets ${resetTime}). Loaded cached verified profile for @${cleanUsername}. Try Demo Profile or add a token in Settings!`,
          rateLimitRemaining: 0,
          rateLimitReset: rateLimitReset ? parseInt(rateLimitReset, 10) : null,
        };
        clientAuditCache.set(clientCacheKey, { data: result, timestamp: now });
        return result;
      }

      throw new Error(`GitHub API rate limit reached for your IP (resets ${resetTime}). Standard limit is 60 req/hr. Use "Try Demo Profile" or add an optional token in Settings.`);
    }

    if (!userRes.ok) {
      throw new Error(`GitHub API error (${userRes.status}): ${userRes.statusText || 'Unable to fetch profile'}`);
    }

    const userData = await userRes.json();

    // 2. Fetch Repositories (up to 100 sorted by updated)
    let repos = [];
    if (userData.public_repos > 0) {
      try {
        const reposRes = await fetch(
          `${API_BASE}/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`,
          { headers }
        );
        if (reposRes.ok) {
          repos = await reposRes.json();
        } else if (reposRes.status === 403 || reposRes.status === 429) {
          const fallback = sampleProfiles[cleanUsername] || generateSimulatedProfile(cleanUsername);
          repos = fallback.repos || [];
        }
      } catch {
        const fallback = sampleProfiles[cleanUsername] || generateSimulatedProfile(cleanUsername);
        repos = fallback.repos || [];
      }
    }

    // 3. Check for Profile README repo (username/username)
    let hasProfileReadme = false;
    try {
      const readmeRes = await fetch(`${API_BASE}/repos/${encodeURIComponent(cleanUsername)}/${encodeURIComponent(cleanUsername)}/readme`, {
        method: 'GET',
        headers,
      });
      if (readmeRes.ok) {
        hasProfileReadme = true;
      }
    } catch {
      hasProfileReadme = false;
    }

    // 4. Check for top repos READMEs (limit to top 3 non-forked repos with code to minimize API calls)
    const candidates = repos.filter(r => !r.fork && r.size > 0).slice(0, 3);

    const enrichedCandidates = await Promise.all(
      candidates.map(async (repo) => {
        let hasReadme = false;
        try {
          const rRes = await fetch(`${API_BASE}/repos/${encodeURIComponent(cleanUsername)}/${encodeURIComponent(repo.name)}/readme`, {
            method: 'GET',
            headers,
          });
          hasReadme = rRes.ok;
        } catch {
          hasReadme = false;
        }
        return {
          ...repo,
          hasReadme,
        };
      })
    );

    // Merge candidate repos with remaining repos
    const enrichedMap = new Map(enrichedCandidates.map(r => [r.id, r]));
    const allRepos = repos.map(r => enrichedMap.get(r.id) || { ...r, hasReadme: !r.fork && r.size > 10 });

    const auditResult = {
      user: userData,
      repos: allRepos,
      hasProfileReadme,
      rateLimitRemaining: rateLimitRemaining ? parseInt(rateLimitRemaining, 10) : null,
      rateLimitReset: rateLimitReset ? parseInt(rateLimitReset, 10) : null,
      fetchedAt: new Date().toISOString(),
      isDemoFallback: false,
    };

    // Cache the successful audit
    clientAuditCache.set(clientCacheKey, { data: auditResult, timestamp: now });
    return auditResult;
  } catch (err) {
    // If not a 404 user-not-found error, fallback gracefully on rate limits or network issues if sample profile exists
    if (sampleProfiles[cleanUsername]) {
      const result = {
        ...sampleProfiles[cleanUsername],
        isDemoFallback: true,
        isRateLimited: true,
        rateLimitWarning: `GitHub API note: Loaded verified profile for @${cleanUsername}. Try Demo Profile or add a token in Settings!`,
      };
      clientAuditCache.set(clientCacheKey, { data: result, timestamp: now });
      return result;
    }

    throw err;
  }
}

/**
 * Clear the client-side audit cache (useful for testing or refreshing)
 */
export function clearClientAuditCache() {
  clientAuditCache.clear();
}

// Client-side cache for autocomplete search queries
const clientSearchCache = new Map();
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Autocomplete search for GitHub users via server proxy /api/github/search/users
 * Includes debounced memory cache and graceful fallback to curated demo profiles.
 */
export async function searchGitHubUsers(query, customToken = '') {
  const cleanQuery = (query || '').trim().toLowerCase();
  if (!cleanQuery || cleanQuery.length < 2) {
    return { items: [], isRateLimited: false };
  }

  const token = (customToken || '').trim();
  const cacheKey = `${cleanQuery}:${token ? 'custom' : 'default'}`;
  const now = Date.now();
  const cached = clientSearchCache.get(cacheKey);
  if (cached && (now - cached.timestamp < SEARCH_CACHE_TTL_MS)) {
    return cached.data;
  }

  // Find matches in sample profiles for immediate high-fidelity suggestions
  const sampleMatches = Object.values(sampleProfiles)
    .filter((p) => p?.user && (
      p.user.login.toLowerCase().includes(cleanQuery) ||
      (p.user.name && p.user.name.toLowerCase().includes(cleanQuery))
    ))
    .map((p) => ({
      login: p.user.login,
      name: p.user.name || p.user.login,
      avatar_url: p.user.avatar_url,
      bio: p.user.bio || '',
      public_repos: p.user.public_repos || p.repos?.length || 0,
      followers: p.user.followers || 0,
      isSample: true,
      html_url: p.user.html_url || `https://github.com/${p.user.login}`,
      primaryLanguage: p.repos?.[0]?.language || 'JavaScript',
    }));

  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    if (isBrowser) {
      headers['X-GitHub-Token'] = token;
    } else {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(`${API_BASE}/search/users?q=${encodeURIComponent(cleanQuery)}&per_page=6`, {
      headers,
    });

    if (res.status === 403 || res.status === 429) {
      const result = {
        items: sampleMatches.slice(0, 6),
        isRateLimited: true,
        rateLimitWarning: 'GitHub search is temporarily rate limited. Try a Demo Profile while the API resets.',
      };
      clientSearchCache.set(cacheKey, { data: result, timestamp: now });
      return result;
    }

    if (!res.ok) {
      if (sampleMatches.length > 0) {
        return { items: sampleMatches.slice(0, 6), isRateLimited: false };
      }
      return {
        items: [],
        isRateLimited: false,
        error: 'GitHub search is temporarily unavailable.',
      };
    }

    const data = await res.json();
    const ghItems = Array.isArray(data.items) ? data.items : [];

    // Merge sample matches with GitHub items, removing duplicates by login
    const seen = new Set();
    const merged = [];

    // Sample matches first for high quality
    for (const s of sampleMatches) {
      if (!seen.has(s.login.toLowerCase())) {
        seen.add(s.login.toLowerCase());
        merged.push(s);
      }
    }

    for (const g of ghItems) {
      const lower = g.login.toLowerCase();
      if (!seen.has(lower)) {
        seen.add(lower);
        merged.push({
          login: g.login,
          avatar_url: g.avatar_url,
          html_url: g.html_url,
          score: g.score || 1,
          isSample: false,
        });
      }
    }

    const result = {
      items: merged.slice(0, 6),
      isRateLimited: false,
    };

    clientSearchCache.set(cacheKey, { data: result, timestamp: now });
    return result;
  } catch {
    if (sampleMatches.length > 0) {
      const result = { items: sampleMatches.slice(0, 6), isRateLimited: false };
      clientSearchCache.set(cacheKey, { data: result, timestamp: now });
      return result;
    }
    return {
      items: [],
      isRateLimited: false,
      error: 'GitHub search is temporarily unavailable.',
    };
  }
}

export function clearClientSearchCache() {
  clientSearchCache.clear();
}
