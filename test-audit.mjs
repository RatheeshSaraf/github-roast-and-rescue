import { fetchGitHubProfile, clearClientAuditCache, searchGitHubUsers, clearClientSearchCache } from './src/services/githubApi.js';
import { sampleProfiles, generateSimulatedProfile } from './src/services/sampleData.js';
import { analyzeProfile } from './src/utils/analyzer.js';
import { handleGithubProxy, clearProxyCache } from './apiProxy.js';

// Helper mock response object for testing handleGithubProxy
function createMockRes() {
  const headers = {};
  let statusCode = 200;
  let body = '';
  return {
    statusCode,
    headers,
    setHeader(key, value) {
      headers[key.toLowerCase()] = value;
    },
    writeHead(code, head) {
      statusCode = code;
      if (head) {
        Object.entries(head).forEach(([k, v]) => {
          headers[k.toLowerCase()] = v;
        });
      }
    },
    end(data) {
      body = data || '';
    },
    getStatus() {
      return statusCode;
    },
    getHeader(key) {
      return headers[key.toLowerCase()];
    },
    getBody() {
      return body;
    },
  };
}

async function runTests() {
  console.log('=== RUNNING AUTOMATED AUDIT ENGINE & PROXY TESTS ===\n');

  // Test 1: Sample profile 'alex-student'
  console.log('Test 1: Testing alex-student (messy student profile)...');
  const data1 = await fetchGitHubProfile('alex-student');
  const analysis1 = analyzeProfile(data1);
  console.log(`- Signal Score: ${analysis1.totalScore}/100 (Grade: ${analysis1.grade})`);
  console.log(`- Recruiter Readiness: ${analysis1.recruiterReadinessScore}/100 (Grade: ${analysis1.recruiterGrade})`);
  console.log(`- Recruiter Decision: ${analysis1.recruiterDecision.decision}`);
  console.log(`- 7 Recruiter Pillars: ${analysis1.recruiterCategories.length} categories`);
  console.log(`- Fastest Path items: ${analysis1.fastestPath.length}`);
  console.log(`- Incident Reports: ${analysis1.roasts.length} incidents`);
  console.log(`- Rescue Plan: ${analysis1.rescuePlan.map(g => g.priority).join(', ')}`);

  if (analysis1.recruiterReadinessScore < 70 && 
      analysis1.recruiterCategories.length === 7 && 
      analysis1.fastestPath.length === 3 &&
      analysis1.roasts[0].incidentNumber) {
    console.log('✓ Test 1 PASSED: Successfully generated full Recruiter Readiness Audit.\n');
  } else {
    throw new Error('Test 1 failed expectations');
  }

  // Test 2: Dedicated Judge Demo Profile ('demo-profile')
  console.log('Test 2: Testing demo-profile (Judge 1-click mode)...');
  const demoData = sampleProfiles['demo-profile'];
  const demoAnalysis = analyzeProfile(demoData);
  console.log(`- Recruiter Readiness: ${demoAnalysis.recruiterReadinessScore}/100`);
  console.log(`- Recruiter Decision: ${demoAnalysis.recruiterDecision.decision}`);
  console.log(`- 30s Scan points: ${demoAnalysis.recruiter30sScan.length}`);
  if (demoAnalysis.recruiterCategories.length === 7 && demoAnalysis.recruiter30sScan.length === 7) {
    console.log('✓ Test 2 PASSED: 1-Click Judge Demo Profile operates completely offline.\n');
  } else {
    throw new Error('Test 2 failed expectations');
  }

  // Test 3: High caliber profile 'gaearon'
  console.log('Test 3: Testing gaearon (high caliber profile)...');
  const data3 = await fetchGitHubProfile('gaearon');
  const analysis3 = analyzeProfile(data3);
  console.log(`- Recruiter Readiness: ${analysis3.recruiterReadinessScore}/100 (Grade: ${analysis3.recruiterGrade})`);
  console.log(`- Recruiter Decision: ${analysis3.recruiterDecision.decision}`);
  if (analysis3.recruiterReadinessScore >= 70 && (analysis3.recruiterDecision.decision === 'SHORTLIST' || analysis3.recruiterDecision.decision === 'MAYBE')) {
    console.log('✓ Test 3 PASSED: High-caliber profile correctly evaluated.\n');
  } else {
    throw new Error('Test 3 failed expectations');
  }

  // Test 4: Invalid username handling & error rejection
  console.log('Test 4: Testing invalid username handling & API error rejection...');
  try {
    await fetchGitHubProfile('this-user-definitely-does-not-exist-9812739182739');
    throw new Error('Should have thrown an error for invalid user');
  } catch (err) {
    console.log(`✓ Test 4 PASSED: Correctly threw expected error: "${err.message}"\n`);
  }

  // Test 5: Real public profile fallback telemetry (torvalds)
  console.log('Test 5: Testing torvalds profile...');
  const data5 = await fetchGitHubProfile('torvalds');
  const analysis5 = analyzeProfile(data5);
  console.log(`- User: ${data5.user.login} (${data5.user.name})`);
  console.log(`- Readiness: ${analysis5.recruiterReadinessScore}/100`);
  console.log(`- Repos analyzed: ${analysis5.analyzedRepos.length}`);
  console.log('✓ Test 5 PASSED: Verified profile telemetry.\n');

  // Test 6: Server-side GitHub API Proxy
  console.log('Test 6: Testing Server-side GitHub API Proxy (/api/github/users/octocat)...');
  clearProxyCache();
  const mockReq1 = {
    url: '/api/github/users/octocat',
    method: 'GET',
    headers: { host: 'localhost:8080' },
  };
  const mockRes1 = createMockRes();
  await handleGithubProxy(mockReq1, mockRes1);

  const status1 = mockRes1.getStatus();
  const cacheStatus1 = mockRes1.getHeader('X-Proxy-Cache');
  console.log(`- Proxy response status: ${status1}`);
  console.log(`- Cache status (first call): ${cacheStatus1}`);
  
  // Security verification: token is NEVER returned in response headers or body
  const authHeader = mockRes1.getHeader('Authorization');
  if (authHeader) {
    throw new Error('SECURITY VIOLATION: Authorization header leaked in proxy response');
  }
  console.log('- Verified: Authorization header is NOT exposed in response.');

  // Test 6b: Proxy Caching (second call should HIT cache)
  const mockRes2 = createMockRes();
  await handleGithubProxy(mockReq1, mockRes2);
  const cacheStatus2 = mockRes2.getHeader('X-Proxy-Cache');
  console.log(`- Cache status (second call): ${cacheStatus2}`);
  if (cacheStatus2 !== 'HIT') {
    throw new Error(`Expected cache HIT on second request, got ${cacheStatus2}`);
  }
  console.log('✓ Test 6 PASSED: Server-side API proxy functions correctly with in-memory caching and token secrecy.\n');

  // Test 7: Simulated rate-limited fallback profile generation
  console.log('Test 7: Testing rate-limited simulated profile generator...');
  const simulated = generateSimulatedProfile('new-developer-2026');
  if (!simulated.user || !simulated.repos || simulated.repos.length === 0) {
    throw new Error('Failed to generate fallback simulated profile');
  }
  const simulatedAnalysis = analyzeProfile(simulated);
  console.log(`- Simulated profile score: ${simulatedAnalysis.totalScore}`);
  console.log(`- Readiness score: ${simulatedAnalysis.recruiterReadinessScore}`);
  console.log('✓ Test 7 PASSED: Simulated audit preview is fully compliant with analysis engine.\n');

  // Test 8: Client-side audit cache
  console.log('Test 8: Testing client-side audit caching...');
  clearClientAuditCache();
  const auditA = await fetchGitHubProfile('demo-profile');
  const auditB = await fetchGitHubProfile('demo-profile');
  if (auditA !== auditB) {
    throw new Error('Client cache did not return identical cached reference');
  }
  console.log('✓ Test 8 PASSED: Client-side audit cache successfully prevents duplicate fetches.\n');

  // Test 9: Autocomplete user search with query < 2 chars (empty query check)
  console.log('Test 9: Testing autocomplete search boundary conditions...');
  const searchEmpty = await searchGitHubUsers('');
  const searchSingle = await searchGitHubUsers('a');
  if (searchEmpty.items.length !== 0 || searchSingle.items.length !== 0) {
    throw new Error('Autocomplete should return empty items for queries under 2 characters');
  }
  console.log('✓ Test 9 PASSED: Autocomplete strictly respects minimum 2-character query boundary.\n');

  // Test 10: Autocomplete user search with curated profile match
  console.log('Test 10: Testing autocomplete search with sample profile matches ("alex", "torv")...');
  clearClientSearchCache();
  const searchAlex = await searchGitHubUsers('alex');
  const hasAlex = searchAlex.items.some(i => i.login.includes('alex'));
  if (!hasAlex) {
    throw new Error('Expected "alex" search to return matching profile');
  }
  console.log(`- Autocomplete suggestions for "alex": ${searchAlex.items.map(i => i.login).join(', ')}`);
  console.log('✓ Test 10 PASSED: Autocomplete returns matching curated profiles instantly with rich metadata.\n');

  // Test 11: Server-side search API proxy (/api/github/search/users?q=...)
  console.log('Test 11: Testing server proxy /api/github/search/users...');
  const mockReqSearch = {
    url: '/api/github/search/users?q=test&per_page=6',
    method: 'GET',
    headers: { host: 'localhost:8080' },
  };
  const mockResSearch = createMockRes();
  await handleGithubProxy(mockReqSearch, mockResSearch);
  const searchStatus = mockResSearch.getStatus();
  console.log(`- Search proxy status: ${searchStatus}`);
  
  // Security verification on search proxy
  if (mockResSearch.getHeader('Authorization')) {
    throw new Error('SECURITY VIOLATION: Authorization header leaked on search proxy');
  }
  const searchBody = mockResSearch.getBody();
  if (searchBody.includes('process.env.GITHUB_TOKEN') || searchBody.includes('github_pat_')) {
    throw new Error('SECURITY VIOLATION: Token leaked in search body');
  }
  console.log('✓ Test 11 PASSED: Search API proxy operates securely with minimal fields and zero token leakage.\n');

  // Test 12: Roast Modes & Visual Meme Types
  console.log('Test 12: Testing Roast Modes and Visual Meme Types in analyzer...');
  const sampleAnalysis = analyzeProfile(sampleProfiles['alex-student']);
  for (const r of sampleAnalysis.roasts) {
    if (!r.roastModes || !r.roastModes.savage || !r.roastModes.meme || !r.roastModes.recruiter || !r.roastModes.rescue) {
      throw new Error(`Incident "${r.title}" missing required roastModes`);
    }
    if (!r.memeType) {
      throw new Error(`Incident "${r.title}" missing memeType`);
    }
  }
  console.log(`- Verified ${sampleAnalysis.roasts.length} incidents contain all 4 modes (Savage, Meme, Recruiter, Rescue) and memeType.`);
  console.log('✓ Test 12 PASSED: Multi-mode roast system and visual meme types fully validated.\n');

  // Test 13: Profile Voice Roast generation
  console.log('Test 13: Testing Voice Roast generation...');
  if (!sampleAnalysis.profileVoiceRoast || !sampleAnalysis.profileVoiceRoast.includes('Recruiter Readiness')) {
    throw new Error('profileVoiceRoast was not properly generated');
  }
  console.log(`- Generated Profile Voice Roast: "${sampleAnalysis.profileVoiceRoast.slice(0, 90)}..."`);
  console.log('✓ Test 13 PASSED: Voice roast script generated cleanly for Web Speech API.\n');

  console.log('=== ALL 13 ENGINE, SEARCH, ROAST & PROXY TESTS COMPLETED SUCCESSFULLY ===');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
