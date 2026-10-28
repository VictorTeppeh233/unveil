import React from 'react';
import { ShieldCheck, Plus, Sparkles, FileText, Lock, SlidersHorizontal, Scale } from 'lucide-react';

interface HeaderProps {
  currentView: 'library' | 'chat' | 'privacy' | 'analysis' | 'sprints' | 'settings';
  onNavigate: (view: 'library' | 'chat' | 'privacy' | 'analysis' | 'sprints' | 'settings') => void;
  onOpenUpload: () => void;
  activeDocCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenUpload,
  activeDocCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200 shrink-0">
      {/* Zone 1: Single text element Brand Zone */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm tracking-wider">
          P
        </div>
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('library');
          }}
          className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-slate-700 transition-colors"
        >
          Private AI Workspace
        </a>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <button
          onClick={() => onNavigate('library')}
          className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'library'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-1'
              : 'hover:text-slate-900 pb-1'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Documents</span>
        </button>

        <button
          onClick={() => onNavigate('chat')}
          className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'chat'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-1'
              : 'hover:text-slate-900 pb-1'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Chat & Evidence</span>
        </button>

        <button
          onClick={() => onNavigate('privacy')}
          className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'privacy'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-1'
              : 'hover:text-slate-900 pb-1'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Privacy Bridge</span>
        </button>

        <button
          onClick={() => onNavigate('sprints')}
          className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'sprints'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-1'
              : 'hover:text-slate-900 pb-1'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sprint Tracker</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            currentView === 'settings'
              ? 'text-slate-900 font-semibold border-b-2 border-slate-900 pb-1'
              : 'hover:text-slate-900 pb-1'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Import Document</span>
        </button>
      </div>
    </header>
  );
};
