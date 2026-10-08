/**
 * GitHub API Service
 * Handles fetching public profile, repositories, and documentation signals.
 * Gracefully handles 404, rate-limiting (403), network failures, and empty profiles.
 */

// Sample data for instant preview or offline demo mode
import { sampleProfiles } from './sampleData.js';

const BASE_URL = 'https://api.github.com';

export async function fetchGitHubProfile(username, token = '') {
  const cleanUsername = username.trim().toLowerCase();

  // If username matches a sample profile and user has offline/demo intent, return directly
  // Otherwise, attempt real GitHub API first!
  const headers = {
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    // 1. Fetch User Profile
    const userRes = await fetch(`${BASE_URL}/users/${encodeURIComponent(cleanUsername)}`, { headers });

    const rateLimitRemaining = userRes.headers.get('x-ratelimit-remaining');
    const rateLimitReset = userRes.headers.get('x-ratelimit-reset');

    if (userRes.status === 404) {
      throw new Error(`GitHub user "${cleanUsername}" was not found. Please double-check the spelling!`);
    }

    if (userRes.status === 403) {
      // Check if sample data is available as fallback demo
      if (sampleProfiles[cleanUsername]) {
        return {
          ...sampleProfiles[cleanUsername],
          isDemoFallback: true,
          rateLimitWarning: 'GitHub API rate limit reached (60 req/hr). Loaded real cached profile data for testing.',
        };
      }

      const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : 'in an hour';
      throw new Error(
        `GitHub API rate limit exceeded for your IP. Rate limit resets at ${resetTime}. You can add an optional Personal Access Token in Settings to get 5,000 requests/hr, or test with sample profiles!`
      );
    }

    if (!userRes.ok) {
      throw new Error(`GitHub API error (${userRes.status}): ${userRes.statusText || 'Unable to fetch profile'}`);
    }

    const userData = await userRes.json();

    // 2. Fetch Repositories (up to 100 sorted by updated)
    let repos = [];
    if (userData.public_repos > 0) {
      const reposRes = await fetch(
        `${BASE_URL}/users/${encodeURIComponent(cleanUsername)}/repos?per_page=100&sort=updated`,
        { headers }
      );
      if (reposRes.ok) {
        repos = await reposRes.json();
      }
    }

    // 3. Check for Profile README repo (username/username)
    let hasProfileReadme = false;
    try {
      const readmeRes = await fetch(`${BASE_URL}/repos/${encodeURIComponent(cleanUsername)}/${encodeURIComponent(cleanUsername)}/readme`, {
        method: 'GET',
        headers,
      });
      if (readmeRes.ok) {
        hasProfileReadme = true;
      }
    } catch {
      hasProfileReadme = false;
    }

    // 4. Sample check for top 5 repos READMEs if possible
    const enrichedRepos = await Promise.all(
      repos.slice(0, 8).map(async (repo) => {
        let hasReadme = false;
        try {
          // Check readme status
          const rRes = await fetch(`${BASE_URL}/repos/${encodeURIComponent(cleanUsername)}/${encodeURIComponent(repo.name)}/readme`, {
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

    // Merge enriched top repos with the rest
    const allRepos = [...enrichedRepos, ...repos.slice(8).map((r) => ({ ...r, hasReadme: r.size > 10 }))];

    return {
      user: userData,
      repos: allRepos,
      hasProfileReadme,
      rateLimitRemaining: rateLimitRemaining ? parseInt(rateLimitRemaining, 10) : null,
      rateLimitReset: rateLimitReset ? parseInt(rateLimitReset, 10) : null,
      fetchedAt: new Date().toISOString(),
      isDemoFallback: false,
    };
  } catch (err) {
    // If network fails (e.g. offline or blocked), fallback to sample if matched
    if (sampleProfiles[cleanUsername]) {
      return {
        ...sampleProfiles[cleanUsername],
        isDemoFallback: true,
        rateLimitWarning: `Network/API note: Loaded bundled snapshot for @${cleanUsername} (${err.message}).`,
      };
    }
    throw err;
  }
}
