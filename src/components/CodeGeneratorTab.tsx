import React, { useState } from 'react';
import { MatchWeights } from '../types';
import { generateWordPressPluginPHP } from '../utils';
import { Copy, Check, FileCode, ClipboardList, Puzzle, CheckSquare } from 'lucide-react';

interface CodeGeneratorTabProps {
  weights: MatchWeights;
}

export const CodeGeneratorTab: React.FC<CodeGeneratorTabProps> = ({ weights }) => {
  const [copied, setCopied] = useState(false);
  const phpCode = generateWordPressPluginPHP(weights);

  const handleCopy = () => {
    navigator.clipboard.writeText(phpCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* QUICK INSTRUCTIONS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-800 uppercase tracking-wider">
            <ClipboardList className="w-4 h-4 text-emerald-500" />
            1. Core Code Setup
          </div>
          <p className="text-slate-500 leading-relaxed font-semibold">
            Create <code className="font-mono bg-slate-200 px-1 py-0.5 text-[10px] rounded text-emerald-700">podsyndiconnect-core.php</code> inside <code className="font-mono bg-slate-200 px-1 py-0.5 text-[9px]">/wp-content/plugins/podsyndiconnect-core/</code>.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-800 uppercase tracking-wider">
            <CheckSquare className="w-4 h-4 text-sky-500" />
            2. Activate ACF Plugin
          </div>
          <p className="text-slate-500 leading-relaxed font-semibold">
            Activate the plugin. Ensure the <strong>Advanced Custom Fields (ACF) Pro/Free</strong> is active to automatically map user-profiles.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-800 uppercase tracking-wider">
            <Puzzle className="w-4 h-4 text-purple-500" />
            3. Dynamic Badge Widget
          </div>
          <p className="text-slate-500 leading-relaxed font-semibold">
            Embed the compatibility score shield on Elementor profile pages:
            <code className="block bg-slate-200 p-1 text-slate-900 font-mono mt-1 text-[10px] font-bold text-center select-all rounded border border-slate-300/35">[psc_match_score_badge_dynamic]</code>
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-slate-800 uppercase tracking-wider">
            <Puzzle className="w-4 h-4 text-amber-500 font-bold" />
            4. Embed Interactive App
          </div>
          <p className="text-slate-500 leading-relaxed font-semibold">
            Present this exact frontend simulator within any WordPress page/post:
            <code className="block bg-slate-200 p-1 text-slate-900 font-mono mt-1 text-[10px] font-bold text-center select-all rounded border border-slate-300/35">[psc_interactive_simulator]</code>
          </p>
        </div>

      </div>

      {/* WordPress Website Integration Info Section */}
      <div className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl text-xs space-y-1.5">
        <h4 className="font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>WordPress Website Deployment Guide</span>
        </h4>
        <p className="text-slate-600 leading-relaxed">
          To launch PodSyndiConnect as a genuine WordPress application, copy the generated PHP source code below into your plugins directory. You can embed the interactive partner directory, speaking analytics, and host studios seamlessly using standard shortcodes or Elementor page elements.
        </p>
      </div>

      {/* PHP EXPORT BLOCK CONSOLE */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col h-[520px]">
        
        {/* Header Action bar */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-500 font-bold" />
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block">PHP Plugin Ingest Source</span>
              <span className="text-[10px] text-slate-500 font-mono block font-medium">Customized coefficients compiled automatically</span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
              copied 
                ? 'bg-emerald-500 text-white' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied PHP Source!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Helper PHP Code
              </>
            )}
          </button>
        </div>

        {/* Code Box */}
        <div className="flex-1 p-5 overflow-auto bg-slate-950 text-slate-300 font-mono text-[11px] leading-relaxed relative">
          <pre className="p-1 select-all whitespace-pre-wrap selection:bg-amber-600 selection:text-white">
            <code>{phpCode}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
