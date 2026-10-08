import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import ProfileCard from './components/ProfileCard';
import RecruiterReadinessCard from './components/RecruiterReadinessCard';
import ScoreCard from './components/ScoreCard';
import RecruiterTest from './components/RecruiterTest';
import RoastChamber from './components/RoastChamber';
import StrengthsAndProblems from './components/StrengthsAndProblems';
import RescuePlan from './components/RescuePlan';
import BeforeAfter from './components/BeforeAfter';
import RepoAnalysis from './components/RepoAnalysis';
import ReadmeModal from './components/ReadmeModal';
import ShareAuditModal from './components/ShareAuditModal';
import SettingsModal from './components/SettingsModal';
import Footer from './components/Footer';

import { fetchGitHubProfile } from './services/githubApi';
import { sampleProfiles } from './services/sampleData';
import { analyzeProfile } from './utils/analyzer';
import { Key, AlertTriangle, Sparkles } from 'lucide-react';

export default function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('gh_token') || '';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(null);
  const [rateLimitReset, setRateLimitReset] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Modals
  const [showSettings, setShowSettings] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedRepoForReadme, setSelectedRepoForReadme] = useState(null);

  const handleSaveToken = (newToken) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('gh_token', newToken);
    } else {
      localStorage.removeItem('gh_token');
    }
  };

  const handleSearch = async (username) => {
    if (!username || !username.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsDemoMode(false);

    try {
      const data = await fetchGitHubProfile(username.trim(), token);
      if (data.rateLimitRemaining !== null) {
        setRateLimitRemaining(data.rateLimitRemaining);
      }
      if (data.rateLimitReset !== null) {
        setRateLimitReset(data.rateLimitReset);
      }

      const result = analyzeProfile(data);
      setAnalysis(result);

      // Scroll smoothly to results
      setTimeout(() => {
        const el = document.getElementById('audit-results');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Audit error:', err);
      setError(err.message || 'Failed to fetch GitHub profile. Please check the username.');
      setAnalysis(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 1-Click Instant Demo Profile for Hackathon Judges
  const handleTryDemo = (profileKey = 'demo-profile') => {
    setError(null);
    setIsDemoMode(true);
    const demoData = sampleProfiles[profileKey] || sampleProfiles['demo-profile'];
    const result = analyzeProfile({
      ...demoData,
      isDemoFallback: true,
      isDemoProfile: true,
    });
    setAnalysis(result);

    setTimeout(() => {
      const el = document.getElementById('audit-results');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Check URL query parameters for username (e.g. ?user=gaearon or ?demo=true)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demo = params.get('demo');
    const u = params.get('user') || params.get('u');
    if (demo === 'true') {
      handleTryDemo('demo-profile');
    } else if (u) {
      handleSearch(u);
    }
  }, []);

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setIsDemoMode(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setShowSettings(true)}
        rateLimitRemaining={rateLimitRemaining}
        onReset={handleReset}
        onTryDemo={() => handleTryDemo('demo-profile')}
      />

      <main className="flex-1">
        {/* Hero & Search Form */}
        <HeroSearch
          onSearch={handleSearch}
          onTryDemo={() => handleTryDemo('demo-profile')}
          isLoading={isLoading}
          error={error}
          onOpenSettings={() => setShowSettings(true)}
          token={token}
        />

        {/* Audit Results Dashboard */}
        {analysis && (
          <div id="audit-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            {/* Demo Profile Badge / Banner */}
            {isDemoMode && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border-2 border-amber-500/50 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-amber-300 uppercase font-mono tracking-wider">
                        DEMO PROFILE • SAMPLE DATA (JUDGE MODE)
                      </span>
                    </div>
                    <p className="text-amber-200/90 text-xs mt-0.5">
                      Demonstrating complete recruiter readiness audit without GitHub API dependency.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleTryDemo('alex-student')}
                    className="px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-amber-500/30 text-amber-300 text-xs font-mono cursor-pointer"
                  >
                    @alex-student
                  </button>
                  <button
                    onClick={() => handleTryDemo('gaearon')}
                    className="px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-amber-500/30 text-amber-300 text-xs font-mono cursor-pointer"
                  >
                    @gaearon
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-3 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 text-xs font-bold cursor-pointer"
                  >
                    Exit Demo Mode
                  </button>
                </div>
              </div>
            )}

            {/* Rate limit notification banner (when live API hits 403) */}
            {!isDemoMode && analysis.rateLimitWarning && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-300 block">Rate Limit / Demo Notice:</span>
                    <span className="text-amber-200/90">{analysis.rateLimitWarning}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>Add Token (5k/hr)</span>
                  </button>
                </div>
              </div>
            )}

            {/* 1. Profile Overview */}
            <ProfileCard
              analysis={analysis}
              onGenerateReadme={() => setSelectedRepoForReadme(analysis.flagshipProjects[0] || analysis.analyzedRepos[0])}
              onShareCard={() => setShowShareModal(true)}
            />

            {/* PRIORITY 1, 2, 3, 5: RECRUITER READINESS SCORE, EXPLAINABLE SCORING, DECISION & FASTEST PATH */}
            <RecruiterReadinessCard analysis={analysis} />

            {/* 2. Original GitHub Profile Signal Score (Preserved with 7 categories & radial gauge) */}
            <ScoreCard analysis={analysis} />

            {/* 3. PRIORITY 4 & 13: The 30-Second Recruiter Test & Simulated Scan */}
            <RecruiterTest analysis={analysis} />

            {/* 4. PRIORITY 6: 🔥 The Roast Chamber (Incident Reports & Meme Cards & Voice) */}
            <RoastChamber
              roasts={analysis.roasts}
              profileVoiceRoast={analysis.profileVoiceRoast}
              userName={analysis.user?.name || analysis.user?.login}
            />

            {/* 5. PRIORITY 7 & 8: 💪 Evidence-based Strengths & 🚨 Red Flags */}
            <StrengthsAndProblems
              strengths={analysis.strengths}
              problems={analysis.problems}
            />

            {/* 6. PRIORITY 9: 🚑 The Actionable Rescue Plan (Do Today, This Week, This Month) */}
            <RescuePlan rescuePlan={analysis.rescuePlan} />

            {/* 7. PRIORITY 10: 🔄 Before vs After Guide */}
            <BeforeAfter
              onOpenReadmeGenerator={() => setSelectedRepoForReadme(analysis.flagshipProjects[0] || analysis.analyzedRepos[0])}
            />

            {/* 8. PRIORITY 14 & 15: 🗂 Repository Analysis Breakdown with Telemetry & Disclaimer */}
            <RepoAnalysis
              analyzedRepos={analysis.analyzedRepos}
              onSelectRepoForReadme={(repo) => setSelectedRepoForReadme(repo)}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      {selectedRepoForReadme && (
        <ReadmeModal
          repo={selectedRepoForReadme}
          user={analysis ? analysis.user : null}
          onClose={() => setSelectedRepoForReadme(null)}
        />
      )}

      {showShareModal && analysis && (
        <ShareAuditModal
          analysis={analysis}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          token={token}
          onSaveToken={handleSaveToken}
          rateLimitRemaining={rateLimitRemaining}
          rateLimitReset={rateLimitReset}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
