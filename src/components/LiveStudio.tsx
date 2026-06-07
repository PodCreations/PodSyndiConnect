import React from 'react';
import { GuestProfile, HostProfile, MatchWeights } from '../types';
import { calculateMatchScore } from '../utils';
import { BadgeWidget } from './BadgeWidget';
import { getTopicColor, CATEGORIZED_TOPICS, INITIAL_GUESTS, INITIAL_HOSTS } from '../data';
import defaultHeaderImage from '../assets/images/brand_header_1780775563058.png';
import { 
  Users, 
  UserCheck, 
  MapPin, 
  Globe, 
  Layers, 
  Cpu, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Network,
  Info,
  Sliders,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Flame,
  MessageSquareOff,
  Play,
  Pause,
  Volume2,
  Calendar,
  Check,
  ExternalLink,
  Clock,
  Radio,
  Tv,
  Smartphone,
  Award,
  ShieldAlert,
  Share2,
  Send,
  HelpCircle,
  FileText,
  Upload,
  Star,
  StarHalf
} from 'lucide-react';

interface LiveStudioProps {
  guests: GuestProfile[];
  hosts: HostProfile[];
  weights: MatchWeights;
  activePreview: { type: 'guest' | 'host'; id: string };
  onSelectPreview: (type: 'guest' | 'host', id: string) => void;
  // Hoisted Context State
  viewerType: 'anonymous' | 'guest' | 'host';
  setViewerType: (type: 'anonymous' | 'guest' | 'host') => void;
  selectedViewerGuestId: string;
  setSelectedViewerGuestId: (id: string) => void;
  selectedViewerHostId: string;
  setSelectedViewerHostId: (id: string) => void;
}

