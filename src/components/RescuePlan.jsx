import React, { useState } from 'react';
import { LifeBuoy, CheckSquare, Square, Clock, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RescuePlan({ rescuePlan = [] }) {
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
      if (!prev[taskId]) {
        try {
          confetti({
            particleCount: 45,
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

  const allTasks = rescuePlan.flatMap((g) => g.tasks);
  const doneCount = allTasks.filter((t) => completedMap[t.id]).length;
  const totalCount = allTasks.length;
  const progressPercent = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

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
            <span>ACTIONABLE RESCUE PLAN</span>
          </h3>
          <p className="text-sm text-zinc-400 mt-1">
            Prioritized by return-on-investment: structured into DO TODAY, DO THIS WEEK, and DO THIS MONTH
          </p>
        </div>

        {/* Progress Bar Header */}
        <div className="self-start sm:self-auto bg-[#0d1117] border border-[#30363d] p-3.5 rounded-xl min-w-[220px]">
          <div className="flex items-center justify-between text-xs mb-1.5 font-mono">
            <span className="text-zinc-400">Rescue Checklist:</span>
            <span className="font-bold text-emerald-400">{doneCount}/{totalCount} ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#21262d] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Plan Priorities Grid: DO TODAY / DO THIS WEEK / DO THIS MONTH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {rescuePlan.map((group, gIdx) => (
          <div
            key={gIdx}
            className="rounded-2xl bg-[#0d1117] border border-[#30363d] p-5 flex flex-col justify-between hover:border-[#444c56] transition-colors"
          >
            <div>
              {/* Card Group Header */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-lg border text-xs font-black uppercase tracking-wider font-mono ${group.badgeColor}`}>
                  {group.priority}
                </span>
                <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-zinc-500" />
                  {group.effort}
                </span>
              </div>

              <h4 className="text-base font-black text-white mb-4 tracking-tight">
                {group.title}
              </h4>

              {/* Task Items */}
              <div className="space-y-3">
                {group.tasks.map((task) => {
                  const isDone = !!completedMap[task.id];
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-start gap-3 cursor-pointer text-xs ${
                        isDone
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-300'
                          : 'bg-[#161b22] border-[#30363d] text-zinc-200 hover:border-[#444c56]'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Square className="w-4 h-4 text-zinc-500 hover:text-zinc-400" />
                        )}
                      </div>
                      <span className={`leading-relaxed ${isDone ? 'line-through text-zinc-500' : ''}`}>
                        {task.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#21262d] text-[11px] text-zinc-500 font-mono flex items-center justify-between">
              <span>{group.tasks.filter((t) => completedMap[t.id]).length} of {group.tasks.length} done</span>
              {group.tasks.every((t) => completedMap[t.id]) && (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
