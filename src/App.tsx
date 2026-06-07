import { useState, useEffect } from 'react';
import { GuestProfile, HostProfile, MatchWeights } from './types';
import { INITIAL_GUESTS, INITIAL_HOSTS, DEFAULT_WEIGHTS } from './data';
import { AdminPanel } from './components/AdminPanel';
import { HomePage } from './components/HomePage';
import { LiveStudio } from './components/LiveStudio';
import { CodeGeneratorTab } from './components/CodeGeneratorTab';
import { MemberPortal } from './components/MemberPortal';
import { AiMatchPage } from './components/AiMatchPage';
import { 
  Puzzle, 
  Wrench, 
  Database, 
  Sparkles, 
  Info,
  BookOpen,
  Layout,
  ExternalLink,
  Users,
  UserCheck,
  Globe,
  Settings,
  Cpu,
  Bookmark,
  Network,
  Lock
} from 'lucide-react';

export default function App() {
  // Global Database state representing WP postmeta / custom tables loaded cleanly from localStorage
  const [guests, setGuests] = useState<GuestProfile[]>(() => {
    try {
      const item = localStorage.getItem('psc_guests');
      return item ? JSON.parse(item) : INITIAL_GUESTS;
    } catch {
      return INITIAL_GUESTS;
    }
  });

  const [hosts, setHosts] = useState<HostProfile[]>(() => {
    try {
      const item = localStorage.getItem('psc_hosts');
      return item ? JSON.parse(item) : INITIAL_HOSTS;
    } catch {
      return INITIAL_HOSTS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('psc_guests', JSON.stringify(guests));
    } catch (e) {
      console.error(e);
    }
  }, [guests]);

  useEffect(() => {
    try {
      localStorage.setItem('psc_hosts', JSON.stringify(hosts));
    } catch (e) {
      console.error(e);
    }
  }, [hosts]);
  
  // Weights state representing ACF Options Page
  const [weights, setWeights] = useState<MatchWeights>(DEFAULT_WEIGHTS);

  // Active Elementor single profile being previewed
  const [activePreview, setActivePreview] = useState<{ type: 'guest' | 'host'; id: string }>(() => {
    return {
      type: 'guest',
      id: guests[0]?.id || 'guest_1',
    };
  });

  // Simulator navigation tab state
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'home' | 'studio' | 'database' | 'code' | 'portal' | 'aimatch'>('home');

  // Hoisted state for Live Viewer context modeling
  const [viewerType, setViewerType] = useState<'anonymous' | 'guest' | 'host'>('host');
  const [selectedViewerGuestId, setSelectedViewerGuestId] = useState<string>(() => guests[0]?.id || 'guest_1');
  const [selectedViewerHostId, setSelectedViewerHostId] = useState<string>(() => hosts[0]?.id || 'host_1');

  const handleSelectPreview = (type: 'guest' | 'host', id: string) => {
    setActivePreview({ type, id });
  };

  // Find preview details for headers
  const activePreviewName = activePreview.type === 'guest'
    ? guests.find(g => g.id === activePreview.id)?.displayName || 'Unknown Guest'
    : hosts.find(h => h.id === activePreview.id)?.showName || 'Unknown Host';

  // Find the selected viewer's display tag
  const activeViewerObject = viewerType === 'guest'
    ? guests.find(g => g.id === selectedViewerGuestId)
    : viewerType === 'host'
    ? hosts.find(h => h.id === selectedViewerHostId)
    : null;

  const viewerLabel = viewerType === 'anonymous'
    ? 'Anonymous Visitor'
    : viewerType === 'guest'
    ? `Guest: ${activeViewerObject?.displayName || 'Unknown'}`
    : `Host: ${(activeViewerObject as HostProfile)?.showName || 'Unknown'}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col overflow-hidden">
      
      {/* HEADER / WORDPRESS STYLE ADMIN BAR */}
      <header className="h-14 bg-slate-900 text-white flex items-center justify-between px-6 shrink-0 select-none shadow-md z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-extrabold text-slate-900 italic font-sans shadow-inner shrink-0">
            PS
          </div>
          <h1 className="text-md md:text-lg font-bold tracking-tight flex items-center gap-2">
            PodSyndiConnect 
            <span className="text-slate-400 font-normal text-xs font-mono bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/50">
              v1.4.2
            </span>
          </h1>
        </div>

        {/* Dynamic header navigation synced to tabs */}
        <nav className="hidden md:flex gap-6 text-sm font-semibold">
          <button 
            onClick={() => setActiveWorkspaceTab('home')}
            className={`transition-colors cursor-pointer py-1 border-b-2 font-semibold flex items-center gap-1 ${
              activeWorkspaceTab === 'home' 
                ? 'text-amber-400 border-amber-400 font-extrabold' 
                : 'text-slate-300 hover:text-amber-200 border-transparent'
            }`}
          >
            Home
          </button>
          <button 
            onClick={() => setActiveWorkspaceTab('portal')}
            className={`transition-colors cursor-pointer py-1 border-b-2 font-semibold flex items-center gap-1 ${
              activeWorkspaceTab === 'portal' 
                ? 'text-amber-400 border-amber-400 font-extrabold' 
                : 'text-slate-300 hover:text-amber-200 border-transparent'
            }`}
          >
            <Network className="w-4 h-4 text-amber-500" />
            My Profile Portal <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">Join</span>
          </button>
          <button 
            onClick={() => setActiveWorkspaceTab('aimatch')}
            className={`transition-colors cursor-pointer py-1 border-b-2 font-semibold flex items-center gap-1 ${
              activeWorkspaceTab === 'aimatch' 
                ? 'text-amber-400 border-amber-400 font-extrabold' 
                : 'text-slate-300 hover:text-amber-200 border-transparent'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            AI Matchmaker Spin
          </button>
          <button 
            onClick={() => setActiveWorkspaceTab('studio')}
            className={`transition-colors cursor-pointer py-1 border-b-2 font-semibold ${
              activeWorkspaceTab === 'studio' 
                ? 'text-amber-400 border-amber-400' 
                : 'text-slate-300 hover:text-amber-200 border-transparent'
            }`}
          >
            Dashboard (Live Studio)
          </button>
          <button 
            onClick={() => setActiveWorkspaceTab('database')}
            className={`transition-colors cursor-pointer py-1 border-b-2 font-semibold ${
              activeWorkspaceTab === 'database' 
                ? 'text-amber-400 border-amber-400' 
                : 'text-slate-300 hover:text-amber-200 border-transparent'
            }`}
          >
            ACF Sync & Database
          </button>
          <button 
            onClick={() => setActiveWorkspaceTab('code')}
            className={`transition-colors cursor-pointer py-1 border-b-2 font-semibold ${
              activeWorkspaceTab === 'code' 
                ? 'text-amber-400 border-amber-400' 
                : 'text-slate-300 hover:text-amber-200 border-transparent'
            }`}
          >
            PHP Settings Page
          </button>
        </nav>

        {/* Activity Status Node */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <span className="text-xs text-slate-300 font-mono hidden sm:inline tracking-wider">PSC-NODE ACTIVE</span>
        </div>
      </header>

      {/* TOP COMPACT STATS / PREVIEW HIGHLIGHTS BAR */}
      <section className="bg-white border-b border-slate-200 py-2.5 px-6 shrink-0 select-none shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs font-medium">
          <div className="flex items-center gap-2 flex-wrap text-slate-600">
            <span className="font-bold flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
              <Layout className="w-3.5 h-3.5 text-amber-500" />
              Active Elementor Canvas:
            </span>
            <span className="text-slate-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/55 font-bold">
              {activePreview.type === 'guest' ? 'psc_guest' : 'psc_host'}
            </span>
            <span className="text-slate-400 font-bold">→</span>
            <span className="text-slate-900 font-semibold italic bg-slate-100 px-2 py-0.5 rounded-md">
              {activePreviewName}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono">
            <span>DATABASE WEIGHTS STATUS: <strong className="text-emerald-600">ONLINE</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>Total posts: <strong>{guests.length + hosts.length}</strong></span>
          </div>
        </div>
      </section>

      {/* MAIN WORKSPACE WRAPPER */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* SIDEBAR NAVIGATION PANEL (240px) */}
        <aside className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none overflow-y-auto hidden md:flex">
          
          {/* Section 0: User Session / My Portal */}
          <div className="p-4 border-b border-slate-150 bg-slate-50/60 space-y-2">
            <button
              onClick={() => setActiveWorkspaceTab('home')}
              className={`w-full flex items-center justify-start text-xs p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeWorkspaceTab === 'home'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 hover:bg-slate-100 border border-transparent'
              }`}
            >
              Home Directory
            </button>
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pt-2">
              My Profile Center
            </p>
            <button
              onClick={() => setActiveWorkspaceTab('portal')}
              className={`w-full flex items-center justify-between text-xs p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeWorkspaceTab === 'portal'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 font-sans">
                <Network className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">My Dual-Role Portal</span>
              </div>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.2 rounded font-sans uppercase shrink-0">
                Join
              </span>
            </button>

            {/* AI Matchmaker Spin selection option */}
            <button
              onClick={() => setActiveWorkspaceTab('aimatch')}
              className={`w-full flex items-center justify-between text-xs p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeWorkspaceTab === 'aimatch'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-sans font-black'
                  : 'text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-center gap-1.5 min-w-0 font-sans">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="truncate">AI Matchmaker Spin</span>
              </div>
              {viewerType === 'anonymous' ? (
                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              ) : (
                <span className="bg-slate-950 text-amber-400 text-[8px] font-mono px-1.5 py-0.2 rounded font-sans uppercase font-extrabold shrink-0">
                  Spin
                </span>
              )}
            </button>
          </div>

          {/* Section 1: Data Layer Custom Post Types */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Data Layer (WordPress CPT)
            </p>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => {
                    setActiveWorkspaceTab('database');
                    // Toggling tab behaves nicely
                  }}
                  className={`w-full flex items-center justify-between text-sm p-2 rounded-lg font-medium transition-all cursor-pointer ${
                    activeWorkspaceTab === 'database'
                      ? 'bg-amber-50 text-amber-900 font-semibold border-l-4 border-amber-500 pl-1.5'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-amber-500" />
                    <span>Guest Profiles</span>
                  </div>
                  <span className="bg-slate-100 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold text-slate-500">
                    {guests.length}
                  </span>
                </button>
              </li>

              <li>
                <button
                  onClick={() => {
                    setActiveWorkspaceTab('database');
                  }}
                  className={`w-full flex items-center justify-between text-sm p-2 rounded-lg font-medium transition-all cursor-pointer ${
                    activeWorkspaceTab === 'database'
                      ? 'bg-amber-50 text-amber-900 font-semibold border-l-4 border-amber-500 pl-1.5'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-500" />
                    <span>Host Profiles</span>
                  </div>
                  <span className="bg-slate-100 text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold text-slate-500">
                    {hosts.length}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Section 2: Active Dynamic Viewer Context */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Active Viewer Context
            </p>
            
            {/* Context Widget Card designed in perfect layout */}
            <div className={`p-3.5 rounded-xl border transition-colors ${
              viewerType === 'anonymous'
                ? 'bg-slate-50 border-slate-200 text-slate-700'
                : viewerType === 'guest'
                ? 'bg-emerald-50 border-emerald-100 text-emerald-900'
                : 'bg-blue-50 border-blue-100 text-blue-900'
            }`}>
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  viewerType === 'anonymous' ? 'bg-slate-400' : 'bg-emerald-400'
                }`} />
                <span className="text-xs font-bold uppercase tracking-wide">
                  {viewerType === 'anonymous' ? 'Locked Mode' : viewerType === 'guest' ? 'Guest Mode' : 'Host Mode'}
                </span>
              </div>
              <p className="text-[11px] font-medium leading-relaxed mt-1 opacity-90 truncate">
                {viewerType === 'anonymous' ? 'Logged Out Visitor' : viewerLabel}
              </p>
              
              {/* Context Picker synced across whole workspace */}
              <div className="mt-2.5 pt-2.5 border-t border-slate-200/50 flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Simulate Role:</label>
                <select
                  value={viewerType}
                  onChange={(e) => setViewerType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 text-xs px-2 py-1.5 rounded-lg font-medium shadow-xs focus:ring-1 focus:ring-amber-500 outline-hidden"
                >
                  <option value="anonymous">Anonymous (Logged Out)</option>
                  <option value="guest">Guest Perspective</option>
                  <option value="host">Host Perspective</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Weights quick indicator widgets */}
          <div className="p-4 space-y-3">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
              Algorithm Setup
            </p>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => setActiveWorkspaceTab('code')}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-slate-600 hover:bg-slate-50 text-left transition-colors cursor-pointer ${
                  activeWorkspaceTab === 'code' ? 'bg-amber-50 text-amber-900 font-semibold pl-1.5' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Wrench className="w-3.5 h-3.5 text-slate-400" />
                  <span>WordPress ACF Hooks</span>
                </div>
              </button>
              
              {/* Micro diagnostic widgets */}
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
                  <span>Custom Weights</span>
                  <span className="font-mono">ON</span>
                </div>
                <div className="text-[11px] font-mono text-slate-600 flex justify-between items-center">
                  <span>Topics core coef</span>
                  <span className="font-bold text-slate-900">{(weights.topics * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Micro Cache status */}
          <div className="mt-auto p-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono bg-slate-50">
            <span>SHORTCODE: <span className="text-emerald-600 font-bold">ONLINE</span></span>
            <span>LOGS: ON</span>
          </div>
        </aside>

        {/* WORKSPACE APP CONTENT LAYER */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8 flex flex-col gap-6 relative">
          
          {/* MOBILE TAB WORKSPACE SELECTOR BAR */}
          <div className="flex md:hidden bg-white p-1 rounded-xl border border-slate-200 text-[10px] font-bold shrink-0 shadow-xs gap-1 select-none overflow-x-auto">
            <button
              onClick={() => setActiveWorkspaceTab('home')}
              className={`px-2.5 py-1.5 rounded-lg transition-all text-center cursor-pointer shrink-0 ${
                activeWorkspaceTab === 'home'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('portal')}
              className={`px-2.5 py-1.5 rounded-lg transition-all text-center cursor-pointer shrink-0 ${
                activeWorkspaceTab === 'portal'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              My Portal
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('aimatch')}
              className={`px-2.5 py-1.5 rounded-lg transition-all text-center cursor-pointer shrink-0 ${
                activeWorkspaceTab === 'aimatch'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              AI Match
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('studio')}
              className={`px-2.5 py-1.5 rounded-lg transition-all text-center cursor-pointer shrink-0 ${
                activeWorkspaceTab === 'studio'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Live Editor
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('database')}
              className={`px-2.5 py-1.5 rounded-lg transition-all text-center cursor-pointer shrink-0 ${
                activeWorkspaceTab === 'database'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Post Meta
            </button>
            <button
              onClick={() => setActiveWorkspaceTab('code')}
              className={`px-2.5 py-1.5 rounded-lg transition-all text-center cursor-pointer shrink-0 ${
                activeWorkspaceTab === 'code'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              WP Code
            </button>
          </div>

          {/* DYNAMIC SCREEN LAYOUT INSERTS */}
          <div className="flex-1 min-h-0 font-sans">
            {activeWorkspaceTab === 'home' && (
              <HomePage
                guests={guests}
                hosts={hosts}
                setActiveWorkspaceTab={setActiveWorkspaceTab}
                onSelectPreview={handleSelectPreview}
                viewerType={viewerType}
              />
            )}

            {activeWorkspaceTab === 'portal' && (
              <MemberPortal
                guests={guests}
                hosts={hosts}
                onUpdateGuests={setGuests}
                onUpdateHosts={setHosts}
                viewerType={viewerType}
                setViewerType={setViewerType}
                setSelectedViewerGuestId={setSelectedViewerGuestId}
                setSelectedViewerHostId={setSelectedViewerHostId}
                onSelectPreview={handleSelectPreview}
                setActiveWorkspaceTab={setActiveWorkspaceTab}
              />
            )}

            {activeWorkspaceTab === 'aimatch' && (
              <AiMatchPage
                guests={guests}
                hosts={hosts}
                weights={weights}
                viewerType={viewerType}
                selectedViewerGuestId={selectedViewerGuestId}
                selectedViewerHostId={selectedViewerHostId}
                onSelectPreview={handleSelectPreview}
                setActiveWorkspaceTab={setActiveWorkspaceTab}
              />
            )}

            {activeWorkspaceTab === 'studio' && (
              <LiveStudio
                guests={guests}
                hosts={hosts}
                weights={weights}
                activePreview={activePreview}
                onSelectPreview={handleSelectPreview}
                viewerType={viewerType}
                setViewerType={setViewerType}
                selectedViewerGuestId={selectedViewerGuestId}
                setSelectedViewerGuestId={setSelectedViewerGuestId}
                selectedViewerHostId={selectedViewerHostId}
                setSelectedViewerHostId={setSelectedViewerHostId}
              />
            )}

            {activeWorkspaceTab === 'database' && (
              <AdminPanel
                guests={guests}
                hosts={hosts}
                weights={weights}
                onUpdateGuests={setGuests}
                onUpdateHosts={setHosts}
                onUpdateWeights={setWeights}
                onSelectPreview={handleSelectPreview}
                selectedPreviewId={activePreview.id}
              />
            )}

            {activeWorkspaceTab === 'code' && (
              <CodeGeneratorTab weights={weights} />
            )}
          </div>

          {/* COMPREHENSIVE ARCHITECTURAL DOCUMENTATION FOOTER */}
          <footer className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shrink-0 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-500" strokeWidth={2.5} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                PodSyndiConnect Architectural Integration Spec
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs leading-relaxed text-slate-500">
              <div className="space-y-1 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800">1. CPT Layer</h4>
                <p>
                  Two custom post types register programmatically: <code className="font-mono bg-slate-100 px-1 rounded text-red-500">psc_guest</code> (competent guest speakers) and <code className="font-mono bg-slate-150 px-1 rounded text-sky-600">psc_host</code> (podcast properties).
                </p>
              </div>

              <div className="space-y-1 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800">2. Weights Engine</h4>
                <p>
                  Comparing fields (industry, languages, geographical details, broadcast formats) using floating-point coefficients stored in dynamic Option page arrays.
                </p>
              </div>

              <div className="space-y-1 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800">3. Context Rules</h4>
                <p>
                  Badge changes dynamically: logged-in Hosts view Guest profiles (Host→Guest), guests inspect shows (Guest→Host), while unregistered visitors see a secure login shield widget.
                </p>
              </div>

              <div className="space-y-1 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-800">4. Shortcode API</h4>
                <p>
                  Embed score graphics on post layouts via widget or shortcode: <code className="font-mono bg-slate-150 text-[10px] px-1.5 py-0.5 rounded text-emerald-600 font-bold">[psc_match_score_badge_dynamic]</code>.
                </p>
              </div>
            </div>

            {/* Micro Footer Bar designed perfectly to replicate the layout of the mockup */}
            <div className="pt-4 border-t border-slate-200 mt-2 text-[10px] text-slate-400 font-mono text-center flex flex-col sm:flex-row justify-between items-center gap-2 select-none">
              <span>© 2026 PodSyndiConnect WP Plugin Development Suite</span>
              <div className="flex items-center gap-2">
                <span>Vite + React + Motion</span>
                <span>•</span>
                <span>WordPress DB v6.4.2 Connected via ACF Pro SDK</span>
              </div>
            </div>
          </footer>
          
        </main>
      </div>

      {/* SYSTEM STATUS FOOTER RIG */}
      <footer className="h-8 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 select-none z-10 text-[10px] text-slate-400">
        <div className="flex items-center gap-4">
          <span>WP-DB Version: 6.4.1</span>
          <span className="hidden sm:inline">ACF Pro Detected</span>
          <span className="hidden md:inline">Elementor Widget Registry: OK</span>
        </div>
        <div className="font-medium text-slate-500">
          PodSyndiConnect Engine Running • Total Profiles: {guests.length + hosts.length}
        </div>
      </footer>

    </div>
  );
}
