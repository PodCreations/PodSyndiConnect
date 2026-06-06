import React, { useState, useEffect } from 'react';
import { GuestProfile, HostProfile } from '../types';
import defaultHeaderImage from '../assets/images/brand_header_1780775563058.png';
import { 
  AVAILABLE_TOPICS, 
  AVAILABLE_INDUSTRIES, 
  AVAILABLE_LANGUAGES,
  CATEGORIZED_TOPICS,
  getTopicButtonStyles
} from '../data';
import { 
  User, 
  Users, 
  Save, 
  Check, 
  UserCheck, 
  Sparkles, 
  Globe, 
  Eye, 
  Mic, 
  ArrowRight, 
  Megaphone,
  Network
} from 'lucide-react';

interface MemberPortalProps {
  guests: GuestProfile[];
  hosts: HostProfile[];
  onUpdateGuests: (updated: GuestProfile[]) => void;
  onUpdateHosts: (updated: HostProfile[]) => void;
  viewerType: 'anonymous' | 'guest' | 'host';
  setViewerType: (type: 'anonymous' | 'guest' | 'host') => void;
  setSelectedViewerGuestId: (id: string) => void;
  setSelectedViewerHostId: (id: string) => void;
  onSelectPreview: (type: 'guest' | 'host', id: string) => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  guests,
  hosts,
  onUpdateGuests,
  onUpdateHosts,
  viewerType,
  setViewerType,
  setSelectedViewerGuestId,
  setSelectedViewerHostId,
  onSelectPreview,
}) => {
  // We'll manage state for user's guest and host setup.
  // We'll tie them to a specific persistent ID: 'my_guest_profile' and 'my_host_profile'
  const MY_GUEST_ID = 'user_joined_guest';
  const MY_HOST_ID = 'user_joined_host';

  const existingMyGuest = guests.find(g => g.id === MY_GUEST_ID);
  const existingMyHost = hosts.find(h => h.id === MY_HOST_ID);

  // Joining states
  const [isJoinedGuest, setIsJoinedGuest] = useState(!!existingMyGuest);
  const [isJoinedHost, setIsJoinedHost] = useState(!!existingMyHost);

  // Active sub-tab in portal: guest form or host form
  const [portalSubTab, setPortalSubTab] = useState<'guest' | 'host'>('guest');

  // Success indicator message state
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Guest State Form
  const [guestForm, setGuestForm] = useState<Partial<GuestProfile>>({
    displayName: '',
    bio: '',
    topics: [],
    industry: 'Technology',
    experienceLevel: 'Intermediate',
    location: '',
    remotePreference: 'Hybrid',
    languages: ['English'],
    audiencePreference: 'Emerging/Mid',
    preferredFormats: ['Interview'],
    tags: [],
    headerBgUrl: ''
  });

  // Host State Form
  const [hostForm, setHostForm] = useState<Partial<HostProfile>>({
    showName: '',
    description: '',
    showTopics: [],
    industry: 'Technology',
    format: 'Interview',
    audienceSize: 'Emerging/Mid',
    location: '',
    remoteOptions: 'Hybrid',
    languages: ['English'],
    guestRequirements: '',
    requiredExperienceLevel: 'Intermediate',
    tags: [],
    headerBgUrl: ''
  });

  // Load existing profiles into the form if available
  useEffect(() => {
    if (existingMyGuest) {
      setGuestForm(existingMyGuest);
      setIsJoinedGuest(true);
    }
    if (existingMyHost) {
      setHostForm(existingMyHost);
      setIsJoinedHost(true);
    }
  }, [existingMyGuest, existingMyHost]);

  // Initial values setup for new creation if empty
  useEffect(() => {
    if (!guestForm.displayName) {
      setGuestForm(prev => ({
        ...prev,
        displayName: 'Your Name Speeches',
        bio: 'I am a passionate dynamic speaker on tech, design, and audio creation.',
        topics: ['AI & Future', 'SaaS Growth'],
        location: 'New York, USA',
        headerBgUrl: defaultHeaderImage
      }));
    }
    if (!hostForm.showName) {
      setHostForm(prev => ({
        ...prev,
        showName: 'The Creator Hub Podcast',
        description: 'Aiming to empower upcoming creators with deep analysis and high production discussions.',
        showTopics: ['SaaS Growth', 'Tech Startups'],
        location: 'New York, USA',
        headerBgUrl: defaultHeaderImage
      }));
    }
  }, []);

  const handleSaveGuestProfile = () => {
    const updatedProfile: GuestProfile = {
      id: MY_GUEST_ID,
      displayName: guestForm.displayName || 'My Joined Guest Name',
      bio: guestForm.bio || '',
      topics: guestForm.topics || [],
      industry: guestForm.industry || 'Technology',
      experienceLevel: guestForm.experienceLevel || 'Intermediate',
      location: guestForm.location || 'Remote',
      remotePreference: guestForm.remotePreference || 'Hybrid',
      languages: guestForm.languages || ['English'],
      audiencePreference: guestForm.audiencePreference || 'Emerging/Mid',
      preferredFormats: guestForm.preferredFormats || ['Interview'],
      tags: guestForm.tags || [],
      avatarUrl: guestForm.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      headerBgUrl: guestForm.headerBgUrl || defaultHeaderImage,
      emailContact: guestForm.emailContact || 'me@joinedpodsyndi.com'
    };

    let updatedGuests = [...guests];
    const index = updatedGuests.findIndex(g => g.id === MY_GUEST_ID);
    if (index >= 0) {
      updatedGuests[index] = updatedProfile;
    } else {
      updatedGuests.push(updatedProfile);
    }

    onUpdateGuests(updatedGuests);
    setIsJoinedGuest(true);
    triggerNotification('Guest Speaker profile saved successfully!');
  };

  const handleSaveHostProfile = () => {
    const updatedProfile: HostProfile = {
      id: MY_HOST_ID,
      showName: hostForm.showName || 'My Joined Podcast Show',
      description: hostForm.description || '',
      showTopics: hostForm.showTopics || [],
      industry: hostForm.industry || 'Technology',
      format: hostForm.format || 'Interview',
      audienceSize: hostForm.audienceSize || 'Emerging/Mid',
      location: hostForm.location || 'Remote',
      remoteOptions: hostForm.remoteOptions || 'Hybrid',
      languages: hostForm.languages || ['English'],
      guestRequirements: hostForm.guestRequirements || 'Enthusiastic learners and product designers.',
      requiredExperienceLevel: hostForm.requiredExperienceLevel || 'Intermediate',
      tags: hostForm.tags || [],
      logoUrl: hostForm.logoUrl || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=150&h=110&fit=crop',
      headerBgUrl: hostForm.headerBgUrl || defaultHeaderImage,
      hostEmail: hostForm.hostEmail || 'host@joinedpodsyndi.com'
    };

    let updatedHosts = [...hosts];
    const index = updatedHosts.findIndex(h => h.id === MY_HOST_ID);
    if (index >= 0) {
      updatedHosts[index] = updatedProfile;
    } else {
      updatedHosts.push(updatedProfile);
    }

    onUpdateHosts(updatedHosts);
    setIsJoinedHost(true);
    triggerNotification('Podcast Host profile saved successfully!');
  };

  const handleRemoveGuestProfile = () => {
    onUpdateGuests(guests.filter(g => g.id !== MY_GUEST_ID));
    setIsJoinedGuest(false);
    triggerNotification('Removed your description from Guest Speaker directory.');
  };

  const handleRemoveHostProfile = () => {
    onUpdateHosts(hosts.filter(h => h.id !== MY_HOST_ID));
    setIsJoinedHost(false);
    triggerNotification('Removed your show from Podcast Host directory.');
  };

  const triggerNotification = (message: string) => {
    setSaveStatus(message);
    setTimeout(() => {
      setSaveStatus(null);
    }, 3500);
  };

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] => {
    if (arr.includes(item)) {
      return arr.filter(i => i !== item);
    }
    return [...arr, item];
  };

  // Switch context roleplays
  const startTestingAsGuest = () => {
    if (!isJoinedGuest) {
      handleSaveGuestProfile();
    }
    setViewerType('guest');
    setSelectedViewerGuestId(MY_GUEST_ID);
    onSelectPreview('host', hosts[0]?.id || '');
    triggerNotification('Now simulating matches as yourself (Guest Speaker)! Select hosts below.');
  };

  const startTestingAsHost = () => {
    if (!isJoinedHost) {
      handleSaveHostProfile();
    }
    setViewerType('host');
    setSelectedViewerHostId(MY_HOST_ID);
    onSelectPreview('guest', guests[0]?.id || '');
    triggerNotification('Now simulating matches as yourself (Show Host)! Select guests below.');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col min-h-[640px]">
      
      {/* HEADER SECTION ALONG THE lines of the visual look */}
      <div className="bg-slate-900 text-white px-6 py-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-md font-extrabold uppercase tracking-widest text-amber-400 font-mono">
              Self-Registration member center
            </h2>
          </div>
          <p className="text-slate-300 text-xs mt-1 leading-relaxed">
            Create and update profiles for both directories simultaneously. Toggle roles to test the compatibility matches in real time.
          </p>
        </div>

        {/* Directory Registration Badges */}
        <div className="flex flex-wrap gap-2 text-[10px] font-mono">
          <div className={`px-2.5 py-1 rounded border flex items-center gap-1.5 ${
            isJoinedGuest 
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
              : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isJoinedGuest ? 'bg-emerald-400' : 'bg-slate-600'}`} />
            GUEST CAP: {isJoinedGuest ? 'ACTIVE' : 'INACTIVE'}
          </div>
          <div className={`px-2.5 py-1 rounded border flex items-center gap-1.5 ${
            isJoinedHost 
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/40' 
              : 'bg-slate-800 text-slate-500 border-slate-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isJoinedHost ? 'bg-sky-400' : 'bg-slate-600'}`} />
            HOST CAP: {isJoinedHost ? 'ACTIVE' : 'INACTIVE'}
          </div>
        </div>
      </div>

      {/* QUICK STATUS BAR - alerts, updates */}
      {saveStatus && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 py-2.5 px-6 font-semibold text-xs flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{saveStatus}</span>
        </div>
      )}

      {/* SUB-TABS TO EDIT GUEST PROFILE VS HOST PROFILE */}
      <div className="border-b border-slate-200 bg-slate-50/50 flex flex-wrap justify-between items-center px-6 py-2 gap-3 shrink-0">
        
        {/* Forms Toggles */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
          <button
            onClick={() => setPortalSubTab('guest')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              portalSubTab === 'guest'
                ? 'bg-white text-indigo-950 shadow-xs ring-1 ring-black/5 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mic className="w-3.5 h-3.5 text-amber-500" />
            My Guest Speaker Portfolio
          </button>
          
          <button
            onClick={() => setPortalSubTab('host')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              portalSubTab === 'host'
                ? 'bg-white text-indigo-950 shadow-xs ring-1 ring-black/5 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-sky-500" />
            My Podcast Host Property
          </button>
        </div>

        {/* Quick Simulation Trigger Buttons */}
        <div className="flex gap-2">
          {portalSubTab === 'guest' ? (
            <button
              onClick={startTestingAsGuest}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-amber-400"
            >
              <Eye className="w-3.5 h-3.5" />
              Simulate Matching As Me (Guest)
            </button>
          ) : (
            <button
              onClick={startTestingAsHost}
              className="bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-sky-400"
            >
              <Eye className="w-3.5 h-3.5" />
              Simulate Matching As Me (Host)
            </button>
          )}
        </div>
      </div>

      {/* PORTAL EDIT MATRIX FORMS */}
      <div className="flex-1 p-6 md:p-8">
        {portalSubTab === 'guest' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="p-1 px-2.2 text-xs bg-amber-500/10 text-amber-700 rounded font-bold font-mono">1</span>
                Guest Speaker Directory Info
              </h3>
              {isJoinedGuest ? (
                <button
                  onClick={handleRemoveGuestProfile}
                  className="text-red-500 hover:text-red-700 hover:underline text-xs font-semibold"
                >
                  Withdraw from Speakers Directory
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium italic">Not currently active in Guest speaker lists.</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Speaker Display Name</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Cynthia Rogers"
                  value={guestForm.displayName}
                  onChange={(e) => setGuestForm({ ...guestForm, displayName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Contact Email (Private)</label>
                <input
                  type="email"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. cynthia@rogers.com"
                  value={guestForm.emailContact}
                  onChange={(e) => setGuestForm({ ...guestForm, emailContact: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Speaker Bio Excerpt</label>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Briefly pitch your speaking experience, background and credentials for podcasts hosts to find you..."
                  value={guestForm.bio}
                  onChange={(e) => setGuestForm({ ...guestForm, bio: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Your Primary Industry Accent</label>
                <select
                  value={guestForm.industry}
                  onChange={(e) => setGuestForm({ ...guestForm, industry: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                >
                  {AVAILABLE_INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Experience Level Options</label>
                <div className="flex gap-4 mt-2">
                  {['Beginner', 'Intermediate', 'Expert'].map(level => (
                    <label key={level} className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                      <input
                        type="radio"
                        name="joinGuestExp"
                        checked={guestForm.experienceLevel === level}
                        onChange={() => setGuestForm({ ...guestForm, experienceLevel: level as any })}
                        className="accent-amber-500"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Physical Location Base</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. New York, USA"
                  value={guestForm.location}
                  onChange={(e) => setGuestForm({ ...guestForm, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Recording Modality</label>
                <select
                  value={guestForm.remotePreference}
                  onChange={(e) => setGuestForm({ ...guestForm, remotePreference: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                >
                  <option value="Remote Only">Remote Only</option>
                  <option value="In-Person Only">In-Person Only</option>
                  <option value="Hybrid">Hybrid options</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Preferred Audience Size</label>
                <select
                  value={guestForm.audiencePreference}
                  onChange={(e) => setGuestForm({ ...guestForm, audiencePreference: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                >
                  <option value="Niche/Micro">Niche/Micro Shows</option>
                  <option value="Emerging/Mid">Emerging/Mid-range Audience</option>
                  <option value="Established/Large">Established/Large Channels</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Speaker Avatar URL</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Paste an avatar, self graphic, or photo link..."
                  value={guestForm.avatarUrl || ''}
                  onChange={(e) => setGuestForm({ ...guestForm, avatarUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] mb-1">Header Background Image URL</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Paste cover background image URL..."
                  value={guestForm.headerBgUrl || ''}
                  onChange={(e) => setGuestForm({ ...guestForm, headerBgUrl: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">My Topics of Expertise (Select as many as apply)</label>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 max-h-96 overflow-y-auto space-y-4">
                  {CATEGORIZED_TOPICS.map(cat => (
                    <div key={cat.category} className="space-y-1.5 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                        {cat.category}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.topics.map(topic => {
                          const active = (guestForm.topics || []).includes(topic);
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => setGuestForm({
                                ...guestForm,
                                topics: toggleArrayItem(guestForm.topics || [], topic)
                              })}
                              style={getTopicButtonStyles(topic, active)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors border shadow-2xs ${
                                active ? 'font-bold border-transparent' : ''
                              }`}
                            >
                              {topic}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Interactive Formats Open To</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {['Interview', 'Panel/Roundtable', 'Solo/Co-host'].map(f => {
                    const selected = (guestForm.preferredFormats || []).includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setGuestForm({
                          ...guestForm,
                          preferredFormats: toggleArrayItem(guestForm.preferredFormats || [], f)
                        })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          selected 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Dialect Speak Languages</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {AVAILABLE_LANGUAGES.map(lang => {
                    const active = (guestForm.languages || []).includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setGuestForm({
                          ...guestForm,
                          languages: toggleArrayItem(guestForm.languages || [], lang)
                        })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          active 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Additional Filter Hashtags (Comma Separated)</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. AI, PublicSpeaking, TechEthics"
                  value={guestForm.tags?.join(', ')}
                  onChange={(e) => setGuestForm({ ...guestForm, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-150">
              <span className="text-[11px] text-slate-500 font-medium italic">
                {isJoinedGuest ? '✓ Profile matches live speaker list updates in directory.' : 'Register and save to place profile onto live index.'}
              </span>
              <button
                type="button"
                onClick={handleSaveGuestProfile}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isJoinedGuest ? 'Update Guest Profile' : 'Save & Join as Guest Speaker'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="p-1 px-2.2 text-xs bg-sky-500/10 text-sky-700 rounded font-bold font-mono">1</span>
                Podcast Host Directory Info
              </h3>
              {isJoinedHost ? (
                <button
                  onClick={handleRemoveHostProfile}
                  className="text-red-500 hover:text-red-700 hover:underline text-xs font-semibold"
                >
                  Withdraw show from Host Directory
                </button>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium italic">Host profile not currently active in lists.</span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Show Name (Title CPT)</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Science Frontiers Podcast"
                  value={hostForm.showName}
                  onChange={(e) => setHostForm({ ...hostForm, showName: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Booking Email (Secure)</label>
                <input
                  type="email"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. producers@creatorhub.com"
                  value={hostForm.hostEmail}
                  onChange={(e) => setHostForm({ ...hostForm, hostEmail: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Podcast Description & Audience Details</label>
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Tell potential candidates what your show centers about and your specific broadcast expectations..."
                  value={hostForm.description}
                  onChange={(e) => setHostForm({ ...hostForm, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Show Primary Subject</label>
                <select
                  value={hostForm.industry}
                  onChange={(e) => setHostForm({ ...hostForm, industry: e.target.value })}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                >
                  {AVAILABLE_INDUSTRIES.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Expected Speaker Experience Level</label>
                <div className="flex gap-4 mt-2">
                  {['Beginner', 'Intermediate', 'Expert'].map(level => (
                    <label key={level} className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold cursor-pointer select-none">
                      <input
                        type="radio"
                        name="joinHostExp"
                        checked={hostForm.requiredExperienceLevel === level}
                        onChange={() => setHostForm({ ...hostForm, requiredExperienceLevel: level as any })}
                        className="accent-sky-500"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Recording Base Location</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Chicago, IL, USA"
                  value={hostForm.location}
                  onChange={(e) => setHostForm({ ...hostForm, location: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Recording Accommodations</label>
                <select
                  value={hostForm.remoteOptions}
                  onChange={(e) => setHostForm({ ...hostForm, remoteOptions: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                >
                  <option value="Remote Only">Remote Only</option>
                  <option value="In-Person Only">In-Person Only</option>
                  <option value="Hybrid">Hybrid accommodations</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Broadcast Demographics Size</label>
                <select
                  value={hostForm.audienceSize}
                  onChange={(e) => setHostForm({ ...hostForm, audienceSize: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                >
                  <option value="Niche/Micro">Niche/Micro Segment</option>
                  <option value="Emerging/Mid">Emerging/Mid Segment</option>
                  <option value="Established/Large">Established/Large Media</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Podcast logo / Graphic URI</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Paste a show logo image URL..."
                  value={hostForm.logoUrl || ''}
                  onChange={(e) => setHostForm({ ...hostForm, logoUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] mb-1">Header Background Image URL</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Paste show cover background image URL..."
                  value={hostForm.headerBgUrl || ''}
                  onChange={(e) => setHostForm({ ...hostForm, headerBgUrl: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Speaker Prerequisites note</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Must have dynamic portfolio or work in science sector."
                  value={hostForm.guestRequirements}
                  onChange={(e) => setHostForm({ ...hostForm, guestRequirements: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">Show Segment Topic Covers</label>
                <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 max-h-96 overflow-y-auto space-y-4">
                  {CATEGORIZED_TOPICS.map(cat => (
                    <div key={cat.category} className="space-y-1.5 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                      <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                        {cat.category}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.topics.map(topic => {
                          const active = (hostForm.showTopics || []).includes(topic);
                          return (
                            <button
                              key={topic}
                              type="button"
                              onClick={() => setHostForm({
                                ...hostForm,
                                showTopics: toggleArrayItem(hostForm.showTopics || [], topic)
                              })}
                              style={getTopicButtonStyles(topic, active)}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors border shadow-2xs ${
                                active ? 'font-bold border-transparent' : ''
                              }`}
                            >
                              {topic}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Interview Format Structure</label>
                <select
                  value={hostForm.format}
                  onChange={(e) => setHostForm({ ...hostForm, format: e.target.value as any })}
                  className="w-full bg-white border border-slate-200 text-xs px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                >
                  <option value="Interview">One-on-One Interview</option>
                  <option value="Panel/Roundtable">Panel & Roundtable Discussion</option>
                  <option value="Solo/Co-host">Solo/Co-host spot</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Main Broadcast Dialects</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {AVAILABLE_LANGUAGES.map(lang => {
                    const active = (hostForm.languages || []).includes(lang);
                    return (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setHostForm({
                          ...hostForm,
                          languages: toggleArrayItem(hostForm.languages || [], lang)
                        })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          active 
                            ? 'bg-slate-900 text-white' 
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Show Tags (Comma Separated)</label>
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Technology, Innovators, Science"
                  value={hostForm.tags?.join(', ')}
                  onChange={(e) => setHostForm({ ...hostForm, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-150">
              <span className="text-[11px] text-slate-500 font-medium italic">
                {isJoinedHost ? '✓ Show profile matches live show list updates in directory.' : 'Register and save to place podcast show onto live index.'}
              </span>
              <button
                type="button"
                onClick={handleSaveHostProfile}
                className="bg-sky-500 hover:bg-sky-600 text-slate-950 px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
              >
                <Save className="w-4 h-4" />
                {isJoinedHost ? 'Update Host Show' : 'Save & Join as Show Host'}
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
