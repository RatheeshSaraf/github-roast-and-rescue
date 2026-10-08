import React, { useState } from 'react';
import { X, Key, ShieldCheck, Check, Info, Trash2 } from 'lucide-react';

export default function SettingsModal({ token, onSaveToken, rateLimitRemaining, rateLimitReset, onClose }) {
  const [inputVal, setInputVal] = useState(token || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveToken(inputVal.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setInputVal('');
    onSaveToken('');
  };

  const resetFormatted = rateLimitReset ? new Date(rateLimitReset * 1000).toLocaleTimeString() : 'N/A';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-[#30363d] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-base text-white">GitHub API & Rate Limits</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-[#21262d] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Rate limit status card */}
          <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-between text-xs font-mono">
            <div>
              <span className="text-zinc-400 block">Remaining Rate Limit</span>
              <span className="text-base font-bold text-white">
                {rateLimitRemaining !== null ? `${rateLimitRemaining} requests` : 'Standard 60 req/hr'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-zinc-400 block">Resets At</span>
              <span className="text-zinc-200 font-bold">{resetFormatted}</span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-200 mb-1">
                Optional GitHub Personal Access Token (Read-Only)
              </label>
              <input
                type="password"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-[#0d1117] border border-[#30363d] focus:border-orange-500 rounded-xl py-2 px-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none font-mono"
              />
            </div>

            <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <p>
                A token is <strong>completely optional</strong>. Standard free searches do not require a token. Adding a token lifts your limit to 5,000 requests/hr. Your token is stored only in your local browser storage.
              </p>
            </div>

            <div className="flex items-center justify-between pt-3">
              {token ? (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Token</span>
                </button>
              ) : <div />}

              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-bold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {saved ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