export const LiveStudio: React.FC<LiveStudioProps> = ({
  guests,
  hosts,
  weights,
  activePreview,
  onSelectPreview,
  viewerType,
  setViewerType,
  selectedViewerGuestId,
  setSelectedViewerGuestId,
  selectedViewerHostId,
  setSelectedViewerHostId,
}) => {
  // Interactive Template State Integrations
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [playbackTime, setPlaybackTime] = React.useState(8);
  const [showReviewsModal, setShowReviewsModal] = React.useState(false);
  const [activeAction, setActiveAction] = React.useState<'book' | 'apply' | null>(null);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState('2026-06-15');
  const [selectedTimeSlot, setSelectedTimeSlot] = React.useState('10:00 AM EST');
  const [pitchText, setPitchText] = React.useState('I would love to join your show to share insights on our mutual industry topic!');

  // Simple player timing tick
  React.useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setPlaybackTime((prev) => (prev >= 180 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Reset states when changing selection
  React.useEffect(() => {
    setIsPlaying(false);
    setPlaybackTime(8);
    setActiveAction(null);
    setFormSubmitted(false);
  }, [activePreview]);

  // Trace drawer is enabled
  const showTrace = true;

  // Resolve current active preview profile
  const isPreviewGuest = activePreview.type === 'guest';
  const previewProfile = isPreviewGuest
    ? guests.find((g) => g.id === activePreview.id) || guests[0]
    : hosts.find((h) => h.id === activePreview.id) || hosts[0];

  // Resolve spectator profile dynamically
  let viewerLabel = 'Anonymous Visitor';
  let viewerProfile: any = null;

  if (viewerType === 'guest') {
    viewerProfile = guests.find((g) => g.id === selectedViewerGuestId) || guests[0];
    viewerLabel = viewerProfile ? `Guest: ${viewerProfile.displayName}` : 'Guest Viewer';
  } else if (viewerType === 'host') {
    viewerProfile = hosts.find((h) => h.id === selectedViewerHostId) || hosts[0];
    viewerLabel = viewerProfile ? `Host: ${viewerProfile.showName}` : 'Host Viewer';
  }

  // Determine matchmaking direction and alignment values
  let score = 0;
  let isLocked = false;
  let lockReason = '';
  let traceResults: any = null;
  let calculationMode: 'HostViewingGuest' | 'GuestViewingHost' | 'SelfMatch' | 'Anonymous' = 'Anonymous';

  if (viewerType === 'anonymous') {
    isLocked = true;
    lockReason = 'PodSyndiConnect: Compatibility shield locked. Please log in to inspect match indexes.';
    calculationMode = 'Anonymous';
  } else {
    if (isPreviewGuest && viewerType === 'host') {
      calculationMode = 'HostViewingGuest';
      traceResults = calculateMatchScore(previewProfile as GuestProfile, viewerProfile as HostProfile, weights);
      score = traceResults.compositeScore;
      isLocked = !traceResults.isValid;
      if (isLocked) lockReason = 'Weights configuration is out of balance. Calculations suspended.';
    } else if (!isPreviewGuest && viewerType === 'guest') {
      calculationMode = 'GuestViewingHost';
      traceResults = calculateMatchScore(viewerProfile as GuestProfile, previewProfile as HostProfile, weights);
      score = traceResults.compositeScore;
      isLocked = !traceResults.isValid;
      if (isLocked) lockReason = 'Weights configuration is out of balance. Calculations suspended.';
    } else {
      calculationMode = 'SelfMatch';
      isLocked = true;
      lockReason = isPreviewGuest 
        ? "You are logged in as a Guest. Open a podcast Host's profile to inspect compatibility ratings!"
        : "You are logged in as a Show Host. View Guest profiles to see match percentages!";
    }
  }

  const guestReviews = (previewProfile as GuestProfile).reviews || INITIAL_GUESTS.find(g => g.id === previewProfile.id)?.reviews || [];
  const displayedGuestReviews = guestReviews.slice(0, 2);

  const hostReviews = (previewProfile as HostProfile).reviews || INITIAL_HOSTS.find(h => h.id === previewProfile.id)?.reviews || [];
  const displayedHostReviews = hostReviews.slice(0, 2);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full items-start">
      
      {/* LEFT COLUMN: Elementor Layout Canvas Simulator (span 7) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* CONTEXT PERSPECTIVE TUNER CARD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          {/* Active Canvas Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 shadow-3xs">
            <div>
              <p className="text-[10px] font-mono font-extrabold tracking-widest text-[#D4AF37] uppercase">Elementor Template Canvas</p>
              <h4 className="text-xs font-bold text-slate-800">Choose simulated active showcase card</h4>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => onSelectPreview('guest', guests[0]?.id || '')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activePreview.type === 'guest'
                      ? 'bg-white text-slate-900 font-extrabold shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Guest
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPreview('host', hosts[0]?.id || '')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    activePreview.type === 'host'
                      ? 'bg-white text-slate-900 font-extrabold shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Host
                </button>
              </div>

              <select
                value={activePreview.id}
                onChange={(e) => onSelectPreview(activePreview.type, e.target.value)}
                className="bg-white border border-slate-200 text-xs px-2.5 py-1 rounded-lg font-bold text-slate-800 focus:ring-1 focus:ring-amber-500 outline-hidden cursor-pointer"
              >
                {activePreview.type === 'guest' ? (
                  guests.map(g => (
                    <option key={g.id} value={g.id}>{g.displayName}</option>
                  ))
                ) : (
                  hosts.map(h => (
                    <option key={h.id} value={h.id}>{h.showName}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                Live Viewer Role Adapter
              </h3>
            </div>
            <div className="text-[11px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200/50">
              Active Audience Perspective: {viewerType.toUpperCase()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Anonymous Button */}
            <button
              onClick={() => setViewerType('anonymous')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                viewerType === 'anonymous'
                  ? 'border-amber-500 bg-amber-50/50 hover:bg-amber-100/10'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <LogOut className={`w-4 h-4 ${viewerType === 'anonymous' ? 'text-amber-600' : 'text-slate-400'}`} />
                <span className={`text-xs font-bold ${viewerType === 'anonymous' ? 'text-amber-950 font-black' : 'text-slate-700'}`}>
                  Anonymous
                </span>
              </div>
              <span className="text-[10px] text-slate-400 leading-tight">Simulate logged-out guest visitor</span>
            </button>

            {/* Guest button context */}
            <div className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
              viewerType === 'guest'
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <button
                onClick={() => setViewerType('guest')}
                className="w-full text-left flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <UserCheck className={`w-4 h-4 ${viewerType === 'guest' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span className={viewerType === 'guest' ? 'text-amber-950 font-black' : 'text-slate-700'}>
                  Logged-in Guest
                </span>
              </button>
              
              {viewerType === 'guest' && (
                <select
                  value={selectedViewerGuestId}
                  onChange={(e) => setSelectedViewerGuestId(e.target.value)}
                  className="mt-2 w-full bg-white border border-slate-200 text-[10px] px-2 py-1.5 rounded-lg font-medium outline-hidden"
                >
                  {guests.map(g => (
                    <option key={g.id} value={g.id}>{g.displayName} ({g.industry})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Host button context */}
            <div className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
              viewerType === 'host'
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-slate-200 hover:bg-slate-50'
            }`}>
              <button
                onClick={() => setViewerType('host')}
                className="w-full text-left flex items-center gap-2 text-xs font-bold cursor-pointer"
              >
                <Users className={`w-4 h-4 ${viewerType === 'host' ? 'text-sky-600' : 'text-slate-400'}`} />
                <span className={viewerType === 'host' ? 'text-amber-950 font-black' : 'text-slate-700'}>
                  Logged-in Host
                </span>
              </button>
              
              {viewerType === 'host' && (
                <select
                  value={selectedViewerHostId}
                  onChange={(e) => setSelectedViewerHostId(e.target.value)}
                  className="mt-2 w-full bg-white border border-slate-200 text-[10px] px-2 py-1.5 rounded-lg font-medium outline-hidden"
                >
                  {hosts.map(h => (
                    <option key={h.id} value={h.id}>{h.showName}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>

        {/* PROFILE PRESENTATION CARD (HIGH-FIDELITY ELEMENTOR CANVAS SIMULATOR) */}
        <div className="bg-gradient-to-b from-[#D4AF37]/60 via-slate-200 to-slate-300 p-[1.5px] rounded-3xl shadow-xl transition-all duration-300 hover:shadow-2xl">
          <div className="bg-[#FAFBFD] rounded-[22px] overflow-hidden flex flex-col relative font-sans">
            
            {/* Boxed Width Layout Frame Marker */}
            <div className="absolute top-2 right-4 z-40 select-none pointer-events-none">
              <span className="bg-slate-900/40 text-slate-300 font-mono text-[8px] px-2 py-0.5 rounded-sm border border-slate-700/30">
                Elementor Container Width: Boxed (1200px)
              </span>
            </div>

            {/* SHARED BACKDROP HEADER COVER BANNER */}
            <div className="bg-slate-950 h-36 relative flex-shrink-0 select-none overflow-hidden">
              <img 
                src={previewProfile.headerBgUrl || defaultHeaderImage} 
                alt="" 
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FAFBFD] via-slate-950/60 to-slate-950/80" />
              
              {/* Dynamic Theme Soundwave Graphic */}
              <div className="absolute right-6 bottom-4 flex items-end gap-0.5 h-10 opacity-20">
                {[55, 30, 85, 45, 90, 20, 75, 40, 60, 80, 50, 30, 70, 95].map((height, idx) => (
                  <div 
                    key={idx} 
                    className={`w-0.5 rounded-full ${isPreviewGuest ? 'bg-[#D4AF37]' : 'bg-amber-400'}`} 
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>

              {/* Developer WP Header Shortcode Meta Info */}
              <div className="absolute top-4 left-6 flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-slate-900/80 text-white font-mono text-[9px] font-extrabold tracking-widest uppercase px-3 py-1 rounded-full border border-white/20 shadow-md">
                  <span className={`w-1.5 h-1.5 rounded-full ${isPreviewGuest ? 'bg-[#D4AF37]' : 'bg-amber-400'}`} />
                  CPT: {activePreview.type === 'guest' ? 'psc_guest' : 'psc_host'}
                </div>
                <span className="bg-slate-900/60 text-[#D4AF37] font-mono text-[8px] px-2 py-1 rounded-md border border-[#D4AF37]/20">
                  template_file: single-profile-card.php
                </span>
              </div>
            </div>

            {/* DYNAMIC CARD INNER PANEL */}
            {isPreviewGuest ? (
              /* ========================================================
                 GUEST PROFILE TEMPLATE
                 ======================================================== */
              <div className="px-6 sm:px-10 pb-12 pt-4 flex flex-col space-y-10 selection:bg-amber-100 select-none">
                
                {/* 1. HERO SECTION */}
                <div className="space-y-3.5 relative">
                  <div className="absolute -top-12 left-0 w-28 h-28 z-30">
                    <img 
                      src={(previewProfile as GuestProfile).avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'} 
                      alt="" 
                      className="w-24 h-24 bg-white p-0.5 rounded-full object-cover shadow-xl ring-4 ring-[#D4AF37] shadow-[#D4AF37]/20"
                    />
                  </div>

                  {/* Spacer for avatar overlap spacing */}
                  <div className="h-12" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
                        <span>[acf_field: psc_guest_display_name]</span>
                        <span className="text-amber-500 font-extrabold">• Guest Profile</span>
                      </div>
                      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
                        {(previewProfile as GuestProfile).displayName}
                      </h1>
                    </div>

                    {/* Featured Guest Badge */}
                    <div className="inline-flex items-center gap-1.5 bg-[#FAF6E3] border border-[#D4AF37]/35 py-1.5 px-3 rounded-xl shadow-3xs self-start sm:self-auto">
                      <Award className="w-4 h-4 text-[#D4AF37]" />
                      <span className="text-[9px] font-display font-black text-slate-800 tracking-wider">FEATURED VIP GUEST</span>
                    </div>
                  </div>

                  {/* Optional Tagline or Headline */}
                  <p className="font-sans text-base text-slate-500 font-medium italic border-l-2 border-[#D4AF37] pl-3">
                    Guest Speaker specializing in the details of {(previewProfile as GuestProfile).industry}. Available for interviews, panels, and roundtable discussions.
                  </p>

                  {/* Category Accent Underline based on primary topic */}
                  {(() => {
                    const firstTopic = (previewProfile as GuestProfile).topics[0];
                    const primaryCategory = CATEGORIZED_TOPICS.find(cat => cat.topics.includes(firstTopic));
                    const accentColor = primaryCategory?.color || '#D4AF37';
                    return (
                      <div className="pt-2">
                        <div className="h-[3px] w-40 rounded-full" style={{ backgroundColor: accentColor }} />
                        <span className="text-[8px] font-mono text-slate-300 block mt-1">[category_field: topics_primary_color]</span>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. PROFILE ROW (Two-Column Flexbox with details & links) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 rounded-2xl border border-slate-150/70 shadow-3xs hover:border-slate-300 transition-all duration-300 relative">
                  <span className="absolute -top-2.5 left-6 bg-slate-100 border border-slate-250/60 rounded px-1.5 py-0.2 font-mono text-[7px] font-bold text-[#D4AF37] uppercase tracking-widest">
                    [wp_meta_block: profile_row]
                  </span>

                  {/* Image / Social Icon Left Side (Span 4) */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6 text-center select-none">
                    <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                      [acf: psc_guest_profile_photo]
                    </p>
                    <img 
                      src={(previewProfile as GuestProfile).avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'} 
                      alt="" 
                      className="w-28 h-28 rounded-full object-cover border-2 border-slate-100 shadow-md transform hover:rotate-3 transition duration-300"
                    />
                    
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800">Connection Directory</p>
                      <div className="flex items-center gap-1.5 justify-center">
                        <a href="#linked" onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-full bg-slate-50 hover:bg-amber-100 hover:text-[#D4AF37] text-slate-500 flex items-center justify-center border border-slate-200 transition-all">
                          <span className="text-[10px] font-bold font-mono">in</span>
                        </a>
                        <a href="#twit" onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-full bg-slate-50 hover:bg-amber-100 hover:text-[#D4AF37] text-slate-500 flex items-center justify-center border border-slate-200 transition-all">
                          <span className="text-[10px] font-bold font-mono">X</span>
                        </a>
                        <a href="#podcast" onClick={(e) => e.preventDefault()} className="w-7 h-7 rounded-full bg-slate-50 hover:bg-amber-100 hover:text-[#D4AF37] text-slate-500 flex items-center justify-center border border-slate-200 transition-all">
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* ACF Metadata Lists Right Side (Span 8) */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-[#D4AF37] block font-bold">[acf: psc_guest_industry]</span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Industry Sector</p>
                        <p className="text-sm font-bold text-slate-800">{(previewProfile as GuestProfile).industry}</p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-[#D4AF37] block font-bold">[acf: psc_guest_experience_level]</span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Speaker Competency Tier</p>
                        <p className="text-sm font-bold text-slate-800">{(previewProfile as GuestProfile).experienceLevel}</p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-[#D4AF37] block font-bold">[acf: psc_guest_location]</span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Broadcast Base Location</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {(previewProfile as GuestProfile).location || 'Remote Options'}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-[#D4AF37] block font-bold">[acf: psc_guest_remote_preference]</span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Modal Preference</p>
                        <p className="text-sm font-bold text-slate-800 text-amber-600 font-mono">
                          {(previewProfile as GuestProfile).remotePreference}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2.5 border-t border-slate-150/40">
                      <span className="text-[9px] font-mono text-[#D4AF37] block font-bold">[acf: psc_guest_languages]</span>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Onboarding Spoken Languages</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(previewProfile as GuestProfile).languages.map(lang => (
                          <span key={lang} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. MATCH SCORE BADGE SECTION (Special WordPress widget shortcode render box) */}
                <div className="bg-[#FCFDFD] border-2 border-dashed border-slate-200 p-6 rounded-2xl relative select-none">
                  <span className="absolute -top-2.5 left-6 bg-amber-500 text-white font-mono text-[7px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase">
                    Shortcode Widget: [psc_match_score_badge_dynamic]
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div className="sm:col-span-8 space-y-1.5">
                      <h3 className="font-display font-bold text-md text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        PSC Core Match Engine Shield
                      </h3>
                      <p className="font-sans text-xs text-slate-500 leading-relaxed">
                        Evaluated relative to the active logged-in viewer context. Host-to-Guest queries trigger automatic matchmaking weight tracing.
                      </p>
                      <div className="text-[10px] bg-slate-100 text-slate-500 font-mono p-1 rounded inline-block">
                        viewer_role: <strong className="text-amber-800">{viewerType}</strong> | active: <strong className="text-indigo-800">Guest Card</strong>
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex justify-center sm:justify-end">
                      <BadgeWidget 
                        score={score} 
                        isLocked={isLocked || viewerType === 'guest'} 
                        lockReason={viewerType === 'guest' ? 'Spectator context is "Guest". Pairing calculations locked (must be a Host viewing guest profiles to trigger score).' : lockReason} 
                        size="md"
                        animated={true}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. BIO SECTION */}
                <div className="space-y-3 relative">
                  <span className="absolute -top-3.5 right-6 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 font-mono text-[7px] text-[#D4AF37]">
                    [acf: psc_guest_bio]
                  </span>
                  <h2 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#D4AF37]" />
                    Biography & Professional Narrative
                  </h2>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 text-[#444444] text-base leading-relaxed font-sans shadow-3xs italic select-text">
                    "{(previewProfile as GuestProfile).bio}"
                  </div>
                </div>

                {/* 5. TOPICS THEY CAN SPEAK ABOUT */}
                <div className="space-y-4 relative">
                  <span className="absolute -top-3.5 right-6 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 font-mono text-[7px] text-[#D4AF37]">
                    [acf_taxonomy: psc_guest_topics]
                  </span>
                  <h2 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#D4AF37]" />
                    Core Topic Matrix & Speaking Specializations
                  </h2>
                  
                  <div className="bg-slate-50 border border-slate-200/65 p-5 rounded-2xl space-y-4">
                    {CATEGORIZED_TOPICS.map(cat => {
                      const profileTopics = (previewProfile as GuestProfile).topics;
                      const matchingTopics = cat.topics.filter(t => profileTopics.includes(t));
                      
                      if (matchingTopics.length === 0) return null;
                      
                      return (
                        <div key={cat.category} className="space-y-1.5 pb-2 border-b border-slate-150 last:border-0 last:pb-0">
                          <h4 className="text-xs font-display font-extrabold uppercase tracking-widest flex items-center gap-2" style={{ color: cat.color }}>
                            <span className="w-2.5 h-2.5 rounded-full inline-block shadow-3xs" style={{ backgroundColor: cat.color }} />
                            {cat.category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {matchingTopics.map(t => (
                              <span 
                                key={t}
                                style={{ backgroundColor: `${cat.color}10`, color: cat.color, borderColor: `${cat.color}35` }}
                                className="px-3 py-1 text-xs font-extrabold rounded-lg border font-display"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. EXPERTISE / TAGS */}
                <div className="space-y-3 relative">
                  <span className="absolute -top-3.5 right-6 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 font-mono text-[7px] text-[#D4AF37]">
                    [acf: psc_guest_tags]
                  </span>
                  <h3 className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase">Tags Cloud Segment Assignment</h3>
                  <div className="flex flex-wrap gap-2">
                    {(previewProfile as GuestProfile).tags.map(tag => (
                      <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 transition-all">
                        🏷️ #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 7. MEDIA / FEATURED CONTENT (Simulated Sound waves & interactive player) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 relative text-white">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Radio className="w-5 h-5 text-[#D4AF37]" />
                      <h3 className="font-display font-bold text-sm tracking-widest uppercase">
                        Featured Press & Voice Introduction Clip
                      </h3>
                    </div>
                    <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[8px] font-mono font-extrabold px-2.5 py-0.5 rounded border border-[#D4AF37]/35">
                      PSC Player Shortcode
                    </span>
                  </div>

                  {/* High Quality Custom Media Mockup with Active Play State */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-center gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-full bg-[#D4AF37] hover:bg-[#ffdf6b] transition-all duration-300 text-slate-950 flex items-center justify-center shrink-0 shadow-lg cursor-pointer transform active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 text-slate-950" /> : <Play className="w-5 h-5 ml-1 text-slate-950" />}
                    </button>

                    <div className="flex-1 w-full space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-[#D4AF37] font-mono [text-shadow:0_0_12px_rgba(212,175,55,0.2)]">
                          {isPlaying ? "🎙️ STREAMING LIVE PREVIEW AUDIO" : "📻 STREAMING PAUSED"}
                        </span>
                        <span className="font-mono text-slate-400">
                          {Math.floor(playbackTime / 60)}:{(playbackTime % 60).toString().padStart(2, '0')} / 3:00
                        </span>
                      </div>
                      
                      {/* Audio Level Bars or Waveform */}
                      <div className="h-6 flex items-center gap-1 bg-slate-900 border border-slate-850 px-3 rounded-lg overflow-hidden relative">
                        {isPlaying ? (
                          <div className="absolute inset-0 bg-[#D4AF37]/5 animate-pulse" />
                        ) : null}
                        
                        {/* Simulation Sound Waves Bars */}
                        {Array.from({ length: 28 }).map((_, i) => {
                          let h = 15;
                          if (isPlaying) {
                            h = Math.floor(Math.sin((playbackTime * 4) + i) * 16) + 18;
                            if (h < 5) h = 5;
                            if (h > 24) h = 24;
                          } else {
                            h = Math.sin(i) * 5 + 8;
                          }
                          return (
                            <div 
                              key={i} 
                              className={`w-1 rounded-sm flex-1 transition-all duration-300 ${
                                isPlaying ? 'bg-amber-400' : 'bg-slate-700'
                              }`} 
                              style={{ height: `${h}px` }}
                            />
                          );
                        })}
                      </div>
                      
                      <p className="text-[10px] text-slate-400">
                        File Metadata: <code>psc_intro_evelyn_syndi.mp3</code> (Recorded 128kbps stereo)
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7.5. REVIEWS SECTION */}
                {guestReviews.length > 0 && (
                  <div className="space-y-4 relative">
                    <span className="absolute -top-3.5 right-6 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 font-mono text-[7px] text-[#D4AF37]">
                      [acf: psc_guest_reviews]
                    </span>
                    <h2 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#D4AF37]" />
                      Reviews & Testimonials
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayedGuestReviews.map(review => (
                        <div key={review.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-3xs space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <img src={review.authorPhoto} alt={review.authorName} className="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-sm" />
                              <div>
                                <div className="text-sm font-bold text-slate-900 group">
                                  <a href="#" className="hover:text-[#D4AF37] hover:underline underline-offset-2 transition-colors">
                                    {review.authorName}
                                  </a>
                                </div>
                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                  {review.authorType} &bull; {review.date}
                                </div>
                              </div>
                            </div>
                            <div className="flex text-amber-500 text-xs">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const rating = review.rating || 0;
                                if (i < Math.floor(rating)) return <Star key={i} className="w-3.5 h-3.5 fill-current" />;
                                if (i === Math.floor(rating) && rating % 1 !== 0) return <StarHalf key={i} className="w-3.5 h-3.5 fill-current" />;
                                return <Star key={i} className="w-3.5 h-3.5 text-slate-300" />;
                              })}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{review.title}</h4>
                            <p className="text-sm text-slate-700 italic leading-relaxed">"{review.text}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {guestReviews.length > 2 && (
                      <div className="text-center mt-4">
                        <button 
                          onClick={() => setShowReviewsModal(true)}
                          className="bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#D4AF37] px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-sm"
                        >
                          See All Reviews ({guestReviews.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 8. CALL-TO-ACTION SECTION WITH INTERACTIVE SCHEDULER POPUP */}
                <div className="pt-6 border-t border-slate-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center space-y-1.5">
                    <h4 className="font-display font-extrabold text-lg text-slate-900">
                      Want to schedule {(previewProfile as GuestProfile).displayName} for your show?
                    </h4>
                    <p className="text-xs text-slate-500 max-w-lg mx-auto">
                      Click the Elementor booking shortcode form action below to coordinate direct syndication dates on PodSyndiConnect!
                    </p>
                  </div>

                  {activeAction === 'book' ? (
                    <div className="w-full bg-white border border-amber-300 rounded-2xl p-5 shadow-lg space-y-4 max-w-md animate-fade-in divide-y divide-slate-100">
                      
                      {/* Header block within schedule window */}
                      <div className="pb-3 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-[#D4AF37]" />
                          Interactive Scheduling Window
                        </span>
                        <button 
                          onClick={() => { setActiveAction(null); setFormSubmitted(false); }}
                          className="text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕ Close
                        </button>
                      </div>

                      {formSubmitted ? (
                        <div className="pt-4 py-8 text-center text-slate-800 space-y-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 inline-flex items-center justify-center mx-auto">
                            <Check className="w-6 h-6" />
                          </div>
                          <h4 className="font-extrabold text-[#D4AF37] font-display text-base">Booking Proposal Logged!</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            A direct syndication proposal has been logged for date <strong>{selectedDate}</strong> at <strong>{selectedTimeSlot}</strong> using ACF sync connection vectors.
                          </p>
                          <button 
                            onClick={() => { setFormSubmitted(false); setActiveAction(null); }}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] px-4 py-1.5 rounded-lg border border-slate-800 tracking-wider"
                          >
                            Return to profile
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3.5 pt-3.5 text-xs text-slate-600">
                          
                          {/* Calendar Picker Simulation */}
                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-700 block">Simulated WP Calendar Date:</label>
                            <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                              {['2026-06-15', '2026-06-16', '2026-06-17', '2026-06-18'].map((date) => (
                                <button 
                                  key={date}
                                  onClick={() => setSelectedDate(date)}
                                  className={`p-2 rounded-lg border cursor-pointer font-bold ${
                                    selectedDate === date 
                                      ? 'bg-amber-500 border-amber-500 text-white shadow-3xs' 
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {date.slice(5)}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Time Slots */}
                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-700 block">Available Segment Slots:</label>
                            <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                              {['10:00 AM EST', '02:00 PM EST', '04:30 PM EST', '09:00 PM EST'].map((slot) => (
                                <button 
                                  key={slot}
                                  onClick={() => setSelectedTimeSlot(slot)}
                                  className={`p-2 rounded-lg border cursor-pointer font-semibold ${
                                    selectedTimeSlot === slot 
                                      ? 'bg-slate-900 border-slate-950 text-white' 
                                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                  }`}
                                >
                                  {slot}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Trigger reservation button */}
                          <button 
                            onClick={() => setFormSubmitted(true)}
                            className="w-full bg-[#D4AF37] hover:bg-[#ffdf6b] text-slate-950 font-bold py-2.5 rounded-xl cursor-all-scroll text-xs tracking-wider uppercase transition-all duration-200 border border-transparent shadow-md font-display"
                          >
                            Confirm Booking via PSC Direct Connect
                          </button>
                        </div>
                      )}

                    </div>
                  ) : (
                    <button 
                      onClick={() => setActiveAction('book')}
                      className="bg-[#D4AF37] hover:bg-[#eed470] text-slate-950 font-display font-extrabold text-sm uppercase px-8 py-3.5 rounded-2xl tracking-wider transition-all duration-300 border border-slate-250 shadow-md flex items-center gap-2 transform active:scale-95 cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-slate-950" />
                      Book {(previewProfile as GuestProfile).displayName} Now
                    </button>
                  )}
                </div>

                {/* Simulated WP meta fields trace line */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60 text-[9px] font-mono text-slate-400">
                  <span className="font-mono">[wp_shortcode_indicator: field_mapping_acf_success]</span>
                  <span>ID: {(previewProfile as GuestProfile).id}</span>
                </div>

              </div>
            ) : (
              /* ========================================================
                 HOST PROFILE TEMPLATE
                 ======================================================== */
              <div className="px-6 sm:px-10 pb-12 pt-4 flex flex-col space-y-10 selection:bg-sky-150 select-none">
                
                {/* 1. HERO SECTION */}
                <div className="space-y-3.5 relative">
                  <div className="absolute -top-12 left-0 w-28 h-28 z-30">
                    <img 
                      src={(previewProfile as HostProfile).logoUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=150&fit=crop'} 
                      alt="" 
                      className="w-24 h-24 bg-white p-0.5 rounded-2xl object-cover shadow-xl ring-4 ring-slate-300 shadow-slate-300/20"
                    />
                  </div>

                  {/* Spacer for avatar overlap spacing */}
                  <div className="h-12" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400">
                        <span>[acf_field: psc_host_show_name]</span>
                        <span className="text-sky-500 font-extrabold">• Podcast Host Channels</span>
                      </div>
                      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight tracking-tight">
                        {(previewProfile as HostProfile).showName}
                      </h1>
                    </div>

                    {/* Verified active broadcast channel badge */}
                    <div className="inline-flex items-center gap-1.5 bg-sky-50 border border-sky-300/35 py-1.5 px-3 rounded-xl shadow-3xs self-start sm:self-auto">
                      <Tv className="w-4 h-4 text-sky-500 animate-pulse" />
                      <span className="text-[9px] font-display font-black text-slate-800 tracking-wider">VERIFIED BROADCAST CHANNEL</span>
                    </div>
                  </div>

                  {/* Show Category Underline */}
                  {(() => {
                    const firstTopic = (previewProfile as HostProfile).showTopics[0];
                    const primaryCategory = CATEGORIZED_TOPICS.find(cat => cat.topics.includes(firstTopic));
                    const accentColor = primaryCategory?.color || '#D4AF37';
                    return (
                      <div className="pt-2">
                        <div className="h-[3px] w-40 rounded-full" style={{ backgroundColor: accentColor }} />
                        <span className="text-[8px] font-mono text-slate-300 block mt-1">[category_field: topics_primary_color]</span>
                      </div>
                    );
                  })()}
                </div>

                {/* 2. PROFILE ROW (Two-Column Flexbox with details & Hosting Platform icons) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white p-6 rounded-2xl border border-slate-150/70 shadow-3xs hover:border-slate-300 transition-all duration-300 relative">
                  <span className="absolute -top-2.5 left-6 bg-slate-100 border border-slate-250/60 rounded px-1.5 py-0.2 font-mono text-[7px] font-bold text-sky-600 uppercase tracking-widest">
                    [wp_meta_block: profile_row]
                  </span>

                  {/* Logo / Social Left Column (Span 4) */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center space-y-4 border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-6 text-center select-none">
                    <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest">
                      [acf: psc_host_logo_photo]
                    </p>
                    <img 
                      src={(previewProfile as HostProfile).logoUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=150&fit=crop'} 
                      alt="" 
                      className="w-28 h-28 rounded-2xl object-cover border-2 border-slate-100 shadow-md duration-300"
                    />
                    
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800">Hosting Channels</p>
                      <div className="flex items-center gap-1.5 justify-center">
                        <span className="text-[10px] tracking-wider font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          🟢 Spotify Podcasts
                        </span>
                        <span className="text-[10px] tracking-wider font-extrabold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                          🟣 Apple FM
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata Right Column (Span 8) */}
                  <div className="md:col-span-8 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-sky-600 block font-bold">[acf: psc_host_industry]</span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Show Sector Focus</p>
                        <p className="text-sm font-bold text-slate-800">{(previewProfile as HostProfile).industry}</p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-sky-600 block font-bold">[acf: psc_host_format]</span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Broadcast Format</p>
                        <p className="text-sm font-bold text-slate-800 font-mono text-sky-600">{(previewProfile as HostProfile).format}</p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-sky-600 block font-bold">[acf: psc_host_audience_size]</span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Channel Audience Size</p>
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-sky-400" />
                          {(previewProfile as HostProfile).audienceSize}
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-sky-600 block font-bold">[acf: psc_host_remote_options]</span>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Remote Integration</p>
                        <p className="text-sm font-bold text-slate-800">{(previewProfile as HostProfile).remoteOptions}</p>
                      </div>

                    </div>

                    <div className="pt-2.5 border-t border-slate-150/40">
                      <span className="text-[9px] font-mono text-sky-600 block font-bold">[acf: psc_host_languages]</span>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Languages Supported</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(previewProfile as HostProfile).languages.map(lang => (
                          <span key={lang} className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {/* 3. MATCH SCORE BADGE SECTION */}
                <div className="bg-[#FCFDFD] border-2 border-dashed border-slate-200 p-6 rounded-2xl relative select-none">
                  <span className="absolute -top-2.5 left-6 bg-sky-500 text-white font-mono text-[7px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase">
                    Shortcode Widget: [psc_match_score_badge_dynamic]
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                    <div className="sm:col-span-8 space-y-1.5">
                      <h3 className="font-display font-bold text-md text-slate-800 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-sky-500" />
                        PSC Host Pairing Match Shield
                      </h3>
                      <p className="font-sans text-xs text-slate-500 leading-relaxed">
                        Evaluated relative to active viewer context. Guest-to-Host index queries perform calculation based on show concept parameters.
                      </p>
                      <div className="text-[10px] bg-slate-100 text-slate-500 font-mono p-1 rounded inline-block">
                        viewer_role: <strong className="text-indigo-800">{viewerType}</strong> | active: <strong className="text-sky-800">Host Card</strong>
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex justify-center sm:justify-end">
                      <BadgeWidget 
                        score={score} 
                        isLocked={isLocked || viewerType === 'host'} 
                        lockReason={viewerType === 'host' ? 'Spectator context is "Host". Pairing calculations locked (must be a Guest viewing show hosts to trigger score).' : lockReason} 
                        size="md"
                        animated={true}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. SHOW DESCRIPTION */}
                <div className="space-y-3 relative">
                  <span className="absolute -top-3.5 right-6 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 font-mono text-[7px] text-[#D4AF37]">
                    [acf: psc_host_show_description]
                  </span>
                  <h2 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sky-500" />
                    Podcast Concept & Broadcast Narrative
                  </h2>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 text-[#444444] text-base leading-relaxed font-sans shadow-3xs hover:border-slate-200 transition-all select-text">
                    {(previewProfile as HostProfile).description}
                  </div>
                </div>

                {/* 5. TOPICS COVERED ON THE SHOW */}
                <div className="space-y-4 relative">
                  <span className="absolute -top-3.5 right-6 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 font-mono text-[7px] text-[#D4AF37]">
                    [acf_taxonomy: psc_host_topics]
                  </span>
                  <h2 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-sky-500" />
                    Covered Show themes & Topics Matrix
                  </h2>
                  
                  <div className="bg-slate-50 border border-slate-200/65 p-5 rounded-2xl space-y-4">
                    {CATEGORIZED_TOPICS.map(cat => {
                      const profileTopics = (previewProfile as HostProfile).showTopics;
                      const matchingTopics = cat.topics.filter(t => profileTopics.includes(t));
                      
                      if (matchingTopics.length === 0) return null;
                      
                      return (
                        <div key={cat.category} className="space-y-1.5 pb-2 border-b border-slate-150 last:border-0 last:pb-0">
                          <h4 className="text-xs font-display font-extrabold uppercase tracking-widest flex items-center gap-2" style={{ color: cat.color }}>
                            <span className="w-2.5 h-2.5 rounded-full inline-block shadow-3xs" style={{ backgroundColor: cat.color }} />
                            {cat.category}
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {matchingTopics.map(t => (
                              <span 
                                key={t}
                                style={{ backgroundColor: `${cat.color}10`, color: cat.color, borderColor: `${cat.color}35` }}
                                className="px-3 py-1 text-xs font-extrabold rounded-lg border font-display"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 6. GUEST REQUIREMENTS */}
                <div className="space-y-3 relative">
                  <span className="absolute -top-3.5 right-6 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 font-mono text-[7px] text-sky-600">
                    [acf: psc_host_guest_requirements]
                  </span>
                  <h3 className="text-xs font-mono font-bold tracking-widest text-[#D4AF37] uppercase flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    Coordinated On-Air Guest Requirements
                  </h3>
                  <div className="bg-amber-50 border border-[#D4AF37]/30 p-5 rounded-xl text-slate-700 leading-relaxed text-sm italic">
                    "{(previewProfile as HostProfile).guestRequirements || 'Seeking professional experts with intermediate or expert levels of field background.'}"
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Required Minimum Core Experience Level: <strong className="text-slate-700">{(previewProfile as HostProfile).requiredExperienceLevel}</strong>
                  </p>
                </div>

                {/* 7. MEDIA / FEATURED EPISODES (Podcast dynamic show audio) */}
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 relative text-white">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
                      <h3 className="font-display font-bold text-sm tracking-widest uppercase">
                        Radio / Recent Episode Audio Sneak Peek
                      </h3>
                    </div>
                    <span className="bg-sky-500/20 text-sky-400 text-[8px] font-mono font-extrabold px-2.5 py-0.5 rounded border border-sky-400/35">
                      PSC Player Shortcode
                    </span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-center gap-4">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-12 h-12 rounded-full bg-sky-550 hover:bg-sky-400 transition-all duration-300 text-slate-950 bg-sky-400 flex items-center justify-center shrink-0 shadow-lg cursor-pointer transform active:scale-95"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 text-slate-950" /> : <Play className="w-5 h-5 ml-1 text-slate-950" />}
                    </button>

                    <div className="flex-1 w-full space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-sky-400 font-mono">
                          {isPlaying ? "🎙️ STREAMING CHANNEL DEMO EPISODE" : "📻 BROADCAST SAMPLE OFFLINE"}
                        </span>
                        <span className="font-mono text-slate-400">
                          {Math.floor(playbackTime / 60)}:{(playbackTime % 60).toString().padStart(2, '0')} / 5:00
                        </span>
                      </div>
                      
                      <div className="h-6 flex items-center gap-1 bg-slate-900 border border-slate-850 px-3 rounded-lg overflow-hidden relative">
                        {isPlaying ? (
                          <div className="absolute inset-0 bg-sky-500/5 animate-pulse" />
                        ) : null}
                        
                        {/* Audio Waves Simulation */}
                        {Array.from({ length: 28 }).map((_, i) => {
                          let h = 10;
                          if (isPlaying) {
                            h = Math.floor(Math.abs(Math.sin((playbackTime * 3) + i * 2)) * 18) + 6;
                          } else {
                            h = 6;
                          }
                          return (
                            <div 
                              key={i} 
                              className={`w-1 rounded-sm flex-1 transition-all duration-200 ${
                                isPlaying ? 'bg-sky-400' : 'bg-slate-700'
                              }`} 
                              style={{ height: `${h}px` }}
                            />
                          );
                        })}
                      </div>
                      
                      <p className="text-[10px] text-slate-400 italic">
                        Current Playback: <strong>"Latest episode highlights regarding raw industry synergy and direct casting"</strong>
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7.5. REVIEWS SECTION */}
                {hostReviews.length > 0 && (
                  <div className="space-y-4 relative">
                    <span className="absolute -top-3.5 right-6 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.2 font-mono text-[7px] text-sky-500">
                      [acf: psc_host_reviews]
                    </span>
                    <h2 className="font-display font-black text-xl uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Star className="w-5 h-5 text-sky-500" />
                      Reviews & Testimonials
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {displayedHostReviews.map(review => (
                        <div key={review.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl shadow-3xs space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <img src={review.authorPhoto} alt={review.authorName} className="w-10 h-10 rounded-full border border-slate-200 object-cover shadow-sm" />
                              <div>
                                <div className="text-sm font-bold text-slate-900 group">
                                  <a href="#" className="hover:text-sky-500 hover:underline underline-offset-2 transition-colors">
                                    {review.authorName}
                                  </a>
                                </div>
                                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                  {review.authorType} &bull; {review.date}
                                </div>
                              </div>
                            </div>
                            <div className="flex text-sky-500 text-xs">
                              {Array.from({ length: 5 }).map((_, i) => {
                                const rating = review.rating || 0;
                                if (i < Math.floor(rating)) return <Star key={i} className="w-3.5 h-3.5 fill-current" />;
                                if (i === Math.floor(rating) && rating % 1 !== 0) return <StarHalf key={i} className="w-3.5 h-3.5 fill-current" />;
                                return <Star key={i} className="w-3.5 h-3.5 text-slate-300" />;
                              })}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1 leading-snug">{review.title}</h4>
                            <p className="text-sm text-slate-700 italic leading-relaxed">"{review.text}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {hostReviews.length > 2 && (
                      <div className="text-center mt-4">
                        <button 
                          onClick={() => setShowReviewsModal(true)}
                          className="bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-600 px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-sm"
                        >
                          See All Reviews ({hostReviews.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 8. CALL-TO-ACTION SECTION WITH INTERACTIVE APPLICATION WORKFLOW */}
                <div className="pt-6 border-t border-slate-200 flex flex-col items-center justify-center space-y-4">
                  <div className="text-center space-y-1.5">
                    <h4 className="font-display font-extrabold text-lg text-slate-900">
                      Do you align with {(previewProfile as HostProfile).showName}?
                    </h4>
                    <p className="text-xs text-slate-500 max-w-lg mx-auto">
                      Pitch this show host using our Elementor direct booking application shortcode widget below!
                    </p>
                  </div>

                  {activeAction === 'apply' ? (
                    <div className="w-full bg-white border border-sky-300 rounded-2xl p-5 shadow-lg space-y-4 max-w-md animate-fade-in divide-y divide-slate-100">
                      
                      {/* Form Header */}
                      <div className="pb-3 flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1">
                          <Send className="w-4 h-4 text-sky-500" />
                          PSC Integrated Application form
                        </span>
                        <button 
                          onClick={() => { setActiveAction(null); setFormSubmitted(false); }}
                          className="text-slate-400 hover:text-slate-600 font-bold"
                        >
                          ✕ Close
                        </button>
                      </div>

                      {formSubmitted ? (
                        <div className="pt-4 py-8 text-center text-slate-800 space-y-3">
                          <div className="w-12 h-12 rounded-full bg-emerald-150 text-emerald-600 inline-flex items-center justify-center mx-auto">
                            <Check className="w-6 h-6" />
                          </div>
                          <h4 className="font-extrabold text-sky-500 font-display text-base">Pitch Application Dispatched!</h4>
                          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            Your speaker profile, verified matching weights, and pitch statement have been routed to host email <strong>{(previewProfile as HostProfile).hostEmail || 'host@joinedpodsyndi.com'}</strong>.
                          </p>
                          <button 
                            onClick={() => { setFormSubmitted(false); setActiveAction(null); }}
                            className="bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] px-4 py-1.5 rounded-lg text-center"
                          >
                            Return to profile
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4 pt-3.5 text-xs text-slate-600">
                          
                          {/* Pitch composer */}
                          <div className="space-y-1">
                            <label className="font-bold text-slate-700 block text-[10px] uppercase">Your Pitch Statement (ACF psc_guest_pitch):</label>
                            <textarea 
                              value={pitchText}
                              onChange={(e) => setPitchText(e.target.value)}
                              rows={3}
                              className="w-full bg-slate-50 border border-slate-205 text-slate-800 p-2 text-xs rounded-xl focus:ring-1 focus:ring-sky-500 focus:bg-white outline-hidden font-sans"
                            />
                          </div>

                          {/* Drag & Drop simulated uploader */}
                          <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                            <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                            <p className="text-[10px] font-bold text-slate-700">Attach Media Kit, EPK PDF or Resume</p>
                            <p className="text-[9px] text-zinc-400 font-mono mt-0.5">Drag-and-drop file or click to select</p>
                          </div>

                          {/* Submit Application */}
                          <button 
                            onClick={() => setFormSubmitted(true)}
                            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2.5 rounded-xl text-xs tracking-wider uppercase transition-all duration-200 shadow-md font-display"
                          >
                            Dispatch On-Air Pitch Submission
                          </button>
                        </div>
                      )}

                    </div>
                  ) : (
                    <button 
                      onClick={() => setActiveAction('apply')}
                      className="bg-sky-500 hover:bg-sky-400 text-white font-display font-extrabold text-sm uppercase px-8 py-3.5 rounded-2xl tracking-wider transition-all duration-300 border border-slate-250 shadow-md flex items-center gap-2 transform active:scale-95 cursor-pointer"
                    >
                      <Send className="w-4 h-4 text-white" />
                      Apply to Be a Guest
                    </button>
                  )}
                </div>

                {/* Simulated WP meta fields trace line */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/60 text-[9px] font-mono text-slate-400">
                  <span className="font-mono">[wp_shortcode_indicator: field_mapping_acf_success]</span>
                  <span>ID: {(previewProfile as HostProfile).id}</span>
                </div>

              </div>
            )}

          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: Weighted Matching Trace and Settings (span 5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* MATCH SCORING ALGORITHM TELEMETRY trace */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
              Weighted Matching Trace
            </h3>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-400 px-2 py-0.5 rounded font-bold">
              PSC TRACE ENGINES
            </span>
          </div>

          {calculationMode === 'Anonymous' ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
              <MessageSquareOff className="w-12 h-12 text-slate-200" />
              <h4 className="text-xs font-bold uppercase text-slate-400">Trace Blocked (Anonymous)</h4>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                Dynamic calculations require active workspace perspectives. Switch simulated viewer roles in the sidebar adapter.
              </p>
            </div>
          ) : calculationMode === 'SelfMatch' ? (
            <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
              <Network className="w-12 h-12 text-slate-300 animate-pulse" />
              <h4 className="text-xs font-bold uppercase text-slate-400">Self-Match Context Refused</h4>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                Pairings only execute between cross-entities (Guest ↔ Host). Select an opposing perspective to calculate traces.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Formula calculation trace parameters */}
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl space-y-1.5 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-400">GUEST INGEST:</span>
                  <span className="font-mono text-slate-800 truncate max-w-[150px]">
                    {calculationMode === 'HostViewingGuest' ? (previewProfile as GuestProfile).displayName : (viewerProfile as GuestProfile).displayName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-400">HOST INGEST:</span>
                  <span className="font-mono text-slate-800 truncate max-w-[150px]">
                    {calculationMode === 'HostViewingGuest' ? (viewerProfile as HostProfile).showName : (previewProfile as HostProfile).showName}
                  </span>
                </div>
                <div className="text-[10px] bg-amber-500/10 text-amber-800 border border-amber-200/50 rounded p-1.5 leading-normal mt-1">
                  <strong>Trace Ingestion Direction:</strong> {calculationMode === 'HostViewingGuest' ? 'Host analyzing speaker meta' : 'Speaker analyzing show format'}
                </div>
              </div>

              {/* DYNAMIC PROGRESS LIST matching the requested UI of the Design HTML */}
              <div className="space-y-3.5 pt-2">
                {[
                  { label: 'Past Rating Performance', weightKey: 'reviews', field: 'reviews' },
                  { label: 'Topic Overlap', weightKey: 'topics', field: 'topics' },
                  { label: 'Industry Alignment', weightKey: 'industry', field: 'industry' },
                  { label: 'Experience Factor', weightKey: 'experience', field: 'experience' },
                  { label: 'Format Compatibility', weightKey: 'format', field: 'format' },
                  { label: 'Audience Preference', weightKey: 'audience', field: 'audience' },
                  { label: 'Location Alignment', weightKey: 'location', field: 'location' },
                  { label: 'Language Multi-match', weightKey: 'language', field: 'language' },
                ].map((wt) => {
                  const trace = traceResults?.[wt.weightKey];
                  if (!trace) return null;
                  const ratio = trace.score;
                  const percent = Math.round(ratio * 100);
                  const coef = trace.maxWeight;

                  return (
                    <div key={wt.weightKey} className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-medium">{wt.label} ({Math.round(coef * 100)}% weight)</span>
                        <span className="font-mono font-bold text-slate-900">{ratio.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* CORE_FORMULA LOGGER AS IN MOCKUP */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-[10px] text-slate-400 bg-slate-50 border border-slate-100 rounded-lg p-2.5 font-mono leading-relaxed truncate">
                  SCORE_FORMULA: (w_topic * {traceResults?.topics?.score?.toFixed(2) || '0.00'}) + (w_ind * {traceResults?.industry?.score?.toFixed(2) || '0.00'}) + ... = {(score / 100).toFixed(3)}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* Dynamic score weights card from Design HTML */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-amber-500" />
            Global Options Index Weights
          </h3>
          <p className="text-slate-400 text-xs mb-4">
            Underlying meta weights registered in dynamic option fields dynamically synced to calculation vectors.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Topics Coef</p>
              <p className="text-lg font-mono font-bold text-slate-700">{weights.topics.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Industry</p>
              <p className="text-lg font-mono font-bold text-slate-700">{weights.industry.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Audience Pref</p>
              <p className="text-lg font-mono font-bold text-slate-700">{weights.audience.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[9px] font-bold text-slate-400 uppercase">Location Factor</p>
              <p className="text-lg font-mono font-bold text-slate-700">{weights.location.toFixed(2)}</p>
            </div>
          </div>
          <div className="mt-4 text-xs font-medium text-amber-700 bg-amber-50 p-2 text-center rounded-lg border border-amber-200/50">
            Total Weights: {(weights.topics + weights.industry + weights.experience + weights.format + weights.audience + weights.location + weights.language).toFixed(2)} / 1.00
          </div>
        </div>

        {/* PODSYNDICONNECT SCORE FORMULA REFERENCE PANEL */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-1.5 justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 text-[#8A6D1C]">
              <svg className="w-5 h-5 text-amber-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.11v4.71c0 4.54-3.13 8.79-7 9.82-3.87-1.03-7-5.28-7-9.82V6.29l7-3.11z"/>
              </svg>
              Match Score Formula (PodSyndiConnect)
            </h3>
            <span className="text-[9px] font-mono font-extrabold uppercase bg-amber-50 text-amber-800 px-2.2 py-0.5 rounded border border-amber-200/40 shrink-0">
              WP CORE
            </span>
          </div>

          <div className="space-y-3.5 text-xs text-slate-600 leading-normal">
            <p className="font-semibold text-slate-700 border-b border-dashed border-slate-100 pb-1.5">
              The Match Score is a weighted sum of seven dimensions, each scored between 0 and 1, then converted to a percentage.
            </p>

            {/* 1. Dimensions Mapping */}
            <div className="space-y-1.5">
              <p className="font-extrabold uppercase tracking-wider text-[10px] text-slate-400">1. Dimension Ratings (T_x &isin; [0, 1])</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-250/20">
                <div className="flex justify-between border-b border-slate-100/10 pb-0.5">
                  <span className="text-amber-700 font-bold">Topics:</span>
                  <span>T_topics ({traceResults?.topics?.score?.toFixed(2) || '0.00'})</span>
                </div>
                <div className="flex justify-between border-b border-slate-100/10 pb-0.5">
                  <span className="text-amber-700 font-bold">Industry:</span>
                  <span>T_industry ({traceResults?.industry?.score?.toFixed(2) || '0.00'})</span>
                </div>
                <div className="flex justify-between border-b border-slate-100/10 pb-0.5">
                  <span className="text-amber-700 font-bold">Experience:</span>
                  <span>T_experience ({traceResults?.experience?.score?.toFixed(2) || '0.00'})</span>
                </div>
                <div className="flex justify-between border-b border-slate-100/10 pb-0.5">
                  <span className="text-amber-700 font-bold">Format:</span>
                  <span>T_format ({traceResults?.format?.score?.toFixed(2) || '0.00'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700 font-bold">Audience:</span>
                  <span>T_audience ({traceResults?.audience?.score?.toFixed(2) || '0.00'})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700 font-bold">Location / Remote:</span>
                  <span>T_loc ({traceResults?.location?.score?.toFixed(2) || '0.00'})</span>
                </div>
                <div className="flex justify-between col-span-2 pt-0.5 border-t border-dashed border-slate-250">
                  <span className="text-amber-700 font-bold">Language:</span>
                  <span>T_lang ({traceResults?.language?.score?.toFixed(2) || '0.00'})</span>
                </div>
              </div>
            </div>

            {/* 2. Weight Coefficients */}
            <div className="space-y-1.5">
              <p className="font-extrabold uppercase tracking-wider text-[10px] text-slate-400">2. Weight Coefficients (w_x)</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-250/20">
                <div className="flex justify-between">
                  <span>Topics core:</span>
                  <span className="font-bold text-slate-800">w_topics = {weights.topics.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Industry weight:</span>
                  <span className="font-bold text-slate-800">w_industry = {weights.industry.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Experience:</span>
                  <span className="font-bold text-slate-800">w_experience = {weights.experience.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format weight:</span>
                  <span className="font-bold text-slate-800">w_format = {weights.format.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Audience weight:</span>
                  <span className="font-bold text-slate-800">w_audience = {weights.audience.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Loc / Remote weight:</span>
                  <span className="font-bold text-slate-800">w_loc = {weights.location.toFixed(2)}</span>
                </div>
                <div className="flex justify-between col-span-2 pt-0.5 border-t border-dashed border-slate-250">
                  <span>Language weight:</span>
                  <span className="font-bold text-slate-800">w_lang = {weights.language.toFixed(2)}</span>
                </div>
              </div>
              <div className="text-[10px] text-emerald-700 font-mono italic text-center p-1 bg-emerald-50 border border-emerald-150/40 rounded">
                Constraint: w_topics + w_industry + w_experience + w_format + w_audience + w_loc + w_lang = 1.0
              </div>
            </div>

            {/* 3. Composite score */}
            <div className="space-y-1.5">
              <p className="font-extrabold uppercase tracking-wider text-[10px] text-slate-400">3. Composite S Score</p>
              <div className="bg-slate-900 text-[#D4AF37] p-3 rounded-xl font-mono text-[10.5px] leading-relaxed border border-slate-800 shadow-md">
                <span className="text-slate-400">Raw Composite Score S:</span>
                <div className="mt-1 leading-normal font-semibold text-white">
                  S = (w_topics &middot; T_topics) + (w_industry &middot; T_industry) + (w_experience &middot; T_experience) + (w_format &middot; T_format) + (w_audience &middot; T_audience) + (w_loc &middot; T_loc) + (w_lang &middot; T_lang)
                </div>
                <div className="mt-2.5 text-slate-400 border-t border-slate-800 pt-1.5 flex justify-between">
                  <span>Calculated S:</span>
                  <span className="font-bold text-amber-400">
                    S = {calculationMode !== 'Anonymous' && calculationMode !== 'SelfMatch' ? (score / 100).toFixed(4) : '0.0000'}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Displayed match score */}
            <div className="space-y-1">
              <p className="font-extrabold uppercase tracking-wider text-[10px] text-slate-400">4. Displayed Match Score (percentage)</p>
              <div className="bg-amber-500/10 border border-amber-200 p-2.5 rounded-xl text-amber-900 text-xs font-bold leading-relaxed flex items-center justify-between">
                <div>
                  <span className="font-mono text-[10px]">Match Score (%) = round(S &times; 100)</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 font-display font-extrabold text-sm">
                    {calculationMode !== 'Anonymous' && calculationMode !== 'SelfMatch' ? `${score}%` : '0%'}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic">
                That final percentage is what goes inside the gold shield badge.
              </p>
            </div>
          </div>
        </div>

      </div>
      
      {/* REVIEWS MODAL */}
      {showReviewsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className={`font-display border-b-0 pb-0 text-xl font-black uppercase tracking-wider flex items-center gap-2 ${isPreviewGuest ? 'text-slate-800' : 'text-slate-800'}`}>
                <Star className={`w-6 h-6 ${isPreviewGuest ? 'text-[#D4AF37]' : 'text-sky-500'}`} />
                All Reviews ({isPreviewGuest ? guestReviews.length : hostReviews.length})
              </h2>
              <button 
                onClick={() => setShowReviewsModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors border border-slate-200 shadow-sm"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="flex flex-col gap-5">
                {(isPreviewGuest ? guestReviews : hostReviews).map(review => (
                  <div key={review.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <img src={review.authorPhoto} alt={review.authorName} className="w-12 h-12 rounded-full border border-slate-200 object-cover shadow-sm" />
                        <div>
                          <div className="font-bold text-slate-900 group text-base">
                            <a href="#" className={`hover:underline underline-offset-2 transition-colors ${isPreviewGuest ? 'hover:text-[#D4AF37]' : 'hover:text-sky-500'}`}>
                              {review.authorName}
                            </a>
                          </div>
                          <div className="text-[11px] uppercase font-bold text-slate-500 tracking-widest mt-0.5">
                            {review.authorType} &bull; {review.date}
                          </div>
                        </div>
                      </div>
                      <div className={`flex text-xs ${isPreviewGuest ? 'text-amber-500' : 'text-sky-500'}`}>
                        {Array.from({ length: 5 }).map((_, i) => {
                          const rating = review.rating || 0;
                          if (i < Math.floor(rating)) return <Star key={i} className="w-4 h-4 fill-current" />;
                          if (i === Math.floor(rating) && rating % 1 !== 0) return <StarHalf key={i} className="w-4 h-4 fill-current" />;
                          return <Star key={i} className="w-4 h-4 text-slate-200" />;
                        })}
                      </div>
                    </div>
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-2 leading-relaxed">{review.title}</h4>
                      <p className="text-base text-slate-700 italic leading-relaxed">"{review.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
