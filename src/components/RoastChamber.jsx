import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Copy, 
  Check, 
  Volume2, 
  Play, 
  Pause, 
  Square, 
  Sparkles, 
  Smile, 
  Briefcase, 
  LifeBuoy 
} from 'lucide-react';
import MemeVisual from './MemeVisual';

export default function RoastChamber({ roasts = [], profileVoiceRoast = '', _userName = '' }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [roastMode, setRoastMode] = useState('savage'); // 'savage' | 'meme' | 'recruiter' | 'rescue'

  // Voice Roast state (Web Speech API)
  const [voiceTarget, setVoiceTarget] = useState(null); // 'profile' | number (index) | null
  const [isPaused, setIsPaused] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const stopVoice = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setVoiceTarget(null);
    setIsPaused(false);
  };

  const playVoice = (text, targetId) => {
    if (!synthRef.current || !text) return;

    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05; // natural snappy tempo
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setVoiceTarget(null);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setVoiceTarget(null);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
    setVoiceTarget(targetId);
    setIsPaused(false);
  };

  const pauseVoice = () => {
    if (synthRef.current && synthRef.current.speaking && !synthRef.current.paused) {
      synthRef.current.pause();
      setIsPaused(true);
    }
  };

  const resumeVoice = () => {
    if (synthRef.current && synthRef.current.paused) {
      synthRef.current.resume();
      setIsPaused(false);
    }
  };

  const handleCopy = (item, idx) => {
    const text = `${item.incidentNumber || `INCIDENT #${idx + 1}`} • ${item.title}\nSeverity: ${item.severity}\nEvidence: ${item.evidence}\nRoast: "${getRoastText(item)}"\nRescue: ${item.rescue}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getRoastText = (item) => {
    if (roastMode === 'meme' && item.roastModes?.meme) return item.roastModes.meme;
    if (roastMode === 'recruiter' && item.roastModes?.recruiter) return item.roastModes.recruiter;
    if (roastMode === 'rescue' && item.roastModes?.rescue) return item.roastModes.rescue;
    if (roastMode === 'savage' && item.roastModes?.savage) return item.roastModes.savage;
    return item.roast;
  };

  const roastModes = [
    { id: 'savage', label: 'Savage', icon: Flame, color: 'text-orange-400 border-orange-500/40 bg-orange-500/10' },
    { id: 'meme', label: 'Meme', icon: Smile, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { id: 'recruiter', label: 'Recruiter', icon: Briefcase, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
    { id: 'rescue', label: 'Rescue', icon: LifeBuoy, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  ];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6 pb-6 border-b border-[#30363d]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs font-semibold mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Constructive Developer Roasts • Evidence-Backed</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span className="text-orange-500">🔥</span>
            <span>INCIDENT REPORT ROASTS</span>
          </h3>
          <p className="text-sm text-zinc-400 mt-1 max-w-xl">
            Data-backed profile behavioral audits with visual meme breakdowns. Roasting the GitHub presentation, never the human.
          </p>
        </div>

        {/* Action Controls: Voice Roast Profile & Incident Count */}
        <div className="flex flex-wrap items-center gap-3 self-start lg:self-center">
          {profileVoiceRoast && (
            <button
              type="button"
              onClick={() => {
                if (voiceTarget === 'profile') {
                  if (isPaused) resumeVoice();
                  else pauseVoice();
                } else {
                  playVoice(profileVoiceRoast, 'profile');
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <Volume2 className="w-4 h-4 text-orange-400" />
              <span>
                {voiceTarget === 'profile'
                  ? isPaused
                    ? '▶ Resume Profile Voice'
                    : '⏸ Pause Profile Voice'
                  : '🔊 Roast My Profile'}
              </span>
            </button>
          )}

          {voiceTarget === 'profile' && (
            <button
              type="button"
              onClick={stopVoice}
              className="p-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/60 border border-red-500/40 text-red-400 text-xs transition-colors cursor-pointer"
              title="Stop voice"
            >
              <Square className="w-4 h-4" />
            </button>
          )}

          <span className="text-xs font-mono text-zinc-400 bg-[#0d1117] px-3 py-2 rounded-xl border border-[#30363d]">
            {roasts.length} Incidents Filed
          </span>
        </div>
      </div>

      {/* Feature 9: Roast Mode Selector */}
      <div className="mb-6 p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono font-bold uppercase text-zinc-300 tracking-wider">
            ROAST MODE:
          </span>
        </div>

        <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto">
          {roastModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = roastMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setRoastMode(mode.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  isActive
                    ? mode.color + ' shadow-md scale-102'
                    : 'bg-[#161b22] text-zinc-400 border-[#30363d] hover:text-white hover:bg-[#21262d]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Incident Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roasts.map((item, index) => {
          const isHigh = item.severity?.toLowerCase() === 'high';
          const isMed = item.severity?.toLowerCase() === 'medium';
          const roastText = getRoastText(item);
          const isThisPlaying = voiceTarget === index;

          return (
            <div
              key={index}
              className="rounded-2xl bg-[#0d1117] border border-[#30363d] overflow-hidden flex flex-col justify-between hover:border-orange-500/40 transition-all shadow-md group"
            >
              {/* Terminal Incident Header */}
              <div className="p-4 bg-[#161b22] border-b border-[#21262d] flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-orange-400 font-bold text-xs">
                    {item.incidentNumber || `INCIDENT #${String(index + 1).padStart(2, '0')}`}
                  </span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
                    {item.category || 'Profile'}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[10px] text-zinc-500 uppercase">SEVERITY:</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      isHigh
                        ? 'bg-red-950/60 text-red-400 border-red-500/40'
                        : isMed
                        ? 'bg-amber-950/60 text-amber-400 border-amber-500/40'
                        : 'bg-blue-950/60 text-blue-400 border-blue-500/40'
                    }`}
                  >
                    {item.severity || 'MEDIUM'}
                  </span>
                </div>
              </div>

              {/* Title, Evidence & Meme Visual */}
              <div className="p-5 space-y-3.5 flex-1">
                <h4 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
                  {item.title}
                </h4>

                {/* Feature 6 & 7: Original SVG Meme Visual */}
                <MemeVisual
                  type={item.memeType}
                  title={item.title}
                  evidence={item.evidence}
                />

                {/* Evidence Box */}
                {item.evidence && (
                  <div className="p-3 rounded-xl bg-[#161b22] border border-[#30363d] text-xs">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      EVIDENCE:
                    </span>
                    <p className="text-zinc-300 leading-relaxed font-mono">
                      {item.evidence}
                    </p>
                  </div>
                )}

                {/* The Roast Box */}
                <div className="p-3.5 rounded-xl bg-orange-950/20 border border-orange-500/30">
                  <div className="flex items-center justify-between gap-1.5 mb-1 font-mono">
                    <div className="flex items-center gap-1.5 text-xs font-black text-orange-400">
                      <Flame className="w-3.5 h-3.5" />
                      <span>THE ROAST [{roastMode.toUpperCase()}]:</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white leading-relaxed italic">
                    "{roastText}"
                  </p>
                </div>

                {/* Recruiter Impact */}
                {item.recruiterImpact && (
                  <div className="text-xs text-zinc-400">
                    <strong className="text-zinc-300 font-mono text-[11px] uppercase block mb-0.5">
                      Recruiter Impact:
                    </strong>
                    <p className="leading-relaxed">{item.recruiterImpact}</p>
                  </div>
                )}

                {/* The Rescue */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5 text-xs font-black text-emerald-400 font-mono">
                      <span>🚑 THE RESCUE:</span>
                    </div>
                    {item.expectedImprovement && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        Impact: {item.expectedImprovement}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed">
                    {item.rescue}
                  </p>
                </div>
              </div>

              {/* Card Footer: Voice Controls & Copy */}
              <div className="px-5 py-3 bg-[#161b22]/70 border-t border-[#21262d] flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
                {/* Feature 8: Individual Voice Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (isThisPlaying) {
                        if (isPaused) resumeVoice();
                        else pauseVoice();
                      } else {
                        playVoice(roastText, index);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition-all flex items-center gap-1 cursor-pointer border ${
                      isThisPlaying
                        ? 'bg-orange-500/20 border-orange-500/40 text-orange-300'
                        : 'bg-[#21262d] hover:bg-[#30363d] border-[#30363d] text-zinc-300 hover:text-white'
                    }`}
                  >
                    {isThisPlaying ? (
                      isPaused ? (
                        <>
                          <Play className="w-3 h-3 text-orange-400" />
                          <span>Resume</span>
                        </>
                      ) : (
                        <>
                          <Pause className="w-3 h-3 text-orange-400" />
                          <span>Pause</span>
                        </>
                      )
                    ) : (
                      <>
                        <Volume2 className="w-3 h-3 text-orange-400" />
                        <span>Play Roast</span>
                      </>
                    )}
                  </button>

                  {isThisPlaying && (
                    <button
                      type="button"
                      onClick={stopVoice}
                      className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] text-red-400 border border-[#30363d] cursor-pointer"
                      title="Stop audio"
                    >
                      <Square className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Copy button */}
                <button
                  type="button"
                  onClick={() => handleCopy(item, index)}
                  className="px-2.5 py-1 rounded bg-[#21262d] hover:bg-[#30363d] text-zinc-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                >
                  {copiedIdx === index ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-zinc-400" />
                      <span>Copy Incident</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
