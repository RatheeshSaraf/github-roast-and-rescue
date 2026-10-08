import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSearch from './components/HeroSearch';
import ProfileCard from './components/ProfileCard';
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
import { analyzeProfile } from './utils/analyzer';

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('gh_token') || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [rateLimitRemaining, setRateLimitRemaining] = useState(null);
  const [rateLimitReset, setRateLimitReset] = useState(null);

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

  // Check URL query parameters for username (e.g. ?user=gaearon or ?u=alex-student)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('user') || params.get('u');
    if (u) {
      handleSearch(u);
    }
  }, []);

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navbar */}
      <Navbar
        onOpenSettings={() => setShowSettings(true)}
        rateLimitRemaining={rateLimitRemaining}
        onReset={handleReset}
      />

      <main className="flex-1">
        {/* Hero & Search Form */}
        <HeroSearch
          onSearch={handleSearch}
          isLoading={isLoading}
          error={error}
        />

        {/* Audit Results Dashboard */}
        {analysis && (
          <div id="audit-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            {/* 1. Profile Overview */}
            <ProfileCard
              analysis={analysis}
              onGenerateReadme={() => setSelectedRepoForReadme(analysis.flagshipProjects[0] || analysis.analyzedRepos[0])}
              onShareCard={() => setShowShareModal(true)}
            />

            {/* 2. Profile Score (Out of 100 with 7 categories) */}
            <ScoreCard analysis={analysis} />

            {/* 3. The 30-Second Recruiter Test */}
            <RecruiterTest analysis={analysis} />

            {/* 4. 🔥 The Roast Chamber */}
            <RoastChamber roasts={analysis.roasts} />

            {/* 5. 💪 Strengths & 🚨 Problems */}
            <StrengthsAndProblems
              strengths={analysis.strengths}
              problems={analysis.problems}
            />

            {/* 6. 🚑 The Rescue Plan (Roadmap + Checklist) */}
            <RescuePlan rescuePlan={analysis.rescuePlan} />

            {/* 7. 🔄 Before vs After */}
            <BeforeAfter
              onOpenReadmeGenerator={() => setSelectedRepoForReadme(analysis.flagshipProjects[0] || analysis.analyzedRepos[0])}
            />

            {/* 8. 🗂 Repository Analysis Breakdown */}
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
