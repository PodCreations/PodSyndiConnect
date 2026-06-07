import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  MapPin, 
  ShieldCheck, 
  ChevronRight, 
  Dices,
  Radio,
  UserCheck,
  Zap,
  Globe
} from 'lucide-react';
import { GuestProfile, HostProfile } from '../types';
import { BadgeWidget } from './BadgeWidget';

interface HomePageProps {
  guests: GuestProfile[];
  hosts: HostProfile[];
  setActiveWorkspaceTab: (tab: 'home' | 'portal' | 'studio' | 'database' | 'code' | 'aimatch') => void;
  onSelectPreview?: (type: 'guest' | 'host', id: string) => void;
  viewerType: 'anonymous' | 'guest' | 'host';
}

const defaultHeaderImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=400&fit=crop';

export const HomePage: React.FC<HomePageProps> = ({
  guests,
  hosts,
  setActiveWorkspaceTab,
  onSelectPreview,
  viewerType
}) => {
  // Deterministic daily cycling
  const { featuredGuest, featuredHost } = useMemo(() => {
    const today = new Date();
    // Using UTC to ensure consistent daily rollover for all timezones
    const daysSinceEpoch = Math.floor(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) / 86400000);
    
    // Cycle sequentially without repeating until everyone has had a turn
    const guestIndex = guests.length > 0 ? (daysSinceEpoch % guests.length) : 0;
    const hostIndex = hosts.length > 0 ? (daysSinceEpoch % hosts.length) : 0;

    return {
      featuredGuest: guests[guestIndex],
      featuredHost: hosts[hostIndex]
    };
  }, [guests, hosts]);

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12 select-none">
      
      {/* SECTION A: HERO COVER */}
      <div className="bg-gradient-to-b from-[#D4AF37]/60 via-slate-200 to-slate-400 p-[1.5px] rounded-3xl shadow-2xl transition-all duration-300">
        <div className="bg-[#FAFBFD] rounded-[22px] overflow-hidden flex flex-col relative font-sans">
          
          <div className="bg-slate-950 h-64 sm:h-80 relative flex-shrink-0 select-none overflow-hidden flex items-center justify-center">
            <img 
              src={defaultHeaderImage} 
              alt="Platform Header" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAFBFD] via-slate-950/70 to-slate-950/90" />
            
            {/* Ambient Lighting */}
            <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#D4AF37]/10 blur-[100px] rounded-full translate-y-[-50%] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full translate-y-[-50%] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-6 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/60 border border-[#D4AF37]/40 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-[#D4AF37]">
                  PodSyndiConnect Directory
                </span>
              </div>
              
              <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight [text-shadow:0_4px_24px_rgba(0,0,0,0.4)]">
                Syndicate Your Message with <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#ffdf6b]">Precision Matches</span>
              </h1>
              
              <p className="font-sans text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
                Connect world-class guest experts with leading podcast hosts through our proprietary metadata matching framework.
              </p>

              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button 
                  onClick={() => setActiveWorkspaceTab('aimatch')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black px-6 py-3 rounded-xl uppercase tracking-wider text-sm transition-transform active:scale-95 shadow-[0_4px_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
                >
                  <Dices className="w-5 h-5" />
                  Spin the Matchmaker
                </button>
                <button 
                  onClick={() => setActiveWorkspaceTab('portal')}
                  className="bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center gap-2"
                >
                  <UserCheck className="w-5 h-5 text-slate-400" />
                  Access Portal
                </button>
              </div>
            </div>
            
            {/* Soundwave details */}
            <div className="absolute left-0 right-0 bottom-0 flex items-end justify-between px-10 h-16 opacity-30 gap-1 overflow-hidden pointer-events-none">
               {Array.from({length: 40}).map((_, i) => (
                  <div 
                    key={i} 
                    className="w-1 rounded-t-full bg-gradient-to-t from-[#D4AF37] to-amber-200" 
                    style={{ height: `${20 + Math.random() * 80}%` }}
                  />
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION B: HIGHLIGHTING THE AI MATCH SPIN AND SCORE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* The Match Score Showpiece */}
        <div className="bg-gradient-to-br from-slate-900 to-[#101928] rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl overflow-hidden relative group">
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full" />
          
          <div className="space-y-6 relative z-10 flex flex-col h-full">
            <div className="inline-flex items-center gap-2 bg-indigo-950/50 border border-indigo-500/30 px-3 py-1.5 rounded-lg w-max">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-widest">
                Proprietary Ranking Engine
              </span>
            </div>
            
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide leading-tight">
              A Match Score <br className="hidden sm:block"/> Like No Other
            </h2>
            
            <p className="font-sans text-sm text-slate-400 leading-relaxed flex-1">
              Our system doesn't rely on simple keyword overlaps. We trace and weight <strong>Custom Post Type</strong> metadata layers—from audience scale preferences to remote readiness and speaker competency tiers—calculating a dynamic compatibility coefficient in real-time.
            </p>
            
            <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80 flex justify-center items-center backdrop-blur-sm">
              <BadgeWidget 
                score={98} 
                isLocked={false} 
                size="lg"
                animated={true}
              />
            </div>
          </div>
        </div>

        {/* The Spinning Matchmaker Promo */}
        <div className="bg-gradient-to-tr from-[#1E1B10] to-[#2D2A1F] rounded-3xl p-8 sm:p-10 border border-amber-900/30 shadow-xl overflow-hidden relative">
          <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-amber-500/10 blur-3xl rounded-full" />
          
          <div className="space-y-6 relative z-10 flex flex-col h-full">
            <div className="inline-flex items-center gap-2 bg-amber-950/40 border border-amber-600/30 px-3 py-1.5 rounded-lg w-max">
              <Zap className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                Infinite Syndication Cycle
              </span>
            </div>
            
            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-wide leading-tight">
              Spin The Turbine for <br className="hidden sm:block"/> Instant Alignment
            </h2>
            
            <p className="font-sans text-sm text-slate-400 leading-relaxed flex-1">
              Need fresh guests for your upcoming season? Looking for the perfect show to cross-promote? Head to the <strong>AI Matchmaker</strong> to spin the syndication turbine and discover 25 highly-categorized matches, sorted instantly by metric alignment.
            </p>
            
            <div className="pt-4">
              <button 
                onClick={() => setActiveWorkspaceTab('aimatch')}
                className="w-full relative group overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-[2px] cursor-pointer"
              >
                <div className="bg-slate-950 hover:bg-slate-900 rounded-[10px] px-6 py-4 flex items-center justify-between transition-colors z-10 relative">
                  <div className="flex items-center gap-3">
                    <Dices className="w-6 h-6 text-amber-500 group-hover:animate-bounce" />
                    <span className="font-display font-black text-base uppercase text-amber-400 tracking-wider">
                      Try AI Match Spin Now
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-amber-600 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION C: FEATURED PROFILES OF THE DAY */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <Globe className="w-6 h-6 text-slate-800" />
          <h2 className="font-display font-black text-2xl text-slate-800 uppercase tracking-wider">
            Daily Syndication Spotlight
          </h2>
        </div>
        <p className="text-sm text-slate-500 font-sans">
          Curated opportunities cycling worldwide across our network. New hosts and guests featured every 24 hours.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Featured Host Card */}
          {featuredHost && (
            <div className="bg-white rounded-2xl border border-slate-200 p-[1px] shadow-md group relative hover:shadow-xl transition-all duration-300">
              <div className="absolute top-4 left-4 z-20">
                 <div className="flex items-center gap-1.5 bg-slate-950 text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded shadow-sm border border-slate-700">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   FEATURED HOST
                 </div>
              </div>
              <div className="bg-white rounded-[15px] overflow-hidden flex flex-col h-full">
                <div className="h-28 relative">
                   <img src={featuredHost.headerBgUrl || defaultHeaderImage} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                </div>
                <div className="px-6 pb-6 pt-2 flex-1 flex flex-col space-y-4">
                  <div className="flex gap-4">
                    <img src={featuredHost.logoUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=150&fit=crop'} alt="" className="w-16 h-16 rounded-2xl border-4 border-white shadow-sm -mt-10 object-cover relative z-10 bg-white" />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-600 block uppercase mb-0.5">{featuredHost.industry}</span>
                      <h3 className="font-display font-bold text-lg text-slate-900 leading-tight block">{featuredHost.showName}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed flex-1">
                    {featuredHost.description}
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      {featuredHost.location}
                    </div>
                    <button 
                      onClick={() => {
                        if (onSelectPreview) onSelectPreview('host', featuredHost.id);
                        setActiveWorkspaceTab('studio');
                      }}
                       className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors border border-blue-100 cursor-pointer"
                    >
                      View Show &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Featured Guest Card */}
          {featuredGuest && (
            <div className="bg-white rounded-2xl border border-slate-200 p-[1px] shadow-md group relative hover:shadow-xl transition-all duration-300">
               <div className="absolute top-4 left-4 z-20">
                 <div className="flex items-center gap-1.5 bg-[#FAF6E3] text-amber-900 border border-[#D4AF37]/50 font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 rounded shadow-sm">
                   <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                   FEATURED GUEST
                 </div>
              </div>
              <div className="bg-white rounded-[15px] overflow-hidden flex flex-col h-full">
                <div className="h-28 relative">
                   <img src={featuredGuest.headerBgUrl || defaultHeaderImage} alt="" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
                   <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
                </div>
                <div className="px-6 pb-6 pt-2 flex-1 flex flex-col space-y-4">
                  <div className="flex gap-4">
                    <img src={featuredGuest.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop'} alt="" className="w-16 h-16 rounded-full border-4 border-white shadow-sm -mt-10 object-cover relative z-10 bg-white" />
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#D4AF37] block uppercase mb-0.5">{featuredGuest.industry}</span>
                      <h3 className="font-display font-bold text-lg text-slate-900 leading-tight block">{featuredGuest.displayName}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed flex-1 italic">
                    "{featuredGuest.bio}"
                  </p>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                      <Radio className="w-3.5 h-3.5 text-[#D4AF37]" />
                      Speaks on {featuredGuest.topics[0]}
                    </div>
                    <button 
                      onClick={() => {
                        if (onSelectPreview) onSelectPreview('guest', featuredGuest.id);
                        setActiveWorkspaceTab('studio');
                      }}
                      className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-colors border border-amber-200 cursor-pointer"
                    >
                      View Profile &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
