import React, { useState } from 'react';
import { LifeBuoy, CheckSquare, Square, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RescuePlan({ rescuePlan }) {
  // Local state for checking items off
  const [completedMap, setCompletedMap] = useState(() => {
    const initial = {};
    rescuePlan.forEach((group) => {
      group.tasks.forEach((task) => {
        if (task.done) {
          initial[task.id] = true;
        }
      });
    });
    return initial;
  });

  const toggleTask = (taskId) => {
    setCompletedMap((prev) => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      // If newly checked, trigger small confetti pop!
      if (!prev[taskId]) {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
          });
        } catch {
          // ignore if canvas-confetti unsupported
        }
      }
      return next;
    });
  };

  // Calculate overall completed tasks
  const allTasks = rescuePlan.flatMap((g) => g.tasks);
  const doneCount = allTasks.filter((t) => completedMap[t.id]).length;
  const totalCount = allTasks.length;
  const progressPercent = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#30363d]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
            <LifeBuoy className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Action Roadmap</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <span className="text-emerald-400">🚑</span>
            <span>THE RESCUE PLAN</span>
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Prioritized by return-on-time: fix critical flaws in minutes, not weeks
          </p>
        </div>

        {/* Progress Bar Header */}
        <div className="self-start sm:self-auto bg-[#0d1117] border border-[#30363d] p-3 rounded-xl min-w-[200px]">
          <div className="flex items-center justify-between text-xs mb-1 font-mono">
            <span className="text-zinc-400">Rescue Progress:</span>
            <span className="font-bold text-emerald-400">{doneCount}/{totalCount} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#21262d] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Plan Priorities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rescuePlan.map((group, gIdx) => (
          <div
            key={group.priority}
            className="p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between hover:border-[#444c56] transition-colors"
          >
            <div>
              {/* Group Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${group.badgeColor}`}>
                  {group.priority}
                </span>
                <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  {group.effort}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white mb-4">
                {group.title}
              </h4>

              {/* Tasks */}
              <div className="space-y-2.5">
                {group.tasks.map((task) => {
                  const isChecked = !!completedMap[task.id];
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-300'
                          : 'bg-[#161b22] border-[#30363d] hover:border-zinc-500 text-white'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 shrink-0 text-emerald-400 focus:outline-none"
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-500" />
                        )}
                      </button>
                      <div className="text-xs sm:text-sm leading-relaxed">
                        <span className={isChecked ? 'line-through text-zinc-400' : ''}>
                          {task.text}
                        </span>
                        {task.done && !isChecked && (
                          <span className="ml-2 text-[10px] text-emerald-400 font-mono">
                            (Detected on profile)
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#21262d] flex items-center justify-between text-[11px] text-zinc-500 font-mono">
              <span>Stage {gIdx + 1} of 4</span>
              <span>Click checkbox to mark solved</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
