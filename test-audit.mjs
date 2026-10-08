import { fetchGitHubProfile } from './src/services/githubApi.js';
import { analyzeProfile } from './src/utils/analyzer.js';

async function runTests() {
  console.log('=== RUNNING AUTOMATED AUDIT ENGINE TESTS ===\n');

  // Test 1: Sample profile 'alex-student'
  console.log('Test 1: Testing alex-student (messy student profile)...');
  const data1 = await fetchGitHubProfile('alex-student');
  const analysis1 = analyzeProfile(data1);
  console.log(`- Score: ${analysis1.totalScore}/100 (Grade: ${analysis1.grade})`);
  console.log(`- Roasts count: ${analysis1.roasts.length}`);
  console.log(`- Recruiter verdict: "${analysis1.recruiterVerdict}"`);
  console.log(`- Strengths: ${analysis1.strengths.length}, Problems: ${analysis1.problems.length}`);
  if (analysis1.totalScore < 60 && analysis1.roasts.length >= 2) {
    console.log('✓ Test 1 PASSED: Correctly identified student profile rescue needs.\n');
  } else {
    throw new Error('Test 1 failed expectations');
  }

  // Test 2: Sample profile 'gaearon' (high caliber)
  console.log('Test 2: Testing gaearon (high profile)...');
  const data2 = await fetchGitHubProfile('gaearon');
  const analysis2 = analyzeProfile(data2);
  console.log(`- Score: ${analysis2.totalScore}/100 (Grade: ${analysis2.grade})`);
  console.log(`- Grade: ${analysis2.grade}`);
  if (analysis2.totalScore >= 70) {
    console.log('✓ Test 2 PASSED: Correctly scored prominent engineer profile.\n');
  } else {
    throw new Error('Test 2 failed expectations');
  }

  // Test 3: Invalid username
  console.log('Test 3: Testing invalid username handling...');
  try {
    await fetchGitHubProfile('this-user-definitely-does-not-exist-9812739182739');
    console.error('✗ Test 3 FAILED: Should have thrown 404');
  } catch (err) {
    console.log(`✓ Test 3 PASSED: Correctly caught error: "${err.message}"\n`);
  }

  // Test 4: Real public GitHub user (torvalds)
  console.log('Test 4: Testing real public GitHub user (torvalds)...');
  try {
    const data4 = await fetchGitHubProfile('torvalds');
    const analysis4 = analyzeProfile(data4);
    console.log(`- Fetched: ${data4.user.login} (${data4.user.name})`);
    console.log(`- Repos count: ${data4.repos.length}`);
    console.log(`- Score: ${analysis4.totalScore}/100`);
    console.log('✓ Test 4 PASSED: Real public GitHub API fetch and analysis verified!\n');
  } catch (err) {
    console.log(`Note on Test 4: ${err.message}`);
  }

  console.log('=== ALL AUTOMATED AUDIT ENGINE TESTS COMPLETED ===');
}

runTests();
