import React from 'react';
import { Play, RotateCcw, Terminal } from 'lucide-react';

export const IDEView = () => (
  <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
    {/* Problem Statement Panel */}
    <div className="glass-panel rounded-2xl p-4 flex flex-col gap-2 shadow-lg shadow-blue-900/5 border border-white/40 shrink-0">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-extrabold text-blue-500 tracking-widest uppercase">Current Challenge</span>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Array Manipulation: The K-Sparse Problem</h1>
        </div>
        <div className="flex gap-2">
          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-600 rounded-full text-[10px] font-bold">Hard</span>
          <span className="px-2.5 py-0.5 bg-white/60 border border-slate-100 text-slate-500 rounded-full text-[10px] font-bold">45:00 Remaining</span>
        </div>
      </div>
      <p className="text-slate-600 text-xs leading-relaxed max-w-4xl">
        Given an array of integers <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">nums</code> and an integer <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">k</code>, return the maximum number of elements you can choose such that no two chosen elements have an absolute difference less than or equal to <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">k</code>.
      </p>
    </div>

    {/* Editor Module */}
    <div className="flex-1 glass-panel rounded-2xl overflow-hidden flex flex-col shadow-xl shadow-blue-900/5 border border-white/40">
      {/* Editor Header */}
      <div className="px-4 h-12 bg-white/30 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-white/60 rounded-lg border border-slate-100">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
            <span className="text-[10px] font-bold text-slate-700">Python 3.11</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium italic">main.py</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/40 transition-colors rounded-lg text-[10px] font-bold text-slate-600 border border-slate-100">
            <RotateCcw size={12} />
            Reset
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-[10px] font-bold shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Play size={12} fill="currentColor" />
            Run Tests
          </button>
        </div>
      </div>

      {/* Dark Code Editor Mockup */}
      <div className="flex-1 bg-[#0d1117] p-6 font-mono text-sm leading-6 overflow-auto custom-scrollbar">
        <div className="flex gap-6">
          <div className="text-slate-600 text-right select-none pr-4 border-r border-slate-800/50">
            1<br/>2<br/>3<br/>4<br/>5<br/>6<br/>7<br/>8<br/>9<br/>10<br/>11
          </div>
          <div className="flex-1">
            <span className="text-purple-400">def</span> <span className="text-blue-400">max_k_sparse_elements</span>(nums, k):<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-slate-500"># Sort the array to process in linear time</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;nums.sort()<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;count = <span className="text-orange-400">0</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;last_selected = -<span className="text-blue-400">float</span>(<span className="text-green-400">'inf'</span>)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">for</span> num <span className="text-purple-400">in</span> nums:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">if</span> num - last_selected &gt; k:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;count += <span className="text-orange-400">1</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;last_selected = num<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-400">return</span> count
          </div>
        </div>
      </div>

      {/* Console Output */}
      <div className="h-14 bg-slate-900 flex items-center px-6 gap-3 border-t border-slate-800">
        <Terminal size={14} className="text-blue-400" />
        <span className="text-blue-400/90 font-mono text-xs">Console: Ready for execution...</span>
      </div>
    </div>
  </div>
);
