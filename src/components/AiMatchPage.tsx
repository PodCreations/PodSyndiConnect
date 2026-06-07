import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  RefreshCw, 
  Dices, 
  User, 
  Tv, 
  MapPin, 
  Award, 
  Flame, 
  Layers, 
  ChevronRight, 
  Lock, 
  Mail, 
  Globe, 
  ShieldCheck, 
  BookOpen, 
  Calendar,
  Check,
  Search,
  ExternalLink,
  ChevronDown,
  Volume2
} from 'lucide-react';
import { GuestProfile, HostProfile, MatchWeights } from '../types';
import { calculateMatchScore } from '../utils';
import { BadgeWidget } from './BadgeWidget';

interface AiMatchPageProps {
  guests: GuestProfile[];
  hosts: HostProfile[];
  weights: MatchWeights;
  viewerType: 'anonymous' | 'guest' | 'host';
  selectedViewerGuestId: string;
  selectedViewerHostId: string;
  onSelectPreview?: (type: 'guest' | 'host', id: string) => void;
  setActiveWorkspaceTab?: (tab: 'portal' | 'studio' | 'database' | 'code' | 'aimatch') => void;
}

// Default background assets
const defaultHeaderImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop';

export const AiMatchPage: React.FC<AiMatchPageProps> = ({
  guests,
  hosts,
  weights,
  viewerType,
  selectedViewerGuestId,
  selectedViewerHostId,
  onSelectPreview,
  setActiveWorkspaceTab,
}) => {
  // 1. Dynamic Mock Data Pool Generators for High-Fidelity paging/spinning
  const [completeGuestsPool, setCompleteGuestsPool] = useState<GuestProfile[]>([]);
  const [completeHostsPool, setCompleteHostsPool] = useState<HostProfile[]>([]);

  useEffect(() => {
    // Generate 100 mock guests total based on database items
    const guestNames = ["Sarah", "Alex", "David", "Emma", "Julio", "Naomi", "Kenji", "Fatima", "Chloe", "Raymond", "Sophia", "Zayn", "Elena", "Marcus", "Tanya", "Arthur", "Hassan", "Mei", "Clara", "DeAndre"];
    const lastNames = ["Chen", "Rodriguez", "O'Connor", "Kim", "Mwangi", "Al-Farsi", "Patel", "Vogel", "Dupont", "Sato", "Ivanov", "Silva", "Taylor", "Wilson", "Gomez"];
    const locations = ["Austin, TX, USA", "San Francisco, CA, USA", "London, UK", "Paris, France", "Atlanta, GA, USA", "Seattle, WA, USA", "Miami, FL, USA", "Toronto, ON, Canada", "Chicago, IL, USA", "Denver, CO, USA"];
    const topicsPool = [
      'AI & Automation', 'Tech Ethics', 'Scientific Breakthroughs', 'Future of Work',
      'Entrepreneurship', 'Scaling a Business', 'Brand Building', 'Marketing Strategy',
      'Nutrition', 'Burnout Recovery', 'Habits', 'Biohacking',
      'Gaming', 'Creative Process', 'Storytelling', 'Design Thinking'
    ];
    const industries = ["Technology", "Business/Finance", "Health & Wellness", "Arts/Education"];
    const experienceLevels: ('Beginner' | 'Intermediate' | 'Expert')[] = ['Beginner', 'Intermediate', 'Expert'];
    const formats = ["Interview", "Panel/Roundtable", "Solo/Co-host"];
    const audiencePreferences: ('Niche/Micro' | 'Emerging/Mid' | 'Established/Large')[] = ['Niche/Micro', 'Emerging/Mid', 'Established/Large'];

    let gPool = [...guests];
    while (gPool.length < 100) {
      const idx = gPool.length;
      const fn = guestNames[idx % guestNames.length];
      const ln = lastNames[(idx * 3) % lastNames.length];
      const ind = industries[idx % industries.length];
      const exp = experienceLevels[(idx * 7) % experienceLevels.length];
      const loc = locations[idx % locations.length];
      const aud = audiencePreferences[(idx * 11) % audiencePreferences.length];
      
      const ts = [
        topicsPool[idx % topicsPool.length],
        topicsPool[(idx + 4) % topicsPool.length],
        topicsPool[(idx + 8) % topicsPool.length]
      ];

      gPool.push({
        id: `mock_guest_${idx + 1}`,
        displayName: `Dr. ${fn} ${ln}`,
        bio: `Eminent authority on ${ts[0]}. Over 8 years translating cutting-edge techniques into scalable practices. Featured speaker at globally accredited keynotes on ${ts.slice(0, 2).join(' & ')}.`,
        topics: ts,
        industry: ind,
        experienceLevel: exp,
        location: loc,
        remotePreference: idx % 3 === 0 ? 'Remote Only' : idx % 3 === 1 ? 'In-Person Only' : 'Hybrid',
        languages: ['English', idx % 4 === 0 ? 'Spanish' : 'English'],
        audiencePreference: aud,
        preferredFormats: [formats[idx % formats.length], formats[(idx + 1) % formats.length]],
        tags: [ind.replace(/ & /g, '').replace(/\//g, ''), 'Speaker', 'Co-Host'],
        avatarUrl: `https://images.unsplash.com/photo-${1500648767791 + (idx * 54321) % 1000000}?w=150&h=150&fit=crop&crop=face`,
        headerBgUrl: `https://images.unsplash.com/photo-${1519389950473 + (idx * 87654) % 1000000}?w=1200&h=400&fit=crop`,
        emailContact: `${fn.toLowerCase()}.${ln.toLowerCase()}@podsyndi-ambassador.com`,
      });
    }
    setCompleteGuestsPool(gPool);

    let hPool = [...hosts];
    const HostShows = ["The Tech Pulse Podcast", "Business Mastery Chronicles", "Healthy Horizons", "The Creative Canvas", "Startup Rocket Fuel", "Beyond the Horizon Show", "Future Frontiers Radio", "The Narrative Lounge", "Health Builders Weekly", "Digital Age Insider"];
    while (hPool.length < 100) {
      const idx = hPool.length;
      const showTitle = `${HostShows[idx % HostShows.length]} - Series #${Math.floor(idx / HostShows.length) + 1}`;
      const ind = industries[idx % industries.length];
      const aud = audiencePreferences[idx % audiencePreferences.length];
      const loc = locations[(idx * 2) % locations.length];
      const exp = experienceLevels[(idx * 6) % experienceLevels.length];

      const ts = [
        topicsPool[idx % topicsPool.length],
        topicsPool[(idx * 2 + 1) % topicsPool.length],
        topicsPool[(idx * 3 + 2) % topicsPool.length]
      ];

      hPool.push({
        id: `mock_host_${idx + 1}`,
        showName: showTitle,
        description: `Enlightening show highlighting dynamic advancements. We examine core trajectories surrounding ${ts.slice(0, 2).join(' alongside ')}. Seeking experts with high technical fluency.`,
        showTopics: ts,
        industry: ind,
        format: formats[(idx * 2) % formats.length] as any,
        audienceSize: aud,
        location: loc,
        remoteOptions: idx % 3 === 0 ? 'Remote Only' : idx % 3 === 1 ? 'In-Person Only' : 'Hybrid',
        languages: ['English', idx % 5 === 0 ? 'Spanish' : 'English'],
        guestRequirements: `Must enjoy deep, unscripted discussions and show a strong command of ${ts[0]}.`,
        requiredExperienceLevel: exp,
        tags: [ind.replace(/ & /g, '').replace(/\//g, ''), 'Broadcast', 'Syndication'],
        logoUrl: `https://images.unsplash.com/photo-${1507679799987 + (idx * 65432) % 1000000}?w=150&h=150&fit=crop`,
        headerBgUrl: `https://images.unsplash.com/photo-${1557683316 + (idx * 98765) % 1000000}?w=1200&h=400&fit=crop`,
        hostEmail: `producer@${showTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`
      });
    }
    setCompleteHostsPool(hPool);
  }, [guests, hosts]);

  // 2. Active Logged-In User Profile Calculation
  const getLoggedInProfile = () => {
    if (viewerType === 'guest') {
      return guests.find(g => g.id === selectedViewerGuestId) || guests[0];
    } else if (viewerType === 'host') {
      return hosts.find(h => h.id === selectedViewerHostId) || hosts[0];
    }
    return null;
  };

  const loggedInProfile = getLoggedInProfile();

  // 3. Match Engine State Machine
  const [currentBatchIndex, setCurrentBatchIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [spinTickerName, setSpinTickerName] = useState<string>('');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [bookingLoggedId, setBookingLoggedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto calculate matching list when loggedInProfile, weights, or pool updates
  useEffect(() => {
    if (!loggedInProfile) return;

    let computed: any[] = [];
    if (viewerType === 'guest') {
      // Logged-in Guest matches with HOST shows
      const activeGuest = loggedInProfile as GuestProfile;
      computed = completeHostsPool.map(hostRow => {
        const trace = calculateMatchScore(activeGuest, hostRow, weights);
        return {
          profile: hostRow,
          type: 'host',
          score: trace.compositeScore,
          trace: trace
        };
      });
    } else if (viewerType === 'host') {
      // Logged-in Host matches with GUEST speakers
      const activeHost = loggedInProfile as HostProfile;
      computed = completeGuestsPool.map(guestRow => {
        const trace = calculateMatchScore(guestRow, activeHost, weights);
        return {
          profile: guestRow,
          type: 'guest',
          score: trace.compositeScore,
          trace: trace
        };
      });
    }

    // Sort descending by calculated index score
    computed.sort((a, b) => b.score - a.score);
    setMatchingResults(computed);
    setCurrentBatchIndex(0);
    setExpandedMatchId(null);
  }, [loggedInProfile, viewerType, completeGuestsPool, completeHostsPool, weights]);

  // Handle the spectacular "Spin & Win" matcher effect
  const handleSpinAndMatch = () => {
    if (isSpinning || matchingResults.length === 0) return;
    
    setIsSpinning(true);
    setExpandedMatchId(null);
    setBookingLoggedId(null);

    // Dynamic slot-machine ticker sound-effect timing simulation
    let tickCount = 0;
    const totalTicks = 15;
    const interval = setInterval(() => {
      const randomIdx = Math.floor(Math.random() * matchingResults.length);
      const randomItem = matchingResults[randomIdx];
      const randomName = randomItem.type === 'guest' 
        ? (randomItem.profile as GuestProfile).displayName 
        : (randomItem.profile as HostProfile).showName;
      
      setSpinTickerName(randomName);
      tickCount++;

      if (tickCount >= totalTicks) {
        clearInterval(interval);
        
        // Settle on the next batch of 25 sorted matches
        setCurrentBatchIndex(prev => {
          const nextIndex = prev + 1;
          const totalBatches = Math.ceil(matchingResults.length / 25);
          return nextIndex >= totalBatches ? 0 : nextIndex;
        });
        
        setIsSpinning(false);
      }
    }, 90);
  };

  // Safe checks for rendering
  if (viewerType === 'anonymous' || !loggedInProfile) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8 text-center max-w-2xl mx-auto space-y-6 my-12 relative animate-fade-in divide-y divide-slate-100">
        <div className="absolute top-4 left-6 flex items-center gap-2 select-none">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 text-[#D4AF37] font-mono text-[9px] px-3 py-1 rounded-full font-bold">
            🔒 SECURE GATEWAY ENFORCED
          </div>
        </div>
        
        <div className="pt-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 inline-flex items-center justify-center mx-auto ring-4 ring-amber-50">
            <Lock className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <h2 className="font-display font-black text-3xl uppercase tracking-tight text-slate-800">
            AI Matchmaker Restrictive Shield
          </h2>
          <p className="font-sans text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            The dynamic synergy matcher operates purely using ACF metadata relationships mapped to logged-in user profiles. Anonymous spectators are locked out.
          </p>
        </div>

        <div className="pt-6 space-y-4">
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-150 text-slate-600 text-xs">
            <p className="font-bold text-slate-700 mb-1">To access the AI Matchmaker Portal:</p>
            <p>Select either <strong className="text-emerald-700">Guest Perspective</strong> or <strong className="text-blue-700">Host Perspective</strong> inside the <strong className="text-slate-800">Active Viewer Context</strong> widget in the left sidebar simulator panel.</p>
          </div>
          
          <div className="text-[10px] font-mono text-slate-400">
            POST_ROUTE: index.php?page=psc-ai-match-simulator (Error code: Status 403 Forbidden)
          </div>
        </div>
      </div>
    );
  }

  // Define active preview structures corresponding to layout requirements
  const isProfileGuest = viewerType === 'guest';
  const headerBgUrl = loggedInProfile.headerBgUrl || defaultHeaderImage;
  const avatarUrl = isProfileGuest 
    ? (loggedInProfile as GuestProfile).avatarUrl 
    : (loggedInProfile as HostProfile).logoUrl;
  const displayName = isProfileGuest 
    ? (loggedInProfile as GuestProfile).displayName 
    : (loggedInProfile as HostProfile).showName;

  // Active batch parameters 25 items slice
  const startIndex = currentBatchIndex * 25;
  const endIndex = startIndex + 25;
  
  // Filter matches if search active
  const filteredMatches = matchingResults.filter(item => {
    if (!searchQuery) return true;
    const name = item.type === 'guest' 
      ? (item.profile as GuestProfile).displayName 
      : (item.profile as HostProfile).showName;
    const bio = item.type === 'guest'
      ? (item.profile as GuestProfile).bio
      : (item.profile as HostProfile).description;
    const ind = item.profile.industry;
    
    return `${name} ${bio} ${ind}`.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const pagedMatches = filteredMatches.slice(startIndex, endIndex);
  const totalMatchesCount = filteredMatches.length;
  const maxBatches = Math.ceil(totalMatchesCount / 25);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12 select-none">
      
      {/* SECTION A: WORDPRESS STYLED LOGGEN-IN ACTIVE USER HEADER (THE 'SAME PAGE LAYOUT') */}
      <div className="bg-gradient-to-b from-[#D4AF37]/60 via-slate-200 to-slate-300 p-[1.5px] rounded-3xl shadow-xl transition-all duration-300">
        <div className="bg-[#FAFBFD] rounded-[22px] overflow-hidden flex flex-col relative font-sans">
          
          {/* Header Cover Frame Banner decoration */}
          <div className="absolute top-2 right-4 z-40 select-none pointer-events-none">
            <span className="bg-slate-900/40 text-slate-300 font-mono text-[8px] px-2 py-0.5 rounded-sm border border-slate-700/30">
              My Active Session Header Context
            </span>
          </div>

          <div className="bg-slate-950 h-36 relative flex-shrink-0 select-none overflow-hidden">
            <img 
              src={headerBgUrl} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFBFD] via-slate-950/60 to-slate-950/80" />
            
            {/* Dynamic Soundwave decorative visualizer */}
            <div className="absolute right-6 bottom-4 flex items-end gap-0.5 h-10 opacity-20">
              {[33, 55, 88, 44, 22, 66, 77, 55, 44, 99, 11, 44, 77, 88].map((height, idx) => (
                <div 
                  key={idx} 
                  className={`w-0.5 rounded-full ${isProfileGuest ? 'bg-[#D4AF37]' : 'bg-amber-400'}`} 
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            {/* Developer Metadata Overlay tags for logged in user */}
            <div className="absolute top-4 left-6 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-900/80 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LOGGED_IN: {viewerType === 'guest' ? 'psc_guest' : 'psc_host'}
              </div>
              <span className="bg-slate-900/60 text-[#D4AF37] font-mono text-[8px] px-2 py-1 rounded-md border border-[#D4AF37]/20">
                session_ref: active_profile
              </span>
            </div>
          </div>

          {/* User Details Block Layout */}
          <div className="px-6 sm:px-10 pb-8 pt-4 flex flex-col space-y-4 selection:bg-amber-100">
            <div className="relative">
              {/* Profile Avatar with Border ring */}
              <div className="absolute -top-16 left-0 w-24 h-24 z-30">
                <img 
                  src={avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'} 
                  alt="" 
                  className="w-20 h-20 bg-white p-0.5 rounded-full object-cover shadow-xl ring-4 ring-[#D4AF37] shadow-[#D4AF37]/20"
                />
              </div>

              {/* Offset space */}
              <div className="h-8" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400">
                    <span>{viewerType === 'guest' ? '[Guest Session Active]' : '[Host Session Active]'}</span>
                    <span className="text-[#D4AF37]">• {loggedInProfile.industry}</span>
                  </div>
                  <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    {displayName}
                  </h1>
                </div>

                <div className="bg-slate-100 hover:bg-slate-200 px-4 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active Matchmaking Core Ready
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION B: DYNAMIC SPIN & MATCH CONTROLLERS (THE 'SPIN AND WIN' ENGINE CONTAINER) */}
      <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-white flex flex-col items-center justify-center text-center space-y-8 select-none">
        
        {/* Background ambient lighting */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="absolute top-4 left-6 bg-slate-800/80 border border-slate-700 rounded px-2.5 py-0.5 font-mono text-[7px] font-extrabold text-amber-400 uppercase tracking-widest">
          [wp_block: psc_ai_syndication_turbine_spinners]
        </div>

        <div className="max-w-xl mx-auto space-y-2">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-8 h-8 text-amber-400 animate-pulse text-shadow" />
            AI Syndication Turbine
          </h2>
          <p className="font-sans text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            Calculate, sort, and cycle through the database to find optimal fits. Spin the AI Matchmaker to fetch the next batch of 25 sorted profiles with dynamic weight equations.
          </p>
        </div>

        {/* Dynamic Spinning Cylinder Slot Slot Machine Widget */}
        <div className="relative w-full max-w-md h-24 bg-slate-950/90 rounded-2xl border-2 border-slate-800 flex items-center justify-center shadow-inner overflow-hidden select-none">
          <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-slate-950 to-transparent z-10 opacity-90" />
          <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-slate-950 to-transparent z-10 opacity-90" />
          
          {/* Laser Guide Accents */}
          <div className="absolute left-0 inset-y-0 w-1 bg-amber-500 z-10" />
          <div className="absolute right-0 inset-y-0 w-1 bg-amber-500 z-10" />

          <AnimatePresence mode="wait">
            {isSpinning ? (
              <motion.div
                key="spinning_ticker"
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ duration: 0.08 }}
                className="flex flex-col items-center space-y-1.5"
              >
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
                <span className="font-mono text-sm tracking-wider uppercase font-black text-amber-300 [text-shadow:0_0_10px_rgba(251,191,36,0.3)]">
                  {spinTickerName || "TURBINE ROTATING..."}
                </span>
                <span className="text-[9px] font-mono text-slate-500">Querying Post Meta Values...</span>
              </motion.div>
            ) : (
              <motion.div
                key="settled_ticker"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center space-y-1"
              >
                <div className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-widest font-extrabold">
                  🎯 Engine Settled
                </div>
                <p className="font-display font-extrabold text-base text-white">
                  Showing Batch #{currentBatchIndex + 1} of {maxBatches}
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Rows {startIndex + 1} to {Math.min(endIndex, totalMatchesCount)} of {totalMatchesCount} total matched profiles
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spin trigger Button */}
        <button
          onClick={handleSpinAndMatch}
          disabled={isSpinning}
          className={`flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-sm font-black rounded-2xl tracking-wider select-none transform transition active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(212,175,55,0.25)]`}
        >
          <Dices className={`w-5 h-5 ${isSpinning ? 'animate-bounce' : ''}`} />
          {isSpinning ? 'SPINNING METADATA...' : 'SPIN FOR NEXT 25 MATCHES'}
        </button>
      </div>

      {/* SECTION C: GRID DISPLAYS (THE BATCH LISTING) */}
      <div className="space-y-6">
        
        {/* Filter / Dynamic Counter Header Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-1">
            <h3 className="font-display font-bold text-xl text-slate-800 uppercase tracking-widest">
              Matched {viewerType === 'guest' ? 'Podcast Shows' : 'Guest Speakers'}
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Sorting: descending compatibility weight trace coefficients
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Live Search inside active matched results */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search active batch..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-60 bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
            
            <div className="bg-slate-200/60 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-mono text-[10px] shrink-0 font-bold">
              PAGE: {currentBatchIndex + 1}/{maxBatches || 1}
            </div>
          </div>
        </div>

        {/* Total zero matches safety */}
        {pagedMatches.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
            <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No matches found in the current pool filter.</p>
            <p className="text-xs text-slate-400">Try refining your search keyword above or click spin to reload.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pagedMatches.map((item, idx) => {
              const score = item.score;
              const isItemGuest = item.type === 'guest';
              const name = isItemGuest 
                ? (item.profile as GuestProfile).displayName 
                : (item.profile as HostProfile).showName;
              const bio = isItemGuest
                ? (item.profile as GuestProfile).bio
                : (item.profile as HostProfile).description;
              const img = isItemGuest
                ? (item.profile as GuestProfile).avatarUrl
                : (item.profile as HostProfile).logoUrl;
              const remote = isItemGuest
                ? (item.profile as GuestProfile).remotePreference
                : (item.profile as HostProfile).remoteOptions;
              const formatsList = isItemGuest
                ? (item.profile as GuestProfile).preferredFormats
                : [(item.profile as HostProfile).format];

              const topicsShow = isItemGuest
                ? (item.profile as GuestProfile).topics.slice(0, 3)
                : (item.profile as HostProfile).showTopics.slice(0, 3);

              const isExpanded = expandedMatchId === item.profile.id;

              return (
                <div 
                  key={item.profile.id}
                  className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col relative overflow-hidden group shadow-3xs ${
                    isExpanded 
                      ? 'ring-2 ring-amber-400 border-amber-300 transform scale-[1.01] shadow-md z-10 md:col-span-2 lg:col-span-3' 
                      : 'hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  
                  {/* Matching score shield badge marker at the top header corner */}
                  <div className="absolute top-1 right-1 z-20 scale-75 transform origin-top-right">
                    <BadgeWidget 
                      score={score} 
                      isLocked={false} 
                      size="sm" 
                      hideLabels={true} 
                      animated={false}
                    />
                  </div>

                  {/* Header cover preview decor inside matches */}
                  <div className="h-20 w-full relative shrink-0">
                    <img 
                      src={item.profile.headerBgUrl || defaultHeaderImage} 
                      alt="" 
                      className="w-full h-full object-cover opacity-30 group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    
                    {/* Badge representing rank */}
                    <span className="absolute bottom-1 left-4 font-mono text-[9px] font-extrabold tracking-widest text-[#D4AF37] uppercase bg-amber-50 px-2 py-0.5 rounded border border-[#D4AF37]/20">
                      FIT POSITION #{startIndex + idx + 1}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col space-y-4">
                    
                    <div className="flex gap-4 items-start">
                      <img 
                        src={img || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=150&fit=crop'} 
                        alt="" 
                        className="w-14 h-14 rounded-full object-cover border border-slate-100 shadow-3xs"
                      />
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-[#D4AF37] block font-extrabold uppercase">
                          {item.profile.industry} • {remote}
                        </span>
                        <h4 className="font-display font-black text-slate-800 text-base leading-tight group-hover:text-amber-500 transition-colors">
                          {name}
                        </h4>
                      </div>
                    </div>

                    <p className="font-sans text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {bio}
                    </p>

                    {/* Meta tag bubbles */}
                    <div className="flex flex-wrap gap-1.5">
                      {topicsShow.map(t => (
                        <span key={t} className="text-[9px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Interactive trace calculations drawer overview */}
                    {isExpanded && (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-700 animate-slide-up space-y-4 shadow-inner">
                        
                        {/* Two Columns with details & match metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-slate-200">
                          
                          {/* Left Column: Full Biography details */}
                          <div className="space-y-2">
                            <h5 className="font-display font-black text-slate-800 tracking-wider uppercase text-xs flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                              Full Professional Statement
                            </h5>
                            <p className="leading-relaxed text-slate-600 italic">
                              "{bio}"
                            </p>
                            
                            {/* Contact Email Block */}
                            <div className="pt-2">
                              <p className="text-[10px] font-mono text-slate-400">CONTACT INFO DIRECTORY LINK</p>
                              <a 
                                href={`mailto:${isItemGuest ? (item.profile as GuestProfile).emailContact : (item.profile as HostProfile).hostEmail}`} 
                                className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline font-bold"
                              >
                                <Mail className="w-3.5 h-3.5" />
                                {isItemGuest ? (item.profile as GuestProfile).emailContact : (item.profile as HostProfile).hostEmail}
                              </a>
                            </div>
                          </div>

                          {/* Right Column: Dynamic ACF Trace Scores breakdown */}
                          <div className="space-y-2.5">
                            <h5 className="font-display font-black text-amber-700 tracking-wider uppercase text-xs flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                              Match Alignment Breakdown
                            </h5>
                            
                            <div className="space-y-1.5 text-[11px] font-sans">
                              {/* Row 0: Past Ratings */}
                              <div className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-150">
                                <span className="font-semibold text-slate-500">⭐ Past Rating Track Record</span>
                                <span className="font-mono text-slate-800 font-bold">{(item.trace.reviews.score * 100).toFixed(0)}%</span>
                              </div>
                              <p className="text-[9px] text-slate-400 leading-snug pl-1">{item.trace.reviews.detail}</p>
                              
                              {/* Row 1: Topics */}
                              <div className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-150">
                                <span className="font-semibold text-slate-500">🔖 Topics Overlap</span>
                                <span className="font-mono text-slate-800 font-bold">{(item.trace.topics.score * 100).toFixed(0)}%</span>
                              </div>
                              <p className="text-[9px] text-slate-400 leading-snug pl-1">{item.trace.topics.detail}</p>
                              
                              {/* Row 2: Industry Alignment */}
                              <div className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-150">
                                <span className="font-semibold text-slate-500">🏢 Industry sector Match</span>
                                <span className="font-mono text-slate-800 font-bold">{(item.trace.industry.score * 100).toFixed(0)}%</span>
                              </div>
                              <p className="text-[9px] text-slate-400 leading-snug pl-1">{item.trace.industry.detail}</p>

                              {/* Row 3: Location Compatibility */}
                              <div className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-150">
                                <span className="font-semibold text-slate-500">🗺️ Modal Preference (Remote)</span>
                                <span className="font-mono text-slate-800 font-bold">{(item.trace.location.score * 100).toFixed(0)}%</span>
                              </div>
                              <p className="text-[9px] text-slate-400 leading-snug pl-1">{item.trace.location.detail}</p>
                              
                              {/* Row 4: Experience Level Match */}
                              <div className="flex justify-between items-center bg-white p-1.5 rounded border border-slate-150">
                                <span className="font-semibold text-slate-500">📈 Speaker Competency Match</span>
                                <span className="font-mono text-slate-800 font-bold">{(item.trace.experience.score * 100).toFixed(0)}%</span>
                              </div>
                              <p className="text-[9px] text-slate-400 leading-snug pl-1">{item.trace.experience.detail}</p>
                            </div>

                          </div>
                        </div>

                        {/* Interactive Scheduler Widget embed */}
                        <div className="bg-[#FCFDFD] p-4 rounded-xl border-2 border-dashed border-slate-200 text-center space-y-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#D4AF37]" />
                            <h6 className="font-bold text-slate-800">Proposal Scheduling Pipeline shortcode</h6>
                          </div>
                          
                          {bookingLoggedId === item.profile.id ? (
                            <div className="space-y-1 py-1">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center">
                                <Check className="w-4 h-4" />
                              </div>
                              <p className="text-xs font-bold text-emerald-600">Dynamic ACF syndication request proposal triggered!</p>
                              <p className="text-[10px] text-slate-400 leading-relaxed">
                                Direct connection request dispatched to <strong>{isItemGuest ? (item.profile as GuestProfile).emailContact : (item.profile as HostProfile).hostEmail}</strong>.
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs text-slate-500 leading-relaxed">
                                Initiate direct connecting logs on our PodSyndiConnect database.
                              </p>
                              <button 
                                onClick={() => setBookingLoggedId(item.profile.id)}
                                className="bg-slate-900 border border-slate-800 hover:bg-slate-805 text-white font-mono text-[10px] uppercase font-extrabold tracking-wider px-4 py-1.5 rounded-lg transform active:scale-95 transition-all cursor-pointer"
                              >
                                dispatch_syndication_proposal
                              </button>
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {/* Trigger Bottom Button Panel */}
                    <div className="pt-2 border-t border-slate-100 mt-auto flex items-center justify-between">
                      <button 
                        onClick={() => {
                          if (onSelectPreview) {
                            onSelectPreview(isItemGuest ? 'guest' : 'host', item.profile.id);
                          }
                          if (setActiveWorkspaceTab) {
                            setActiveWorkspaceTab('studio');
                          }
                        }}
                        className="text-[10px] font-mono text-slate-400 hover:text-amber-500 font-bold uppercase flex items-center gap-1 transition-colors"
                      >
                        Single view preview <ExternalLink className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => setExpandedMatchId(isExpanded ? null : item.profile.id)}
                        className={`text-xs font-bold font-display flex items-center gap-1 transition-colors px-3 py-1 rounded-lg border cursor-pointer ${
                          isExpanded 
                            ? 'bg-amber-500 text-slate-950 border-amber-400 hover:bg-amber-400 font-extrabold' 
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-250/70'
                        }`}
                      >
                        {isExpanded ? 'Hide Match Breakdown' : 'Match Breakdown'}
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
