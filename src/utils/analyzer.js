/**
 * GitHub Roast & Rescue Analysis Engine
 * Calculates data-driven scores, recruiter 30s impressions, witty roasts,
 * genuine strengths, detected problems, and prioritized rescue plans.
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

  // Check recent activity (pushed within last 30 / 90 days)
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  const hasPushedLast30Days = repos.some((r) => r.pushed_at && new Date(r.pushed_at) > thirtyDaysAgo);
  const hasPushedLast90Days = repos.some((r) => r.pushed_at && new Date(r.pushed_at) > ninetyDaysAgo);

  // Vague / Poor repo names check
  const genericNames = ['test', 'demo', 'app', 'project', 'my-app', 'untitled', 'final', 'homework', 'assignment', 'temp', 'lab'];
  const poorNamedRepos = repos.filter((r) => {
    const lower = r.name.toLowerCase();
    return genericNames.some((g) => lower === g || lower.startsWith(`${g}-`) || lower.endsWith(`-${g}`));
  });

  // ==========================================
  // 1. CALCULATE PROFILE SCORE (Out of 100)
  // ==========================================
  // Categories:
  // - Profile Completeness — 15
  // - Project Presentation — 25
  // - Activity — 15
  // - README Quality — 15
  // - Technical Diversity — 10
  // - Project Depth/Signals — 10
  // - Recruiter Readiness — 10

  // 1. Profile Completeness (15 pts)
  let scoreProfile = 0;
  if (user.name) scoreProfile += 3;
  if (user.bio && user.bio.trim().length > 10) scoreProfile += 4;
  else if (user.bio) scoreProfile += 2;
  if (user.avatar_url) scoreProfile += 2;
  if (user.location || user.company) scoreProfile += 2;
  if (hasProfileReadme) scoreProfile += 4;
  scoreProfile = Math.min(15, scoreProfile);

  // 2. Project Presentation (25 pts)
  let scorePresentation = 0;
  if (totalRepos > 0) {
    const descRatio = reposWithDesc.length / totalRepos;
    scorePresentation += Math.round(descRatio * 10); // up to 10
    const demoRatio = reposWithDemo.length / Math.min(5, totalRepos);
    scorePresentation += Math.round(Math.min(1, demoRatio) * 6); // up to 6
    const cleanNamesRatio = Math.max(0, 1 - poorNamedRepos.length / totalRepos);
    scorePresentation += Math.round(cleanNamesRatio * 5); // up to 5
    const hasTopics = repos.some((r) => r.topics && r.topics.length > 0);
    if (hasTopics) scorePresentation += 4; // up to 4
  }
  scorePresentation = Math.min(25, scorePresentation);

  // 3. Activity (15 pts)
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

  // 4. README Quality (15 pts)
  let scoreReadme = 0;
  if (hasProfileReadme) scoreReadme += 5;
  if (totalRepos > 0) {
    const readmeRatio = reposWithReadme.length / Math.min(8, totalRepos);
    scoreReadme += Math.round(Math.min(1, readmeRatio) * 10);
  }
  scoreReadme = Math.min(15, scoreReadme);

  // 5. Technical Diversity (10 pts)
  let scoreDiversity = 0;
  if (languages.length >= 4) scoreDiversity = 10;
  else if (languages.length >= 2) scoreDiversity = 7;
  else if (languages.length === 1) scoreDiversity = 4;
  else scoreDiversity = 1;

  // 6. Project Depth/Signals (10 pts)
  let scoreDepth = 0;
  if (totalRepos > 0) {
    const originalRatio = nonForkRepos.length / totalRepos;
    scoreDepth += Math.round(originalRatio * 4); // up to 4
    if (totalStars >= 50) scoreDepth += 3;
    else if (totalStars >= 5) scoreDepth += 2;
    else if (totalStars >= 1) scoreDepth += 1;

    const hasSubstantialRepo = repos.some((r) => r.size > 200);
    if (hasSubstantialRepo) scoreDepth += 3;
    else scoreDepth += 1;
  }
  scoreDepth = Math.min(10, scoreDepth);

  // 7. Recruiter Readiness (10 pts)
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

  // ==========================================
  // 2. THE 30-SECOND RECRUITER TEST
  // ==========================================
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
      detail:
        reposWithDesc.length >= 3
          ? 'Strong projects with descriptions are readily visible.'
          : 'Strongest work is buried under empty repositories. Recruiters will not dig through 10 blank repos.',
      fix: 'Pin your top 3-4 repositories with clear descriptions and demos.',
    },
    {
      id: 'repo-naming',
      title: 'Professional Repository Naming',
      status: poorNamedRepos.length === 0 ? 'PASS' : poorNamedRepos.length <= 2 ? 'WARN' : 'FAIL',
      detail:
        poorNamedRepos.length === 0
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
      detail:
        reposWithDemo.length >= 1
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
      detail:
        languages.length >= 2
          ? `Primary languages: ${languages.slice(0, 4).join(', ')}.`
          : 'Limited tech stack diversity visible from public repositories.',
      fix: 'Tag your repos with topics (e.g. #react, #typescript, #docker, #tailwind).',
    },
  ];

  // Recruiter Verdict
  let recruiterVerdict = '';
  let recruiterTone = '';
  if (totalScore >= 80) {
    recruiterVerdict = 'Strong candidate profile! Flagship projects stand out with clear signals and high documentation standards. Ready to share with engineering managers.';
    recruiterTone = 'POSITIVE';
  } else if (totalScore >= 60) {
    recruiterVerdict = 'Your profile shows genuine potential, but your strongest work is buried under poorly described repositories. A recruiter would have to dig through clutter.';
    recruiterTone = 'PROMISSING_BUT_CLUTTERED';
  } else if (totalScore >= 40) {
    recruiterVerdict = 'A recruiter spending 30 seconds here would likely bounce. There is code, but no story, context, live links, or documentation explaining why it matters.';
    recruiterTone = 'NEEDS_RESCUE';
  } else {
    recruiterVerdict = 'Portfolio Ghost Town. Missing bio, minimal documentation, and undocumented repos leave recruiters guessing if this profile is active or abandoned.';
    recruiterTone = 'CRITICAL';
  }

  // ==========================================
  // 3. 🔥 ROAST ENGINE (Contextual & Honest)
  // ==========================================
  const roasts = [];

  // Bio Roast
  if (!user.bio || user.bio.trim().length === 0) {
    roasts.push({
      title: 'The Stealth Operative',
      roast: 'Bio status: classified information. Even Area 51 has more public disclosure than your GitHub bio.',
      rescue: 'Add a 1-sentence bio stating your core stack and what you love building (e.g., "Full-Stack Dev building real-time apps with TypeScript & Go").',
      category: 'Profile',
      severity: 'high',
    });
  } else if (user.bio.toLowerCase().includes('aspiring')) {
    roasts.push({
      title: 'The Imposter Syndrome Trap',
      roast: 'Calling yourself an "aspiring developer" is like a chef calling themselves an "aspiring pancake flipper". You commit code—you ARE a developer!',
      rescue: 'Drop the word "aspiring". Replace it with: "Software Engineer specializing in React & Node.js" or whatever your focus is.',
      category: 'Bio',
      severity: 'medium',
    });
  }

  // Descriptions Roast
  const descMissingCount = totalRepos - reposWithDesc.length;
  if (descMissingCount > 0 && descMissingCount >= totalRepos * 0.4) {
    roasts.push({
      title: 'The Silent Cinema',
      roast: `Your repositories have mastered the art of saying absolutely nothing. ${descMissingCount} repos with blank descriptions—recruiter telepathy DLC is not installed.`,
      rescue: 'Go to each repo, click the gear icon in the About section, and write a 1-sentence synopsis of what problem it solves.',
      category: 'Presentation',
      severity: 'high',
    });
  }

  // README Roast
  if (!hasProfileReadme) {
    roasts.push({
      title: 'The Missing Welcome Mat',
      roast: `Profile README: apparently considered optional DLC in your timeline. You have an entire billboard at github.com/${user.login}/${user.login} that you left completely blank!`,
      rescue: `Create a repository named exactly "${user.login}", initialize with a README.md, and introduce your skills, featured projects, and contact links.`,
      category: 'Documentation',
      severity: 'high',
    });
  } else if (reposWithReadme.length < Math.min(3, totalRepos)) {
    roasts.push({
      title: 'Code With No Manual',
      roast: 'Your projects are shipped like Ikea furniture without instructions. Nobody knows how to run it, and nobody wants to guess.',
      rescue: 'Write a clean README with: Overview, Features, Tech Stack, Screenshots, and Setup Guide (npm install && npm start).',
      category: 'Documentation',
      severity: 'medium',
    });
  }

  // Poor Repo Names Roast
  if (poorNamedRepos.length > 0) {
    roasts.push({
      title: 'Creative Naming Strike',
      roast: `The naming committee took an unpaid vacation: ${poorNamedRepos.slice(0, 3).map((r) => `"${r.name}"`).join(', ')} detected in the wild.`,
      rescue: 'Rename them to descriptive domain names (e.g. "portfolio-landing-v1" or "react-weather-dashboard") or archive them if abandoned.',
      category: 'Hygiene',
      severity: 'medium',
    });
  }

  // Inactive / Stale Roast
  if (!hasPushedLast30Days) {
    roasts.push({
      title: 'The Digital Cobwebs',
      roast: "Your repositories have been waiting so long for an update they've probably started looking for another developer.",
      rescue: 'Push a quick update: bump dependencies, improve a README, or commit a fresh weekend experiment to show your green squares.',
      category: 'Activity',
      severity: 'high',
    });
  }

  // Forks Roast
  if (totalRepos > 3 && forkedRepos.length / totalRepos >= 0.5) {
    roasts.push({
      title: 'The Fork Collector',
      roast: `${Math.round((forkedRepos.length / totalRepos) * 100)}% of your profile is a curated museum of other people's brilliance. Where is YOUR original code?`,
      rescue: 'Forks do not impress hiring managers unless accompanied by an open pull request. Pin your original projects to the top.',
      category: 'Originality',
      severity: 'medium',
    });
  }

  // Live Demos Roast
  if (totalRepos >= 2 && reposWithDemo.length === 0) {
    roasts.push({
      title: 'The Phantom Software',
      roast: 'Software without a demo link is like a restaurant with only a picture of the oven. A recruiter is not going to clone your repo and install dependencies.',
      rescue: 'Deploy to Vercel, Netlify, or GitHub Pages in 2 minutes, and paste the URL into the repository About link.',
      category: 'Recruiter Signal',
      severity: 'high',
    });
  }

  // Single language mono-diet
  if (languages.length === 1 && totalRepos >= 3) {
    roasts.push({
      title: 'The Single-Stack Mono Diet',
      roast: `You eat, sleep, and breathe 100% ${languages[0]}. Doctors recommend at least one second language for healthy architectural nutrition.`,
      rescue: `Broaden your horizons by building a small companion CLI, script, or microservice in TypeScript, Go, or Python.`,
      category: 'Diversity',
      severity: 'low',
    });
  }

  // If profile is surprisingly pristine (like Dan Abramov or high score)
  if (roasts.length < 2 && totalScore >= 80) {
    roasts.push({
      title: 'Overachiever Alert',
      roast: 'Your profile is so organized it looks like your IDE automatically irons your commit messages. What are you even hiding?',
      rescue: 'Keep it fresh and make sure you mentor someone whose profile is currently on fire.',
      category: 'Humor',
      severity: 'low',
    });
  }

  // ==========================================
  // 4. 💪 GENUINE STRENGTHS
  // ==========================================
  const strengths = [];
  if (totalRepos >= 8) {
    strengths.push({
      title: 'Prolific Builder',
      detail: `Demonstrated initiative with ${totalRepos} public repositories across your GitHub journey.`,
      metric: `${totalRepos} Repos`,
    });
  }
  if (languages.length >= 3) {
    strengths.push({
      title: 'Polyglot Toolkit',
      detail: `Experience across ${languages.length} programming languages (${languages.slice(0, 4).join(', ')}).`,
      metric: `${languages.length} Languages`,
    });
  }
  if (hasPushedLast30Days) {
    strengths.push({
      title: 'Active Momentum',
      detail: 'Recent commits within the last 30 days show ongoing coding consistency.',
      metric: 'Fresh Activity',
    });
  }
  if (hasProfileReadme) {
    strengths.push({
      title: 'Personal Branding Signal',
      detail: 'Maintains a dedicated Profile README welcoming visitors to their workspace.',
      metric: 'Profile README Active',
    });
  }
  if (reposWithDemo.length > 0) {
    strengths.push({
      title: 'Live Product Showcase',
      detail: `${reposWithDemo.length} repository includes live accessible deployment URLs for instant testing.`,
      metric: `${reposWithDemo.length} Live Demos`,
    });
  }
  if (totalStars >= 5) {
    strengths.push({
      title: 'Community Validation',
      detail: `Accumulated ${totalStars} stars across projects, indicating peer interest or utility.`,
      metric: `${totalStars} Stars`,
    });
  }
  if (user.blog) {
    strengths.push({
      title: 'Extended Online Footprint',
      detail: `Linked personal website or blog (${user.blog.replace(/^https?:\/\//, '').slice(0, 25)}) for deeper credibility.`,
      metric: 'Portfolio Linked',
    });
  }
  if (strengths.length === 0) {
    strengths.push({
      title: 'Blank Canvas Potential',
      detail: 'Starting fresh gives you total freedom to build a focused, pristine portfolio without technical debt.',
      metric: 'Fresh Start',
    });
  }

  // ==========================================
  // 5. 🚨 DETECTED PROBLEMS
  // ==========================================
  const problems = [];
  if (!user.bio || user.bio.trim().length === 0) {
    problems.push({
      severity: 'HIGH',
      title: 'Missing Bio / Value Proposition',
      description: 'Profile has no summary. Recruiters spend only 30 seconds and miss your target specialization.',
    });
  }
  if (descMissingCount > 0) {
    problems.push({
      severity: descMissingCount > 3 ? 'HIGH' : 'MEDIUM',
      title: `${descMissingCount} Repositories Missing Descriptions`,
      description: 'Repositories without descriptions force visitors to guess their functionality or ignore them entirely.',
    });
  }
  if (!hasProfileReadme) {
    problems.push({
      severity: 'HIGH',
      title: 'No Profile README (username/username)',
      description: 'You are missing the single highest-converting landing page feature on GitHub.',
    });
  }
  if (reposWithDemo.length === 0 && totalRepos > 0) {
    problems.push({
      severity: 'HIGH',
      title: 'Zero Live Demonstration URLs',
      description: 'No repositories link to working deployments. Hiring managers rarely compile student code locally.',
    });
  }
  if (!hasPushedLast30Days && totalRepos > 0) {
    problems.push({
      severity: 'MEDIUM',
      title: 'Lacking Recent Commit Momentum',
      description: 'No public updates in over 30 days can make your GitHub look abandoned.',
    });
  }
  if (poorNamedRepos.length > 0) {
    problems.push({
      severity: 'MEDIUM',
      title: `Ambiguous Project Names (${poorNamedRepos.length} repos)`,
      description: `Repos like ${poorNamedRepos.map((r) => r.name).slice(0, 3).join(', ')} signal test scratchpads rather than portfolio pieces.`,
    });
  }
  if (languages.length <= 1 && totalRepos > 0) {
    problems.push({
      severity: 'LOW',
      title: 'Low Language Breadth',
      description: `Only ${languages[0] || 'one stack'} is represented. Demonstrating full-stack versatility stands out more.`,
    });
  }

  // ==========================================
  // 6. 🚑 RESCUE PLAN (Prioritized Roadmap)
  // ==========================================
  const rescuePlan = [
    {
      priority: 'PRIORITY 1',
      title: 'Fix Profile & First Impression',
      effort: '⚡ 5–15 minutes',
      badgeColor: 'border-orange-500/40 text-orange-400 bg-orange-500/10',
      tasks: [
        { id: 'p1-name', text: 'Ensure full real name is visible on GitHub profile', done: !!user.name },
        { id: 'p1-bio', text: 'Write a concise, professional 1-sentence bio with role & tech stack', done: !!user.bio && user.bio.length >= 20 },
        { id: 'p1-readme', text: `Create special repository github.com/${user.login}/${user.login} with a rich README.md`, done: hasProfileReadme },
        { id: 'p1-contact', text: 'Add your portfolio website, LinkedIn, or Twitter in profile settings', done: !!user.blog || !!user.twitter_username },
      ],
    },
    {
      priority: 'PRIORITY 2',
      title: 'Elevate Your Top 2–3 Flagship Projects',
      effort: '🛠 30–60 minutes',
      badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      tasks: [
        { id: 'p2-desc', text: 'Write crisp 15-word descriptions in the GitHub About box for top repos', done: reposWithDesc.length >= 3 },
        { id: 'p2-deploy', text: 'Deploy web projects to free cloud hosting (Vercel, Netlify) and set URL in repo settings', done: reposWithDemo.length >= 1 },
        { id: 'p2-readme', text: 'Add a gold-standard README (Problem, Architecture, Tech Stack, Live Link, Setup)', done: reposWithReadme.length >= 3 },
        { id: 'p2-topics', text: 'Tag repositories with topics (#react, #typescript, #fullstack) for searchability', done: repos.some((r) => r.topics && r.topics.length > 0) },
      ],
    },
    {
      priority: 'PRIORITY 3',
      title: 'Clean & Declutter GitHub Workspace',
      effort: '⚡ 15–30 minutes',
      badgeColor: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      tasks: [
        { id: 'p3-rename', text: 'Rename unclear scratchpad repos (e.g. "test", "final-project") to descriptive names', done: poorNamedRepos.length === 0 },
        { id: 'p3-archive', text: 'Archive abandoned or dead tutorial repos so recruiters focus on your best work', done: false },
        { id: 'p3-pin', text: 'Pin your top 4-6 most impressive repositories to your GitHub homepage', done: totalRepos >= 4 },
      ],
    },
    {
      priority: 'PRIORITY 4',
      title: 'Build Long-Term Recruiter Appeal',
      effort: '🔥 2–4 hours',
      badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      tasks: [
        { id: 'p4-architecture', text: 'Add system architecture diagrams or flowcharts to your main flagship project', done: false },
        { id: 'p4-opensource', text: 'Contribute a pull request or issue to an established open-source repository', done: totalForks > 0 },
        { id: 'p4-gif', text: 'Record a 10-second demo GIF or video walkthrough and embed it in your project README', done: false },
      ],
    },
  ];

  // ==========================================
  // 7. 🗂 REPOSITORY INDIVIDUAL BREAKDOWN
  // ==========================================
  const analyzedRepos = repos.map((repo) => {
    let repoScore = 30; // base
    if (repo.description && repo.description.length > 10) repoScore += 25;
    if (repo.homepage) repoScore += 20;
    if (repo.hasReadme) repoScore += 15;
    if (!repo.fork) repoScore += 10;
    if (repo.stargazers_count > 0) repoScore += Math.min(10, repo.stargazers_count * 2);
    if (repo.topics && repo.topics.length > 0) repoScore += 5;

    const isFlagship = repoScore >= 60 && !repo.fork;
    const needsRescue = repoScore < 50 || !repo.description || !repo.hasReadme;

    return {
      ...repo,
      repoScore: Math.min(100, repoScore),
      isFlagship,
      needsRescue,
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
    totalScore,
    grade,
    gradeColor,
    scoreCategories,
    recruiterChecks,
    recruiterVerdict,
    recruiterTone,
    roasts,
    strengths,
    problems,
    rescuePlan,
    analyzedRepos,
    flagshipProjects,
    projectsNeedingRescue,
  };
}
