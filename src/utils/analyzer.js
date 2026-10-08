/**
 * GitHub Roast & Rescue Analysis Engine
 * Calculates data-driven scores, Recruiter Readiness Score, Explainable Scoring,
 * Recruiter Decisions (Shortlist/Maybe/Needs Work), 30s Recruiter Scans,
 * Incident Report Roasts, Evidence-Based Strengths & Red Flags,
 * and Prioritized Rescue Roadmaps (Do Today, This Week, This Month).
 */

export function analyzeProfile(data) {
  const { user, repos = [], hasProfileReadme = false } = data;

  const totalRepos = repos.length;
  const nonForkRepos = repos.filter((r) => !r.fork);
  const forkedRepos = repos.filter((r) => r.fork);

  // Statistics
  const reposWithDesc = repos.filter((r) => r.description && r.description.trim().length > 3);
  const reposWithDemo = repos.filter((r) => r.homepage && r.homepage.trim().length > 0);
  const reposWithReadme = repos.filter((r) => r.hasReadme);
  const languages = [...new Set(repos.map((r) => r.language).filter(Boolean))];
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);

  // Activity checks
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const hasPushedLast30Days = repos.some((r) => r.pushed_at && new Date(r.pushed_at) > thirtyDaysAgo);
  const hasPushedLast90Days = repos.some((r) => r.pushed_at && new Date(r.pushed_at) > ninetyDaysAgo);

  // Generic scratchpad/homework repo names
  const genericNames = ['test', 'demo', 'app', 'project', 'my-app', 'untitled', 'final', 'homework', 'assignment', 'temp', 'lab'];
  const poorNamedRepos = repos.filter((r) => {
    const lower = r.name.toLowerCase();
    return genericNames.some((g) => lower === g || lower.startsWith(`${g}-`) || lower.endsWith(`-${g}`));
  });

  // ==========================================
  // 1. ORIGINAL GITHUB SIGNAL SCORE (Preserved)
  // ==========================================
  let scoreProfile = 0;
  if (user.name) scoreProfile += 3;
  if (user.bio && user.bio.trim().length > 10) scoreProfile += 4;
  else if (user.bio) scoreProfile += 2;
  if (user.avatar_url) scoreProfile += 2;
  if (user.location || user.company) scoreProfile += 2;
  if (hasProfileReadme) scoreProfile += 4;
  scoreProfile = Math.min(15, scoreProfile);

  let scorePresentation = 0;
  if (totalRepos > 0) {
    const descRatio = reposWithDesc.length / totalRepos;
    scorePresentation += Math.round(descRatio * 10);
    const demoRatio = reposWithDemo.length / Math.min(5, totalRepos);
    scorePresentation += Math.round(Math.min(1, demoRatio) * 6);
    const cleanNamesRatio = Math.max(0, 1 - poorNamedRepos.length / totalRepos);
    scorePresentation += Math.round(cleanNamesRatio * 5);
    const hasTopics = repos.some((r) => r.topics && r.topics.length > 0);
    if (hasTopics) scorePresentation += 4;
  }
  scorePresentation = Math.min(25, scorePresentation);

  let scoreActivity = 0;
  if (hasPushedLast30Days) scoreActivity += 8;
  else if (hasPushedLast90Days) scoreActivity += 4;
  else scoreActivity += 1;

  const accountAgeYears = (now - new Date(user.created_at)) / (1000 * 60 * 60 * 24 * 365);
  if (accountAgeYears >= 1) scoreActivity += 4;
  else scoreActivity += 2;

  if (totalRepos >= 5) scoreActivity += 3;
  else if (totalRepos >= 2) scoreActivity += 2;
  scoreActivity = Math.min(15, scoreActivity);

  let scoreReadme = 0;
  if (hasProfileReadme) scoreReadme += 5;
  if (totalRepos > 0) {
    const readmeRatio = reposWithReadme.length / Math.min(8, totalRepos);
    scoreReadme += Math.round(Math.min(1, readmeRatio) * 10);
  }
  scoreReadme = Math.min(15, scoreReadme);

  let scoreDiversity = 0;
  if (languages.length >= 4) scoreDiversity = 10;
  else if (languages.length >= 2) scoreDiversity = 7;
  else if (languages.length === 1) scoreDiversity = 4;
  else scoreDiversity = 1;

  let scoreDepth = 0;
  if (totalRepos > 0) {
    const originalRatio = nonForkRepos.length / totalRepos;
    scoreDepth += Math.round(originalRatio * 4);
    if (totalStars >= 50) scoreDepth += 3;
    else if (totalStars >= 5) scoreDepth += 2;
    else if (totalStars >= 1) scoreDepth += 1;

    const hasSubstantialRepo = repos.some((r) => r.size > 200);
    if (hasSubstantialRepo) scoreDepth += 3;
    else scoreDepth += 1;
  }
  scoreDepth = Math.min(10, scoreDepth);

  let scoreRecruiter = 0;
  if (user.blog || user.twitter_username) scoreRecruiter += 3;
  if (reposWithDesc.length >= 2 && reposWithReadme.length >= 2) scoreRecruiter += 4;
  if (poorNamedRepos.length <= 1) scoreRecruiter += 3;
  scoreRecruiter = Math.min(10, scoreRecruiter);

  const totalScore = Math.min(
    100,
    Math.round(scoreProfile + scorePresentation + scoreActivity + scoreReadme + scoreDiversity + scoreDepth + scoreRecruiter)
  );

  let grade = 'F';
  let gradeColor = 'text-red-500 border-red-500/40 bg-red-500/10';
  if (totalScore >= 90) {
    grade = 'S';
    gradeColor = 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10';
  } else if (totalScore >= 80) {
    grade = 'A';
    gradeColor = 'text-green-400 border-green-400/40 bg-green-400/10';
  } else if (totalScore >= 70) {
    grade = 'B';
    gradeColor = 'text-blue-400 border-blue-400/40 bg-blue-400/10';
  } else if (totalScore >= 60) {
    grade = 'C';
    gradeColor = 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10';
  } else if (totalScore >= 45) {
    grade = 'D';
    gradeColor = 'text-orange-400 border-orange-400/40 bg-orange-400/10';
  }

  const scoreCategories = [
    { name: 'Profile Completeness', score: scoreProfile, max: 15, weight: '15%' },
    { name: 'Project Presentation', score: scorePresentation, max: 25, weight: '25%' },
    { name: 'Activity', score: scoreActivity, max: 15, weight: '15%' },
    { name: 'README Quality', score: scoreReadme, max: 15, weight: '15%' },
    { name: 'Technical Diversity', score: scoreDiversity, max: 10, weight: '10%' },
    { name: 'Project Depth/Signals', score: scoreDepth, max: 10, weight: '10%' },
    { name: 'Recruiter Readiness', score: scoreRecruiter, max: 10, weight: '10%' },
  ];

  // ========================================================
  // 2. PRIORITY 1 & 2: RECRUITER READINESS SCORE & EXPLAINABLE
  // ========================================================
  // 7 Observable Recruiter Pillars:
  // 1. Profile Credibility (15)
  // 2. Project Quality (20)
  // 3. Documentation (20)
  // 4. Consistency (15)
  // 5. Activity (10)
  // 6. Technical Signals (10)
  // 7. Recruiter First Impression (10)

  // 1. Profile Credibility (15 pts)
  let credScore = 0;
  const credPositives = [];
  const credProblems = [];
  if (user.name) {
    credScore += 4;
    credPositives.push(`Real full name displayed ("${user.name}")`);
  } else {
    credProblems.push('No real name displayed; only username visible');
  }
  if (user.avatar_url) {
    credScore += 3;
    credPositives.push('Custom avatar image set');
  }
  if (user.bio && user.bio.trim().length >= 15) {
    credScore += 4;
    credPositives.push('Professional bio set with role context');
  } else if (user.bio) {
    credScore += 2;
    credProblems.push('Bio is brief; under 15 characters');
  } else {
    credProblems.push('Missing profile bio');
  }
  if (user.location || user.company) {
    credScore += 2;
    credPositives.push(`Context provided (${[user.location, user.company].filter(Boolean).join(' • ')})`);
  } else {
    credProblems.push('No location or company listed');
  }
  if (user.blog || user.twitter_username) {
    credScore += 2;
    credPositives.push('External portfolio or social link verified');
  } else {
    credProblems.push('No external portfolio/LinkedIn/website linked');
  }
  credScore = Math.min(15, credScore);

  // 2. Project Quality (20 pts)
  let projScore = 0;
  const projPositives = [];
  const projProblems = [];
  if (totalRepos > 0) {
    const descRatio = reposWithDesc.length / totalRepos;
    const descPts = Math.round(descRatio * 8);
    projScore += descPts;
    if (descRatio >= 0.7) {
      projPositives.push(`${reposWithDesc.length} of ${totalRepos} repos have clear descriptions (${Math.round(descRatio * 100)}%)`);
    } else {
      projProblems.push(`${totalRepos - reposWithDesc.length} repos lack project descriptions`);
    }

    const demoPts = Math.min(6, reposWithDemo.length * 3);
    projScore += demoPts;
    if (reposWithDemo.length > 0) {
      projPositives.push(`${reposWithDemo.length} repository contains working live demo URL`);
    } else {
      projProblems.push('0 live demo links found; recruiters must inspect raw code');
    }

    const cleanNamesRatio = Math.max(0, 1 - poorNamedRepos.length / totalRepos);
    projScore += Math.round(cleanNamesRatio * 4);
    if (poorNamedRepos.length === 0) {
      projPositives.push('Repositories follow clean, professional naming conventions');
    } else {
      projProblems.push(`${poorNamedRepos.length} repository names appear to be generic/scratchpad (${poorNamedRepos.slice(0, 2).map((r) => r.name).join(', ')})`);
    }

    const origRatio = nonForkRepos.length / totalRepos;
    if (origRatio >= 0.7) {
      projScore += 2;
      projPositives.push(`${nonForkRepos.length} original, non-forked repositories`);
    } else {
      projProblems.push(`${forkedRepos.length} repositories are forks rather than original builds`);
    }
  } else {
    projProblems.push('Zero public repositories available for evaluation');
  }
  projScore = Math.min(20, projScore);

  // 3. Documentation (20 pts)
  let docScore = 0;
  const docPositives = [];
  const docProblems = [];
  if (hasProfileReadme) {
    docScore += 6;
    docPositives.push(`Profile README active at github.com/${user.login}/${user.login}`);
  } else {
    docProblems.push('Missing personal profile README (username/username)');
  }
  if (totalRepos > 0) {
    const readmeRatio = reposWithReadme.length / totalRepos;
    const readmePts = Math.round(readmeRatio * 14);
    docScore += Math.min(14, readmePts);
    if (reposWithReadme.length >= 3) {
      docPositives.push(`${reposWithReadme.length} repositories contain markdown README files`);
    } else if (reposWithReadme.length > 0) {
      docPositives.push(`${reposWithReadme.length} repository has a README file`);
      docProblems.push(`${totalRepos - reposWithReadme.length} repositories lack README documentation`);
    } else {
      docProblems.push('No repository README documentation detected');
    }
  }
  docScore = Math.min(20, docScore);

  // 4. Consistency (15 pts)
  let constScore = 0;
  const constPositives = [];
  const constProblems = [];
  if (accountAgeYears >= 2) {
    constScore += 6;
    constPositives.push(`Account established over ${Math.floor(accountAgeYears)} years ago`);
  } else if (accountAgeYears >= 0.5) {
    constScore += 4;
    constPositives.push('Account established over 6 months ago');
  } else {
    constScore += 2;
    constProblems.push('Newer GitHub account with under 6 months history');
  }

  if (totalRepos >= 6) {
    constScore += 5;
    constPositives.push(`${totalRepos} public repositories demonstrates sustained output`);
  } else if (totalRepos >= 3) {
    constScore += 3;
    constPositives.push(`${totalRepos} public repositories`);
  } else {
    constProblems.push('Fewer than 3 public repositories published');
  }

  const updatedRecentlyCount = repos.filter((r) => r.pushed_at && new Date(r.pushed_at) > ninetyDaysAgo).length;
  if (updatedRecentlyCount >= 3) {
    constScore += 4;
    constPositives.push(`${updatedRecentlyCount} projects maintained within last 90 days`);
  } else if (updatedRecentlyCount >= 1) {
    constScore += 2;
    constPositives.push('At least 1 project updated in the past quarter');
  } else {
    constProblems.push('No repositories updated in over 90 days');
  }
  constScore = Math.min(15, constScore);

  // 5. Activity (10 pts)
  let actScore = 0;
  const actPositives = [];
  const actProblems = [];
  if (hasPushedLast30Days) {
    actScore += 8;
    actPositives.push('Active push activity detected in the last 30 days');
  } else if (hasPushedLast90Days) {
    actScore += 4;
    actPositives.push('Activity within last 90 days');
    actProblems.push('No code pushed in the past 30 days');
  } else {
    actScore += 1;
    actProblems.push('No code updates in over 90 days (dormant profile)');
  }
  if (repos.some((r) => r.pushed_at && new Date(r.pushed_at) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000))) {
    actScore += 2;
    actPositives.push('Fresh commit activity within the past 7 days');
  }
  actScore = Math.min(10, actScore);

  // 6. Technical Signals (10 pts)
  let techScore = 0;
  const techPositives = [];
  const techProblems = [];
  if (languages.length >= 3) {
    techScore += 4;
    techPositives.push(`Multi-language versatility across ${languages.length} stacks (${languages.slice(0, 3).join(', ')})`);
  } else if (languages.length === 2) {
    techScore += 3;
    techPositives.push(`Dual-stack breadth (${languages.join(', ')})`);
  } else if (languages.length === 1) {
    techScore += 2;
    techProblems.push(`Single language focus (${languages[0]}) visible in repos`);
  } else {
    techProblems.push('No primary code languages indexed in repositories');
  }

  const reposWithTopics = repos.filter((r) => r.topics && r.topics.length > 0);
  if (reposWithTopics.length >= 2) {
    techScore += 3;
    techPositives.push(`${reposWithTopics.length} repositories tagged with discoverability topics`);
  } else {
    techProblems.push('Repositories lack topics/tags (#react, #api, etc.)');
  }

  if (totalStars >= 10) {
    techScore += 3;
    techPositives.push(`${totalStars} total stars earned across public projects`);
  } else if (totalStars >= 1) {
    techScore += 2;
    techPositives.push(`${totalStars} repository star from developer community`);
  } else {
    techProblems.push('Zero community stars or external engagement');
  }
  techScore = Math.min(10, techScore);

  // 7. Recruiter First Impression (10 pts)
  let firstImpScore = 0;
  const firstImpPositives = [];
  const firstImpProblems = [];
  if (user.bio && !user.bio.toLowerCase().includes('aspiring')) {
    firstImpScore += 3;
    firstImpPositives.push('Confident elevator pitch without minimizing language');
  } else if (user.bio && user.bio.toLowerCase().includes('aspiring')) {
    firstImpScore += 1;
    firstImpProblems.push('Bio uses "aspiring", diluting senior recruiter authority');
  } else {
    firstImpProblems.push('Missing bio on initial hero glance');
  }

  if (reposWithDesc.length >= 3 && reposWithReadme.length >= 2) {
    firstImpScore += 4;
    firstImpPositives.push('Top projects are immediately self-explanatory');
  } else {
    firstImpProblems.push('Hiring manager must dig to understand what projects do');
  }

  if (poorNamedRepos.length <= 1) {
    firstImpScore += 3;
    firstImpPositives.push('No clutter or obvious homework projects on top of profile');
  } else {
    firstImpProblems.push('Generic names ("final", "test") appear in top repository list');
  }
  firstImpScore = Math.min(10, firstImpScore);

  const recruiterReadinessScore = Math.min(
    100,
    Math.round(credScore + projScore + docScore + constScore + actScore + techScore + firstImpScore)
  );

  let recruiterGrade = 'F';
  let recruiterGradeColor = 'text-red-400 border-red-500/40 bg-red-950/40';
  if (recruiterReadinessScore >= 90) {
    recruiterGrade = 'A+';
    recruiterGradeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  } else if (recruiterReadinessScore >= 80) {
    recruiterGrade = 'A';
    recruiterGradeColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
  } else if (recruiterReadinessScore >= 75) {
    recruiterGrade = 'B+';
    recruiterGradeColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40';
  } else if (recruiterReadinessScore >= 70) {
    recruiterGrade = 'B';
    recruiterGradeColor = 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40';
  } else if (recruiterReadinessScore >= 60) {
    recruiterGrade = 'C+';
    recruiterGradeColor = 'text-amber-400 border-amber-500/40 bg-amber-950/40';
  } else if (recruiterReadinessScore >= 50) {
    recruiterGrade = 'C';
    recruiterGradeColor = 'text-amber-400 border-amber-500/40 bg-amber-950/40';
  } else if (recruiterReadinessScore >= 40) {
    recruiterGrade = 'D';
    recruiterGradeColor = 'text-orange-400 border-orange-500/40 bg-orange-950/40';
  }

  // 7 Explainable Recruiter Categories
  const recruiterCategories = [
    {
      id: 'credibility',
      name: 'Profile Credibility',
      score: credScore,
      max: 15,
      weight: '15%',
      positiveSignals: credPositives.length > 0 ? credPositives : ['Basic profile identity active'],
      problems: credProblems.length > 0 ? credProblems : ['No major credibility issues detected'],
      recruiterImpact: 'High',
      recommendedAction: !user.name || !user.bio ? 'Add full name and a focused 1-sentence value proposition bio.' : 'Link your personal portfolio or LinkedIn profile in settings.',
    },
    {
      id: 'project-quality',
      name: 'Project Quality',
      score: projScore,
      max: 20,
      weight: '20%',
      positiveSignals: projPositives.length > 0 ? projPositives : ['Repositories initialized on GitHub'],
      problems: projProblems.length > 0 ? projProblems : ['Repository presentation meets baseline standards'],
      recruiterImpact: 'High',
      recommendedAction: reposWithDemo.length === 0 ? 'Deploy your top web project to Vercel/Netlify and link it in the repo header.' : 'Add 15-word descriptions explaining the problem each repository solves.',
    },
    {
      id: 'documentation',
      name: 'Documentation',
      score: docScore,
      max: 20,
      weight: '20%',
      positiveSignals: docPositives.length > 0 ? docPositives : ['Code files publicly visible'],
      problems: docProblems.length > 0 ? docProblems : ['Documentation standards are solid'],
      recruiterImpact: 'High',
      recommendedAction: !hasProfileReadme ? `Create repository github.com/${user.login}/${user.login} with a structured README.` : 'Add READMEs to your top 3 repos covering: Overview, Tech Stack, and Setup instructions.',
    },
    {
      id: 'consistency',
      name: 'Consistency',
      score: constScore,
      max: 15,
      weight: '15%',
      positiveSignals: constPositives.length > 0 ? constPositives : ['GitHub account registered'],
      problems: constProblems.length > 0 ? constProblems : ['Consistent history across repositories'],
      recruiterImpact: 'Medium',
      recommendedAction: 'Keep publishing code updates consistently rather than bursting and going dormant.',
    },
    {
      id: 'activity',
      name: 'Activity',
      score: actScore,
      max: 10,
      weight: '10%',
      positiveSignals: actPositives.length > 0 ? actPositives : ['Account history recorded'],
      problems: actProblems.length > 0 ? actProblems : ['Active momentum verified'],
      recruiterImpact: 'High',
      recommendedAction: !hasPushedLast30Days ? 'Push a small polish or dependency update to show recent momentum.' : 'Maintain weekly commit streaks on your primary project.',
    },
    {
      id: 'tech-signals',
      name: 'Technical Signals',
      score: techScore,
      max: 10,
      weight: '10%',
      positiveSignals: techPositives.length > 0 ? techPositives : ['Language detected'],
      problems: techProblems.length > 0 ? techProblems : ['Clean technical breadth'],
      recruiterImpact: 'Medium',
      recommendedAction: 'Add topics (e.g. #react, #typescript, #docker) to top repositories for searchability.',
    },
    {
      id: 'first-impression',
      name: 'Recruiter First Impression',
      score: firstImpScore,
      max: 10,
      weight: '10%',
      positiveSignals: firstImpPositives.length > 0 ? firstImpPositives : ['Profile opens without fatal errors'],
      problems: firstImpProblems.length > 0 ? firstImpProblems : ['Strong initial visual impact'],
      recruiterImpact: 'High',
      recommendedAction: 'Pin your top 3 cleanest projects so recruiters see flagship code immediately.',
    },
  ];

  // ==========================================
  // 3. PRIORITY 3: RECRUITER DECISION PANEL
  // ==========================================
  let decision = 'NEEDS WORK';
  let decisionBadgeColor = 'bg-red-950/60 border-red-500/50 text-red-300';
  let decisionIconColor = 'text-red-400';
  if (recruiterReadinessScore >= 75) {
    decision = 'SHORTLIST';
    decisionBadgeColor = 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300';
    decisionIconColor = 'text-emerald-400';
  } else if (recruiterReadinessScore >= 50) {
    decision = 'MAYBE';
    decisionBadgeColor = 'bg-amber-950/60 border-amber-500/50 text-amber-300';
    decisionIconColor = 'text-amber-400';
  }

  const whyPositive = [];
  if (hasPushedLast30Days) whyPositive.push('Strong recent project activity within the last 30 days');
  if (reposWithDesc.length >= 3) whyPositive.push('Several relevant repositories with descriptions');
  if (reposWithDemo.length > 0) whyPositive.push('Live interactive deployment link available to test');
  if (languages.length >= 2) whyPositive.push(`Visible experience in ${languages.slice(0, 2).join(' & ')}`);
  if (hasProfileReadme) whyPositive.push('Professional Profile README welcoming visitors');
  if (whyPositive.length === 0) whyPositive.push('Demonstrated initiative by sharing public GitHub code');

  const whyWarnings = [];
  if (reposWithReadme.length < Math.min(3, totalRepos)) whyWarnings.push('Weak or missing README documentation on key projects');
  if (reposWithDemo.length === 0 && totalRepos > 0) whyWarnings.push('Zero live demo links; recruiters rarely clone code locally');
  if (!user.bio || user.bio.trim().length === 0) whyWarnings.push('Missing bio summary; target engineering role is unclear');
  if (poorNamedRepos.length > 0) whyWarnings.push('Inconsistent project presentation (unclear scratchpad names)');
  if (!hasPushedLast30Days && totalRepos > 0) whyWarnings.push('No code pushed in the last 30 days');
  if (whyWarnings.length === 0) whyWarnings.push('A few project READMEs could benefit from architecture diagrams');

  const quickFixCount = Math.min(4, whyWarnings.length);
  const quickFixSummary = `${quickFixCount} targeted improvements could significantly improve your recruiter first impression.`;

  // =======================================================
  // 4. PRIORITY 4: WHAT A RECRUITER SEES IN 30 SECONDS
  // =======================================================
  const recruiter30sScan = [
    {
      id: 'identity',
      touchpoint: '1. Profile Identity',
      status: user.name && user.avatar_url ? 'GOOD' : user.avatar_url ? 'WATCH' : 'PROBLEM',
      evidence: user.name
        ? `Full name "${user.name}" and avatar clear.`
        : 'Missing real name; hard to cross-reference on LinkedIn.',
      recruiterThought: user.name
        ? '"Legitimate profile with identifiable developer."'
        : '"Anonymous handle; I cannot confirm who this is."',
    },
    {
      id: 'bio',
      touchpoint: '2. Bio / Elevator Pitch',
      status: user.bio && user.bio.length >= 20 && !user.bio.toLowerCase().includes('aspiring') ? 'GOOD' : user.bio ? 'WATCH' : 'PROBLEM',
      evidence: user.bio
        ? user.bio.toLowerCase().includes('aspiring')
          ? 'Bio uses "aspiring", which diminishes perceived seniority.'
          : `Clear summary: "${user.bio.slice(0, 50)}..."`
        : 'Blank bio; target role unknown in first 5 seconds.',
      recruiterThought: user.bio
        ? '"I know what they build and their focus."'
        : '"What role are they even applying for?"',
    },
    {
      id: 'pinned',
      touchpoint: '3. Pinned / Flagship Work',
      status: reposWithDesc.length >= 2 && reposWithReadme.length >= 2 ? 'GOOD' : totalRepos >= 2 ? 'WATCH' : 'PROBLEM',
      evidence: reposWithDesc.length >= 2
        ? 'Standout projects with descriptions immediately visible.'
        : 'Strongest projects are buried under generic repositories.',
      recruiterThought: reposWithDesc.length >= 2
        ? '"I can immediately click their best project."'
        : '"Too much clutter; where is their actual flagship code?"',
    },
    {
      id: 'activity',
      touchpoint: '4. Recent Activity',
      status: hasPushedLast30Days ? 'GOOD' : hasPushedLast90Days ? 'WATCH' : 'PROBLEM',
      evidence: hasPushedLast30Days
        ? 'Committed code within the last 30 days.'
        : hasPushedLast90Days
        ? 'Active this quarter, but no commits in past 30 days.'
        : 'No updates in over 90 days; looks inactive.',
      recruiterThought: hasPushedLast30Days
        ? '"They are coding right now."'
        : '"Did they abandon this profile months ago?"',
    },
    {
      id: 'repo-quality',
      touchpoint: '5. Repository Presentation',
      status: poorNamedRepos.length === 0 && reposWithDesc.length / Math.max(1, totalRepos) >= 0.6 ? 'GOOD' : poorNamedRepos.length <= 1 ? 'WATCH' : 'PROBLEM',
      evidence: `${reposWithDesc.length} of ${totalRepos} repos have descriptions; ${poorNamedRepos.length} vague names.`,
      recruiterThought: reposWithDesc.length >= Math.ceil(totalRepos * 0.6)
        ? '"Clean, well-curated project titles and briefs."'
        : '"Looks like unorganized homework folders."',
    },
    {
      id: 'documentation',
      touchpoint: '6. Documentation & READMEs',
      status: hasProfileReadme && reposWithReadme.length >= 2 ? 'GOOD' : reposWithReadme.length >= 1 ? 'WATCH' : 'PROBLEM',
      evidence: hasProfileReadme
        ? 'Profile README present; projects have markdown guides.'
        : 'No profile README; repos lack setup instructions.',
      recruiterThought: reposWithReadme.length >= 2
        ? '"They know how to communicate technical architecture."'
        : '"Nobody on my team could run this without documentation."',
    },
    {
      id: 'tech-signals',
      touchpoint: '7. Technical Signals & Demos',
      status: reposWithDemo.length >= 1 && languages.length >= 2 ? 'GOOD' : reposWithDemo.length >= 1 || languages.length >= 2 ? 'WATCH' : 'PROBLEM',
      evidence: `${reposWithDemo.length} live demos; languages: ${languages.slice(0, 3).join(', ') || 'None'}.`,
      recruiterThought: reposWithDemo.length >= 1
        ? '"One-click live demo! I can see it working right now."'
        : '"No live link; I do not have time to clone and build locally."',
    },
  ];

  // ========================================================
  // 5. PRIORITY 5: YOUR FASTEST PATH TO +15
  // ========================================================
  const fastestPath = [];

  if (!hasProfileReadme) {
    fastestPath.push({
      step: '01',
      title: 'CREATE YOUR PROFILE README',
      priority: 'HIGH',
      estimatedImpact: '+5',
      problem: `github.com/${user.login}/${user.login} is completely uninitialized.`,
      action: `Create a repository named "${user.login}", check "Add README", and introduce your skills, flagship projects, and LinkedIn/contact links.`,
      effort: '⚡ 10 minutes',
    });
  }

  if (reposWithDesc.length < totalRepos) {
    fastestPath.push({
      step: fastestPath.length === 0 ? '01' : '02',
      title: 'ADD CRISP DESCRIPTIONS TO REPOSITORIES',
      priority: 'HIGH',
      estimatedImpact: '+4',
      problem: `${totalRepos - reposWithDesc.length} repositories have blank "About" descriptions.`,
      action: 'Click the gear icon next to "About" in your top repos and write a 1-sentence summary: "What it does + primary tech stack".',
      effort: '⚡ 5 minutes',
    });
  }

  if (reposWithDemo.length === 0 && totalRepos > 0) {
    fastestPath.push({
      step: fastestPath.length === 0 ? '01' : fastestPath.length === 1 ? '02' : '03',
      title: 'DEPLOY & LINK A 1-CLICK LIVE DEMO',
      priority: 'HIGH',
      estimatedImpact: '+4',
      problem: 'Recruiters cannot test your web projects without cloning code locally.',
      action: 'Deploy your top frontend or full-stack project to free cloud hosting (Vercel, Netlify, or GitHub Pages) and paste the live URL into the repository About link.',
      effort: '🛠 15 minutes',
    });
  }

  if (fastestPath.length < 3 && reposWithReadme.length < Math.min(3, totalRepos)) {
    fastestPath.push({
      step: String(fastestPath.length + 1).padStart(2, '0'),
      title: 'ADD STRUCTURED README TO STRONGEST REPOS',
      priority: 'HIGH',
      estimatedImpact: '+4',
      problem: 'Strongest projects lack a README file explaining what they do.',
      action: 'Use the built-in README generator below to add Problem, Features, Tech Stack, and Setup steps to your best project.',
      effort: '🛠 15 minutes',
    });
  }

  if (fastestPath.length < 3 && poorNamedRepos.length > 0) {
    fastestPath.push({
      step: String(fastestPath.length + 1).padStart(2, '0'),
      title: 'CLEAN SCRATCHPAD REPOSITORY NAMES',
      priority: 'MEDIUM',
      estimatedImpact: '+3',
      problem: `Found generic names (${poorNamedRepos.slice(0, 2).map((r) => r.name).join(', ')}) cluttering your public list.`,
      action: 'Rename homework or test repos to self-explanatory names, or make them private.',
      effort: '⚡ 5 minutes',
    });
  }

  if (fastestPath.length < 3 && (!user.bio || user.bio.toLowerCase().includes('aspiring'))) {
    fastestPath.push({
      step: String(fastestPath.length + 1).padStart(2, '0'),
      title: 'UPGRADE VALUE-PROPOSITION BIO',
      priority: 'MEDIUM',
      estimatedImpact: '+3',
      problem: !user.bio ? 'Bio is currently blank.' : 'Bio uses "aspiring", diluting developer authority.',
      action: 'Write a 1-sentence bio stating what you engineer (e.g. "Full-Stack Engineer building scalable web apps with React, Node.js & TypeScript").',
      effort: '⚡ 2 minutes',
    });
  }

  if (fastestPath.length < 3 && totalRepos === 0) {
    fastestPath.push({
      step: '03',
      title: 'BUILD & PUBLISH YOUR FIRST PROJECT',
      priority: 'HIGH',
      estimatedImpact: '+5',
      problem: 'Zero public repositories published on your GitHub profile.',
      action: 'Publish at least one well-documented application with clean code to demonstrate real engineering ability.',
      effort: '🔥 1–2 hours',
    });
  }

  if (fastestPath.length < 3) {
    fastestPath.push({
      step: '03',
      title: 'PIN YOUR TOP FLAGSHIP REPOSITORIES',
      priority: 'MEDIUM',
      estimatedImpact: '+3',
      problem: 'Recruiters see default chronological repo order instead of your best work.',
      action: 'Use "Customize your pins" on your GitHub profile page to curate your top projects.',
      effort: '⚡ 2 minutes',
    });
  }

  if (fastestPath.length < 3) {
    fastestPath.push({
      step: '03',
      title: 'TAG REPOSITORIES WITH DISCOVERABILITY TOPICS',
      priority: 'MEDIUM',
      estimatedImpact: '+3',
      problem: 'Repositories lack keyword topics (#react, #typescript, #fullstack).',
      action: 'Add 3–5 technology tags to each repository to improve recruiter search discoverability.',
      effort: '⚡ 5 minutes',
    });
  }

  // Ensure exactly top 3 with clean steps
  const topFastestPath = fastestPath.slice(0, 3).map((item, idx) => ({
    ...item,
    step: String(idx + 1).padStart(2, '0'),
  }));

  // ========================================================
  // 6. PRIORITY 6 & FEATURE 6, 9: INCIDENT REPORT ROASTS & MODES
  // ========================================================
  const roasts = [];

  if (!user.bio || user.bio.trim().length === 0) {
    roasts.push({
      incidentNumber: 'INCIDENT #01',
      title: 'THE STEALTH OPERATIVE',
      severity: 'HIGH',
      category: 'Profile Identity',
      memeType: 'bio',
      evidence: 'Bio status: 0 characters. No professional summary provided on profile header.',
      recruiterImpact: 'A recruiter spending 10 seconds has zero idea what engineering role or stack you specialize in.',
      roast: 'Bio status: classified information. Even Area 51 has more public disclosure than your GitHub bio.',
      roastModes: {
        savage: 'Bio status: classified information. Even Area 51 has more public disclosure than your GitHub bio.',
        meme: 'Bio: ██████████. Recruiter radar: completely blind.',
        recruiter: 'Screeners need an elevator pitch within 5 seconds. Without a bio, hiring managers cannot tell what role you target.',
        rescue: 'Add a 1-sentence bio stating your specialty (e.g. "Full-Stack Dev specializing in React, Node & TypeScript").',
      },
      rescue: 'Add a 1-sentence bio stating your core stack and what you love building (e.g., "Full-Stack Dev building real-time apps with TypeScript & Go").',
      expectedImprovement: 'HIGH',
    });
  } else if (user.bio.toLowerCase().includes('aspiring')) {
    roasts.push({
      incidentNumber: 'INCIDENT #01',
      title: 'THE IMPOSTER SYNDROME TRAP',
      severity: 'MEDIUM',
      category: 'Profile Credibility',
      memeType: 'imposter',
      evidence: 'Bio contains the qualifier "aspiring" instead of declaring engineering focus.',
      recruiterImpact: 'Recruiters and automated screeners look for developers ready to contribute on day one.',
      roast: 'Calling yourself an "aspiring developer" is like a chef calling themselves an "aspiring pancake flipper". You commit code—you ARE a developer!',
      roastModes: {
        savage: 'Calling yourself an "aspiring developer" is like a chef calling themselves an "aspiring pancake flipper". You commit code—you ARE a developer!',
        meme: 'Aspiring? Bro, you literally push code. Delete "aspiring", you are an engineer.',
        recruiter: 'Hiring managers screen for immediate contributors. Words like "aspiring" lower your perceived seniority on paper.',
        rescue: 'Drop "aspiring". Lead with authority: "Software Engineer building modern web apps".',
      },
      rescue: 'Drop the word "aspiring". Replace it with: "Software Engineer specializing in React & Node.js" or whatever your focus is.',
      expectedImprovement: 'MEDIUM',
    });
  }

  const descMissingCount = totalRepos - reposWithDesc.length;
  if (descMissingCount > 0 && descMissingCount >= Math.ceil(totalRepos * 0.3)) {
    roasts.push({
      incidentNumber: `INCIDENT #${String(roasts.length + 1).padStart(2, '0')}`,
      title: 'THE SILENT CINEMA',
      severity: 'HIGH',
      category: 'Project Discoverability',
      memeType: 'missing-desc',
      evidence: `${descMissingCount} of ${totalRepos} repositories have completely blank "About" descriptions.`,
      recruiterImpact: 'Hiring managers scanning 10 repos will not open each one to guess what it does.',
      roast: `Your repositories have mastered the art of saying absolutely nothing. ${descMissingCount} repos with blank descriptions—recruiter telepathy DLC is not installed.`,
      roastModes: {
        savage: `Your repositories have mastered the art of saying absolutely nothing. ${descMissingCount} repos with blank descriptions—recruiter telepathy DLC is not installed.`,
        meme: `3 repos. 0 descriptions. Recruiter telepathy DLC not installed.`,
        recruiter: 'A recruiter spending 30 seconds skims repository summaries. Blank descriptions cause screeners to skip to the next candidate.',
        rescue: 'Add a 1-sentence description to each repository: "What problem it solves + primary tech stack".',
      },
      rescue: 'Go to each repo, click the gear icon in the About section, and write a 1-sentence synopsis of what problem it solves.',
      expectedImprovement: 'HIGH',
    });
  }

  if (!hasProfileReadme) {
    roasts.push({
      incidentNumber: `INCIDENT #${String(roasts.length + 1).padStart(2, '0')}`,
      title: 'THE MISSING WELCOME MAT',
      severity: 'HIGH',
      category: 'Documentation',
      memeType: 'missing-profile-readme',
      evidence: `Repository github.com/${user.login}/${user.login} does not exist.`,
      recruiterImpact: 'Missing the single highest-converting personal billboard on the entire GitHub platform.',
      roast: `Profile README: apparently considered optional DLC in your timeline. You have an entire billboard at github.com/${user.login}/${user.login} that you left completely blank!`,
      roastModes: {
        savage: `Profile README: apparently considered optional DLC in your timeline. You have an entire billboard at github.com/${user.login}/${user.login} that you left completely blank!`,
        meme: `Prime GitHub billboard real estate: currently a tumbleweed ghost town.`,
        recruiter: 'A custom Profile README instantly differentiates senior candidates and frames your technical narrative before recruiters scan repos.',
        rescue: `Create repo "${user.login}/${user.login}" with skills, featured projects, and links to your portfolio and LinkedIn.`,
      },
      rescue: `Create a repository named exactly "${user.login}", initialize with a README.md, and introduce your skills, featured projects, and contact links.`,
      expectedImprovement: 'HIGH',
    });
  } else if (reposWithReadme.length < Math.min(3, totalRepos)) {
    roasts.push({
      incidentNumber: `INCIDENT #${String(roasts.length + 1).padStart(2, '0')}`,
      title: 'THE README CRIME SCENE',
      severity: 'HIGH',
      category: 'Documentation',
      memeType: 'missing-readme',
      evidence: `${totalRepos - reposWithReadme.length} repositories have no README file.`,
      recruiterImpact: 'A recruiter may have difficulty understanding what the project does without opening code.',
      roast: 'Your projects are shipped like Ikea furniture without instructions. Nobody knows how to run it, and nobody wants to guess.',
      roastModes: {
        savage: 'Your projects are shipped like Ikea furniture without instructions. Nobody knows how to run it, and nobody wants to guess.',
        meme: 'README status: 0 bytes. Evidence tape: DEPLOYED. Instruction manual: missing.',
        recruiter: 'Senior engineers document what they build. A repository without a README looks abandoned or incomplete.',
        rescue: 'Add a structured README: Problem, Features, Tech Stack, and 2-command Setup instructions.',
      },
      rescue: 'Write a clean README with: Overview, Features, Tech Stack, Screenshots, and Setup Guide (npm install && npm start).',
      expectedImprovement: 'HIGH',
    });
  }

  if (poorNamedRepos.length > 0) {
    roasts.push({
      incidentNumber: `INCIDENT #${String(roasts.length + 1).padStart(2, '0')}`,
      title: 'CREATIVE NAMING STRIKE',
      severity: 'MEDIUM',
      category: 'Repository Hygiene',
      memeType: 'naming',
      evidence: `Generic scratchpad names detected: ${poorNamedRepos.slice(0, 3).map((r) => `"${r.name}"`).join(', ')}.`,
      recruiterImpact: 'Signals school scratchpads or abandoned tutorials rather than intentional software engineering.',
      roast: `The naming committee took an unpaid vacation: ${poorNamedRepos.slice(0, 3).map((r) => `"${r.name}"`).join(', ')} detected in the wild.`,
      roastModes: {
        savage: `The naming committee took an unpaid vacation: ${poorNamedRepos.slice(0, 3).map((r) => `"${r.name}"`).join(', ')} detected in the wild.`,
        meme: 'final_final_v2_real_USETHIS.zip energy detected in repository names.',
        recruiter: 'Recruiters favor candidates with deliberate, production-style naming over student homework repositories.',
        rescue: 'Rename scratchpad repos to descriptive domain names or make them private.',
      },
      rescue: 'Rename them to descriptive domain names (e.g. "portfolio-landing-v1" or "react-weather-dashboard") or archive them if abandoned.',
      expectedImprovement: 'MEDIUM',
    });
  }

  if (totalRepos >= 2 && reposWithDemo.length === 0) {
    roasts.push({
      incidentNumber: `INCIDENT #${String(roasts.length + 1).padStart(2, '0')}`,
      title: 'THE PHANTOM SOFTWARE',
      severity: 'HIGH',
      category: 'Recruiter Signal',
      memeType: 'no-demo',
      evidence: 'Zero live deployment links found across all public repositories.',
      recruiterImpact: 'A recruiter or hiring manager is not going to git clone, install node_modules, and run locally.',
      roast: 'Software without a demo link is like a restaurant with only a picture of the oven. A recruiter is not going to clone your repo and install dependencies.',
      roastModes: {
        savage: 'Software without a demo link is like a restaurant with only a picture of the oven. A recruiter is not going to clone your repo and install dependencies.',
        meme: '"Trust me bro, it runs on localhost:3000." Cloud deployment: 404.',
        recruiter: 'Non-technical recruiters and busy hiring managers only verify projects they can click and test in 5 seconds.',
        rescue: 'Deploy your best frontend project to Vercel/Netlify/GitHub Pages and link it in the repo header.',
      },
      rescue: 'Deploy to Vercel, Netlify, or GitHub Pages in 2 minutes, and paste the URL into the repository About link.',
      expectedImprovement: 'HIGH',
    });
  }

  if (!hasPushedLast30Days && totalRepos > 0) {
    roasts.push({
      incidentNumber: `INCIDENT #${String(roasts.length + 1).padStart(2, '0')}`,
      title: 'THE DIGITAL COBWEBS',
      severity: 'MEDIUM',
      category: 'Activity Cadence',
      memeType: 'stale-activity',
      evidence: 'No commits or repository pushes detected in over 30 days.',
      recruiterImpact: 'Screeners wonder if you are currently active and building.',
      roast: "Your repositories have been waiting so long for an update they've probably started looking for another developer.",
      roastModes: {
        savage: "Your repositories have been waiting so long for an update they've probably started looking for another developer.",
        meme: 'Cryogenic code vault active. Last push detected in the Mesozoic era.',
        recruiter: 'Recruiters prioritize active candidates with recent green commit streaks indicating current coding momentum.',
        rescue: 'Push a small polish update or weekend experiment to revive your activity heatmap.',
      },
      rescue: 'Push a quick update: bump dependencies, improve a README, or commit a fresh weekend experiment to show your green squares.',
      expectedImprovement: 'MEDIUM',
    });
  }

  if (totalRepos > 3 && forkedRepos.length / totalRepos >= 0.5) {
    roasts.push({
      incidentNumber: `INCIDENT #${String(roasts.length + 1).padStart(2, '0')}`,
      title: 'THE FORK COLLECTOR',
      severity: 'MEDIUM',
      category: 'Originality',
      memeType: 'forks',
      evidence: `${Math.round((forkedRepos.length / totalRepos) * 100)}% of repositories are forks of other codebases.`,
      recruiterImpact: 'Recruiters want to see original architecture and problem solving.',
      roast: `${Math.round((forkedRepos.length / totalRepos) * 100)}% of your profile is a curated museum of other people's brilliance. Where is YOUR original code?`,
      roastModes: {
        savage: `${Math.round((forkedRepos.length / totalRepos) * 100)}% of your profile is a curated museum of other people's brilliance. Where is YOUR original code?`,
        meme: 'Curator of open source trophies. Original code ratio: critically low.',
        recruiter: 'Screeners filter out forks to see candidate-authored logic. High fork ratios dilute signal.',
        rescue: 'Pin your original codebases to the top and make inactive forks private.',
      },
      rescue: 'Forks do not impress hiring managers unless accompanied by an open pull request. Pin your original projects to the top.',
      expectedImprovement: 'MEDIUM',
    });
  }

  // Fallback for pristine profiles (like Dan Abramov or high score)
  if (roasts.length < 2) {
    roasts.push({
      incidentNumber: `INCIDENT #${String(roasts.length + 1).padStart(2, '0')}`,
      title: 'OVERACHIEVER SUSPICION',
      severity: 'LOW',
      category: 'Humor',
      memeType: 'overachiever',
      evidence: 'Profile scores exceptionally high across automated recruiter signals.',
      recruiterImpact: 'Engineering managers will immediately invite you to screening.',
      roast: 'Your profile is so organized it looks like your IDE automatically irons your commit messages. What are you even hiding?',
      roastModes: {
        savage: 'Your profile is so organized it looks like your IDE automatically irons your commit messages. What are you even hiding?',
        meme: 'Recruiter radar overheated. Code is suspiciously spotless.',
        recruiter: 'Outstanding candidate. Documentation, commit cadence, and project presentation meet top-tier screening standards.',
        rescue: 'Maintain this standard and consider pinning your open-source architectural contributions.',
      },
      rescue: 'Keep it fresh and make sure you mentor someone whose profile is currently on fire.',
      expectedImprovement: 'LOW',
    });
  }

  // ========================================================
  // 7. PRIORITY 7: EVIDENCE-BASED STRENGTHS
  // ========================================================
  const strengths = [];

  if (totalRepos >= 6) {
    strengths.push({
      title: 'Project Activity & Initiative',
      evidence: `✓ ${totalRepos} public repositories (${nonForkRepos.length} original codebases).`,
      whyRecruitersCare: 'Shows consistent technical curiosity, building habits, and project experimentation.',
      metric: `${totalRepos} Repos`,
    });
  }

  if (reposWithDesc.length >= 3) {
    strengths.push({
      title: 'Project Discoverability',
      evidence: `✓ ${reposWithDesc.length} repositories feature informative descriptions.`,
      whyRecruitersCare: 'Allows hiring managers to evaluate project relevance in seconds without reading source code.',
      metric: `${reposWithDesc.length} Described`,
    });
  }

  if (reposWithReadme.length >= 2) {
    strengths.push({
      title: 'Documentation Awareness',
      evidence: `✓ ${reposWithReadme.length} repositories contain markdown documentation.`,
      whyRecruitersCare: 'Demonstrates communication skills and engineering discipline essential for team collaboration.',
      metric: `${reposWithReadme.length} Documented`,
    });
  }

  if (languages.length >= 2) {
    strengths.push({
      title: 'Technical Stack Diversity',
      evidence: `✓ Practical usage of ${languages.length} languages (${languages.slice(0, 3).join(', ')}).`,
      whyRecruitersCare: 'Indicates technical adaptability and ability to learn new frameworks quickly.',
      metric: `${languages.length} Languages`,
    });
  }

  if (hasPushedLast30Days) {
    strengths.push({
      title: 'Active Development Momentum',
      evidence: '✓ Code pushes recorded within the last 30 days.',
      whyRecruitersCare: 'Verifies current active engineering engagement and ongoing learning.',
      metric: 'Fresh Activity',
    });
  }

  if (reposWithDemo.length > 0) {
    strengths.push({
      title: 'Interactive Live Product Showcase',
      evidence: `✓ ${reposWithDemo.length} repository linked with an accessible deployment URL.`,
      whyRecruitersCare: 'Hiring teams can immediately interact with finished product features without setup friction.',
      metric: `${reposWithDemo.length} Live Demos`,
    });
  }

  if (totalStars >= 5) {
    strengths.push({
      title: 'Community Validation',
      evidence: `✓ Accumulated ${totalStars} stars across public projects.`,
      whyRecruitersCare: 'External peer validation confirms real utility or interest in your work.',
      metric: `${totalStars} Stars`,
    });
  }

  if (hasProfileReadme) {
    strengths.push({
      title: 'Personal Branding & Welcome Mat',
      evidence: `✓ Dedicated Profile README configured for @${user.login}.`,
      whyRecruitersCare: 'Creates a memorable first impression with skills overview and contact links.',
      metric: 'Profile README Active',
    });
  }

  if (strengths.length === 0) {
    strengths.push({
      title: 'Clean Slate Potential',
      evidence: '✓ Public GitHub account ready for curated showcase projects.',
      whyRecruitersCare: 'No legacy technical debt; total freedom to craft a focused portfolio.',
      metric: 'Ready to Build',
    });
  }

  // ========================================================
  // 8. PRIORITY 8: EVIDENCE-BASED RED FLAGS
  // ========================================================
  const problems = [];

  if (!user.bio || user.bio.trim().length === 0) {
    problems.push({
      severity: 'HIGH',
      title: 'Missing Bio / Value Proposition',
      evidence: 'Bio is 0 characters on profile header.',
      recruiterImpact: 'Recruiters spend 10–30 seconds. Without a bio, they cannot tell what role you are targeting.',
      fix: 'Add a concise 1-sentence bio stating your target role and primary tech stack.',
    });
  }

  if (totalRepos > 0 && reposWithReadme.length < Math.min(3, totalRepos)) {
    problems.push({
      severity: 'HIGH',
      title: 'Weak Project Documentation',
      evidence: `Only ${reposWithReadme.length} of ${totalRepos} repositories contain README documentation.`,
      recruiterImpact: 'Harder to understand project value and architecture quickly without digging through code.',
      fix: 'Add concise README files to your top 3 projects covering problem, features, tech stack, and setup.',
    });
  }

  if (totalRepos > 0 && descMissingCount > 0) {
    problems.push({
      severity: descMissingCount >= 3 ? 'HIGH' : 'MEDIUM',
      title: 'Repositories Missing Descriptions',
      evidence: `${descMissingCount} repositories have empty "About" descriptions.`,
      recruiterImpact: 'Forces visitors to guess functionality or skip reviewing the project altogether.',
      fix: 'Edit the About section on each repo with a 15-word summary of what it does.',
    });
  }

  if (!hasProfileReadme) {
    problems.push({
      severity: 'HIGH',
      title: 'Missing Profile README',
      evidence: `No repository found matching github.com/${user.login}/${user.login}.`,
      recruiterImpact: 'Leaves the top of your GitHub homepage blank instead of showcasing your best work.',
      fix: `Create a repository named "${user.login}" and add a markdown introduction with your tech stack.`,
    });
  }

  if (totalRepos > 0 && reposWithDemo.length === 0) {
    problems.push({
      severity: 'HIGH',
      title: 'Zero Live Demonstration URLs',
      evidence: 'No public repositories link to working web deployments.',
      recruiterImpact: 'Recruiters and hiring managers rarely compile local code; live links increase engagement 5x.',
      fix: 'Deploy frontend projects to Vercel/Netlify for free and set the URL in the repo header.',
    });
  }

  if (totalRepos > 0 && !hasPushedLast30Days) {
    problems.push({
      severity: 'MEDIUM',
      title: 'Lacking Recent Commit Momentum',
      evidence: 'No public commits or repository updates detected in the last 30 days.',
      recruiterImpact: 'Can give the impression of an inactive or abandoned developer profile.',
      fix: 'Push an update or commit improvements to your primary repository weekly.',
    });
  }

  if (poorNamedRepos.length > 0) {
    problems.push({
      severity: 'MEDIUM',
      title: 'Ambiguous Repository Names',
      evidence: `Found ${poorNamedRepos.length} generic names (${poorNamedRepos.slice(0, 3).map((r) => r.name).join(', ')}).`,
      recruiterImpact: 'Dilutes professional impression; resembles school scratchpads rather than shipping software.',
      fix: 'Rename projects to descriptive domain titles (e.g. "finance-tracker-api") or make them private.',
    });
  }

  // ========================================================
  // 9. PRIORITY 9: ACTIONABLE RESCUE PLAN (TODAY / WEEK / MONTH)
  // ========================================================
  const rescuePlan = [
    {
      priority: 'DO TODAY',
      title: 'Quick Wins & First Impression',
      effort: '⚡ 15–30 minutes',
      badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
      tasks: [
        { id: 'today-name', text: 'Ensure full real name is visible on GitHub profile', done: !!user.name },
        { id: 'today-bio', text: 'Write a concise, professional 1-sentence bio with role & tech stack', done: !!user.bio && user.bio.length >= 20 },
        { id: 'today-desc', text: 'Add crisp 15-word descriptions to your top 3 repositories', done: reposWithDesc.length >= 3 },
        { id: 'today-links', text: 'Add your portfolio website, LinkedIn, or Twitter in profile settings', done: !!user.blog || !!user.twitter_username },
      ],
    },
    {
      priority: 'DO THIS WEEK',
      title: 'Documentation & Flagship Polish',
      effort: '🛠 1–2 hours',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      tasks: [
        { id: 'week-profile-readme', text: `Create special repository github.com/${user.login}/${user.login} with Profile README`, done: hasProfileReadme },
        { id: 'week-repo-readme', text: 'Add structured README (Problem, Stack, Live Demo, Setup) to strongest project', done: reposWithReadme.length >= 2 },
        { id: 'week-deploy', text: 'Deploy web project to free cloud hosting (Vercel/Netlify) and link in repo About box', done: reposWithDemo.length >= 1 },
        { id: 'week-clean-names', text: 'Rename or archive vague scratchpad repositories (e.g. "test", "final-project")', done: poorNamedRepos.length === 0 },
      ],
    },
    {
      priority: 'DO THIS MONTH',
      title: 'Engineering Authority & Consistency',
      effort: '🔥 2–4 hours',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      tasks: [
        { id: 'month-topics', text: 'Tag all major repositories with topics (#react, #typescript, #fullstack) for search', done: repos.some((r) => r.topics && r.topics.length > 0) },
        { id: 'month-screenshots', text: 'Add screenshots and demo GIFs into your top project README files', done: false },
        { id: 'month-cadence', text: 'Maintain consistent weekly commit cadence on your flagship project', done: hasPushedLast30Days },
        { id: 'month-pin', text: 'Pin your top 4 cleanest flagship repositories to your GitHub profile homepage', done: totalRepos >= 4 },
      ],
    },
  ];

  // ========================================================
  // 10. PRIORITY 14 & 15: REPOSITORY TELEMETRY & BREAKDOWN
  // ========================================================
  const analyzedRepos = repos.map((repo) => {
    let repoScore = 30; // baseline
    if (repo.description && repo.description.length > 10) repoScore += 25;
    if (repo.homepage) repoScore += 20;
    if (repo.hasReadme) repoScore += 15;
    if (!repo.fork) repoScore += 10;
    if (repo.stargazers_count > 0) repoScore += Math.min(10, repo.stargazers_count * 2);
    if (repo.topics && repo.topics.length > 0) repoScore += 5;

    const isFlagship = repoScore >= 60 && !repo.fork;
    const needsRescue = repoScore < 50 || !repo.description || !repo.hasReadme;

    // Telemetry indicators
    const readmeStatus = repo.hasReadme ? 'PRESENT' : 'MISSING';
    const descStatus = repo.description && repo.description.trim().length > 3 ? 'PRESENT' : 'MISSING';
    const isRecent = repo.pushed_at && new Date(repo.pushed_at) > ninetyDaysAgo;
    const activityStatus = isRecent ? 'RECENT' : 'STALE';
    const docStatus = repo.hasReadme && repo.description ? 'STRONG' : repo.hasReadme || repo.description ? 'ADEQUATE' : 'WEAK';

    return {
      ...repo,
      repoScore: Math.min(100, repoScore),
      isFlagship,
      needsRescue,
      readmeStatus,
      descStatus,
      activityStatus,
      docStatus,
      missingItems: [
        !repo.description && 'Description',
        !repo.homepage && 'Live Demo Link',
        !repo.hasReadme && 'README file',
        (!repo.topics || repo.topics.length === 0) && 'Topics/Tags',
      ].filter(Boolean),
    };
  });

  // Sort repos by score descending
  analyzedRepos.sort((a, b) => b.repoScore - a.repoScore);

  const flagshipProjects = analyzedRepos.filter((r) => r.isFlagship);
  const projectsNeedingRescue = analyzedRepos.filter((r) => r.needsRescue);

  // Recruiter Screener Verdict string
  let recruiterVerdict = '';
  let recruiterTone = '';
  if (recruiterReadinessScore >= 80) {
    recruiterVerdict = 'Strong candidate profile! Flagship projects stand out with clear signals and high documentation standards. Ready to share with engineering managers.';
    recruiterTone = 'POSITIVE';
  } else if (recruiterReadinessScore >= 60) {
    recruiterVerdict = 'Your profile shows genuine potential, but your strongest work is buried under poorly described repositories. A recruiter would have to dig through clutter.';
    recruiterTone = 'PROMISSING_BUT_CLUTTERED';
  } else if (recruiterReadinessScore >= 40) {
    recruiterVerdict = 'A recruiter spending 30 seconds here would likely bounce. There is code, but no story, context, live links, or documentation explaining why it matters.';
    recruiterTone = 'NEEDS_RESCUE';
  } else {
    recruiterVerdict = 'Portfolio Ghost Town. Missing bio, minimal documentation, and undocumented repos leave recruiters guessing if this profile is active or abandoned.';
    recruiterTone = 'CRITICAL';
  }

  // 9 Recruiter Checks for 30s test (preserved for backward compatibility)
  const recruiterChecks = [
    {
      id: 'identity',
      title: 'Identity & Professional Clarity',
      status: user.name && user.avatar_url ? 'PASS' : user.avatar_url ? 'WARN' : 'FAIL',
      detail: user.name
        ? `Recruiter sees full name "${user.name}" and avatar immediately.`
        : 'Missing real name. Recruiters prefer verifying identity on LinkedIn or resumes.',
      fix: 'Add your full name and a clean profile picture.',
    },
    {
      id: 'bio',
      title: 'Value-Proposition Bio',
      status: user.bio && user.bio.length >= 20 ? 'PASS' : user.bio ? 'WARN' : 'FAIL',
      detail: user.bio
        ? user.bio.toLowerCase().includes('aspiring')
          ? 'Bio uses "aspiring", which dilutes authority.'
          : 'Concise bio conveys role and technical interest.'
        : 'Empty bio. A recruiter has no idea what role you are targeting in the first 5 seconds.',
      fix: 'Craft a 1-sentence bio stating what you build and your primary tech stack.',
    },
    {
      id: 'project-findability',
      title: 'Flagship Project Findability',
      status: reposWithDesc.length >= 3 && reposWithReadme.length >= 2 ? 'PASS' : totalRepos > 0 ? 'WARN' : 'FAIL',
      detail: reposWithDesc.length >= 3
        ? 'Strong projects with descriptions are readily visible.'
        : 'Strongest work is buried under empty repositories. Recruiters will not dig through 10 blank repos.',
      fix: 'Pin your top 3-4 repositories with clear descriptions and demos.',
    },
    {
      id: 'repo-naming',
      title: 'Professional Repository Naming',
      status: poorNamedRepos.length === 0 ? 'PASS' : poorNamedRepos.length <= 2 ? 'WARN' : 'FAIL',
      detail: poorNamedRepos.length === 0
        ? 'Clean repository naming conventions.'
        : `Found vague names (${poorNamedRepos.slice(0, 3).map((r) => `"${r.name}"`).join(', ')}).`,
      fix: 'Rename test/homework projects to self-explanatory names or make them private.',
    },
    {
      id: 'descriptions',
      title: 'At-a-Glance Descriptions',
      status: reposWithDesc.length / Math.max(1, totalRepos) >= 0.7 ? 'PASS' : reposWithDesc.length > 0 ? 'WARN' : 'FAIL',
      detail: `${reposWithDesc.length} of ${totalRepos} repositories have descriptions (${Math.round(
        (reposWithDesc.length / Math.max(1, totalRepos)) * 100
      )}%).`,
      fix: 'Add a 10-15 word description explaining what each project does.',
    },
    {
      id: 'readmes',
      title: 'Documentation (README Availability)',
      status: hasProfileReadme && reposWithReadme.length >= 3 ? 'PASS' : reposWithReadme.length > 0 ? 'WARN' : 'FAIL',
      detail: hasProfileReadme
        ? 'Profile README present; projects have markdown documentation.'
        : 'Missing profile README or project documentation. Code without docs looks incomplete.',
      fix: 'Create a personal profile README and add structured READMEs to top repos.',
    },
    {
      id: 'demos',
      title: 'Interactive Live Demos',
      status: reposWithDemo.length >= 2 ? 'PASS' : reposWithDemo.length >= 1 ? 'WARN' : 'FAIL',
      detail: reposWithDemo.length >= 1
        ? `${reposWithDemo.length} repository has a live URL link.`
        : 'Zero live deployment links found. Recruiters test live apps; they rarely clone and npm run locally.',
      fix: 'Deploy web projects on Vercel or Netlify and link them in the repo header.',
    },
    {
      id: 'activity',
      title: 'Recent Meaningful Activity',
      status: hasPushedLast30Days ? 'PASS' : hasPushedLast90Days ? 'WARN' : 'FAIL',
      detail: hasPushedLast30Days
        ? 'Consistent activity within the last 30 days.'
        : hasPushedLast90Days
        ? 'Active in the last quarter, but recent momentum could be higher.'
        : 'No code updates in over 90 days. Signals dormancy or abandoned profile.',
      fix: 'Commit meaningful updates or documentation polish weekly.',
    },
    {
      id: 'skills',
      title: 'Skills & Tech Stack Visibility',
      status: languages.length >= 2 ? 'PASS' : languages.length === 1 ? 'WARN' : 'FAIL',
      detail: languages.length >= 2
        ? `Primary languages: ${languages.slice(0, 4).join(', ')}.`
        : 'Limited tech stack diversity visible from public repositories.',
      fix: 'Tag your repos with topics (e.g. #react, #typescript, #docker, #tailwind).',
    },
  ];

  return {
    user,
    totalRepos,
    nonForkReposCount: nonForkRepos.length,
    forkedReposCount: forkedRepos.length,
    languages,
    totalStars,
    totalForks,
    hasProfileReadme,
    hasPushedLast30Days,
    // Original Signal Score
    totalScore,
    grade,
    gradeColor,
    scoreCategories,
    // New Recruiter Readiness Score & Explainable Scoring
    recruiterReadinessScore,
    recruiterGrade,
    recruiterGradeColor,
    recruiterCategories,
    // Recruiter Decision
    recruiterDecision: {
      decision,
      badgeColor: decisionBadgeColor,
      iconColor: decisionIconColor,
      whyPositive,
      whyWarnings,
      quickFixSummary,
    },
    // Recruiter 30s Scan
    recruiter30sScan,
    // Fastest Path to +15
    fastestPath: topFastestPath,
    // 30s Checks & Screener Verdict
    recruiterChecks,
    recruiterVerdict,
    recruiterTone,
    // Voice Roast Summary (Feature 8)
    profileVoiceRoast: `Alright ${user.name || user.login}, let's look at what a recruiter sees. With a Recruiter Readiness score of ${recruiterReadinessScore} out of 100 and a screening verdict of ${decision}, ${whyWarnings[0] ? `here is the main blocker: ${whyWarnings[0]}.` : 'your baseline profile is solid.'} ${topFastestPath[0] ? `Your fastest win: ${topFastestPath[0].action}` : 'Keep pushing clean code.'}`,
    // Roasts (Incident Reports & Modes)
    roasts,
    // Evidence-based Strengths & Problems
    strengths,
    problems,
    // Rescue Plan
    rescuePlan,
    analyzedRepos,
    flagshipProjects,
    projectsNeedingRescue,
    // Meta flags
    isDemoFallback: Boolean(data.isDemoFallback),
    rateLimitWarning: data.rateLimitWarning || null,
    isRateLimited: Boolean(data.isRateLimited),
    rateLimitRemaining: data.rateLimitRemaining ?? null,
    rateLimitReset: data.rateLimitReset ?? null,
  };
}
