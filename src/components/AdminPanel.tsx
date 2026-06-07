import React, { useState } from 'react';
import { GuestProfile, HostProfile, MatchWeights } from '../types';
import { 
  AVAILABLE_TOPICS, 
  AVAILABLE_INDUSTRIES, 
  AVAILABLE_LANGUAGES,
  CATEGORIZED_TOPICS,
  getTopicButtonStyles
} from '../data';
import { 
  Plus, 
  Trash2, 
  User, 
  Sliders, 
  Wrench, 
  AlertTriangle, 
  Check, 
  Sparkles, 
  Eye, 
  Database,
  Tag, 
  Edit3,
  Bookmark
} from 'lucide-react';

interface AdminPanelProps {
  guests: GuestProfile[];
  hosts: HostProfile[];
  weights: MatchWeights;
  onUpdateGuests: (updated: GuestProfile[]) => void;
  onUpdateHosts: (updated: HostProfile[]) => void;
  onUpdateWeights: (updated: MatchWeights) => void;
  onSelectPreview: (type: 'guest' | 'host', id: string) => void;
  selectedPreviewId: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  guests,
  hosts,
  weights,
  onUpdateGuests,
  onUpdateHosts,
  onUpdateWeights,
  onSelectPreview,
  selectedPreviewId,
}) => {
  const [activeTab, setActiveTab] = useState<'guests' | 'hosts' | 'weights'>('guests');
  
  // Weights validation
  const sumWeights = 
    (weights.reviews || 0) +
    weights.topics + 
    weights.industry + 
    weights.experience + 
    weights.format + 
    weights.audience + 
    weights.location + 
    weights.language;
  
  const isWeightValid = Math.abs(sumWeights - 1.0) < 0.005;

  // Form states for creating Guest
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [newGuest, setNewGuest] = useState<Partial<GuestProfile>>({
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
    tags: []
  });

  // Form states for creating Host
  const [showAddHost, setShowAddHost] = useState(false);
  const [newHost, setNewHost] = useState<Partial<HostProfile>>({
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
    tags: []
  });

  // Helper: auto normalize weights
  const handleAutoNormalize = () => {
    const rawSum = sumWeights === 0 ? 1 : sumWeights;
    const normalized: MatchWeights = {
      reviews: Math.round(((weights.reviews || 0) / rawSum) * 100) / 100,
      topics: Math.round((weights.topics / rawSum) * 100) / 100,
      industry: Math.round((weights.industry / rawSum) * 100) / 100,
      experience: Math.round((weights.experience / rawSum) * 100) / 100,
      format: Math.round((weights.format / rawSum) * 100) / 100,
      audience: Math.round((weights.audience / rawSum) * 100) / 100,
      location: Math.round((weights.location / rawSum) * 100) / 100,
      language: Math.round((weights.language / rawSum) * 100) / 100,
    };

    const checkSum = Object.values(normalized).reduce((a, b) => a + b, 0);
    const diff = 1.0 - checkSum;
    if (Math.abs(diff) > 0.001) {
      normalized.topics = Math.round((normalized.topics + diff) * 100) / 100;
    }

    onUpdateWeights(normalized);
  };

  const handleWeightChange = (key: keyof MatchWeights, value: number) => {
    onUpdateWeights({
      ...weights,
      [key]: Math.round(value * 100) / 100
    });
  };

  // Add guest item
  const handleAddGuest = () => {
    if (!newGuest.displayName) return;
    const id = 'guest_' + Date.now();
    const guestToAdd: GuestProfile = {
      id,
      displayName: newGuest.displayName || 'Unnamed Guest',
      bio: newGuest.bio || '',
      topics: newGuest.topics || [],
      industry: newGuest.industry || 'Technology',
      experienceLevel: newGuest.experienceLevel || 'Intermediate',
      location: newGuest.location || 'Remote',
      remotePreference: newGuest.remotePreference || 'Hybrid',
      languages: newGuest.languages || ['English'],
      audiencePreference: newGuest.audiencePreference || 'Emerging/Mid',
      preferredFormats: newGuest.preferredFormats || ['Interview'],
      tags: newGuest.tags || [],
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 999999)}?w=150&h=150&fit=crop&crop=face`
    };
    onUpdateGuests([...guests, guestToAdd]);
    setShowAddGuest(false);
    onSelectPreview('guest', id);
    setNewGuest({
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
      tags: []
    });
  };

  // Add Host Profile
  const handleAddHost = () => {
    if (!newHost.showName) return;
    const id = 'host_' + Date.now();
    const hostToAdd: HostProfile = {
      id,
      showName: newHost.showName || 'Unnamed Podcast',
      description: newHost.description || '',
      showTopics: newHost.showTopics || [],
      industry: newHost.industry || 'Technology',
      format: newHost.format || 'Interview',
      audienceSize: newHost.audienceSize || 'Emerging/Mid',
      location: newHost.location || 'Remote',
      remoteOptions: newHost.remoteOptions || 'Hybrid',
      languages: newHost.languages || ['English'],
      guestRequirements: newHost.guestRequirements || '',
      requiredExperienceLevel: newHost.requiredExperienceLevel || 'Intermediate',
      tags: newHost.tags || [],
      logoUrl: `https://images.unsplash.com/photo-${1550000000000 + Math.floor(Math.random() * 999999)}?w=150&h=150&fit=crop`
    };
    onUpdateHosts([...hosts, hostToAdd]);
    setShowAddHost(false);
    onSelectPreview('host', id);
    setNewHost({
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
      tags: []
    });
  };

  const deleteGuest = (id: string) => {
    onUpdateGuests(guests.filter(g => g.id !== id));
  };

  const deleteHost = (id: string) => {
    onUpdateHosts(hosts.filter(h => h.id !== id));
  };

  const toggleArrayItem = <T,>(arr: T[], item: T): T[] => {
    if (arr.includes(item)) {
      return arr.filter(i => i !== item);
    }
    return [...arr, item];
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs flex flex-col min-h-[680px]">
      
      {/* WordPress-Style Header Tabs */}
      <div className="bg-slate-50 px-6 py-4.5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-500" />
          <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
            WordPress Database (CPT & ACF Emulator)
          </h2>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
          <button
            onClick={() => setActiveTab('guests')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'guests'
                ? 'bg-white text-amber-800 shadow-xs ring-1 ring-black/5 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Guests (psc_guest)
          </button>
          <button
            onClick={() => setActiveTab('hosts')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'hosts'
                ? 'bg-white text-amber-800 shadow-xs ring-1 ring-black/5 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Hosts (psc_host)
          </button>
          <button
            onClick={() => setActiveTab('weights')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'weights'
                ? 'bg-white text-amber-800 shadow-xs ring-1 ring-black/5 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Matching Weights
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 p-6 md:p-8">
        
        {/* ================= GUEST CPT TAB ================= */}
        {activeTab === 'guests' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Core Postmeta Management</span>
                <p className="text-slate-500 text-xs mt-0.5 max-w-xl">
                  Inspect programmatically loaded custom fields inside <code className="font-mono bg-slate-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">psc_guest</code> post types.
                </p>
              </div>
              <button
                onClick={() => setShowAddGuest(!showAddGuest)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Guest
              </button>
            </div>

            {/* EXPANDABLE ADD GUEST FORM */}
            {showAddGuest && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  WordPress ACF Field Binding Matrix — New Guest
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Display Name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="e.g. Dr. Jonathan Aris"
                      value={newGuest.displayName}
                      onChange={(e) => setNewGuest({ ...newGuest, displayName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Geographic Location</label>
                    <input
                      type="text"
                      value={newGuest.location}
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="e.g. London, UK"
                      onChange={(e) => setNewGuest({ ...newGuest, location: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Speaker Description (ACF Textarea)</label>
                    <textarea
                      rows={2}
                      value={newGuest.bio}
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="Brief overview of professional speaker experience..."
                      onChange={(e) => setNewGuest({ ...newGuest, bio: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Industry Sector</label>
                    <select
                      value={newGuest.industry}
                      onChange={(e) => setNewGuest({ ...newGuest, industry: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                    >
                      {AVAILABLE_INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Experience Level Option</label>
                    <div className="flex gap-4 mt-2">
                      {['Beginner', 'Intermediate', 'Expert'].map(level => (
                        <label key={level} className="flex items-center gap-1.5 text-xs text-slate-600 font-medium select-none">
                          <input
                            type="radio"
                            name="guestExp"
                            checked={newGuest.experienceLevel === level}
                            onChange={() => setNewGuest({ ...newGuest, experienceLevel: level as any })}
                            className="accent-amber-500"
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Remote Preference</label>
                    <select
                      value={newGuest.remotePreference}
                      onChange={(e) => setNewGuest({ ...newGuest, remotePreference: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                    >
                      <option value="Remote Only">Remote Only</option>
                      <option value="In-Person Only">In-Person Only</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Target Show Size Preference</label>
                    <select
                      value={newGuest.audiencePreference}
                      onChange={(e) => setNewGuest({ ...newGuest, audiencePreference: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                    >
                      <option value="Niche/Micro">Niche/Micro</option>
                      <option value="Emerging/Mid">Emerging/Mid</option>
                      <option value="Established/Large">Established/Large</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Speaking Expertise Topics</label>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-80 overflow-y-auto space-y-3.5">
                      {CATEGORIZED_TOPICS.map(cat => (
                        <div key={cat.category} className="space-y-1 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full inline-block shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                            {cat.category}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {cat.topics.map(topic => {
                              const active = (newGuest.topics || []).includes(topic);
                              return (
                                <button
                                  key={topic}
                                  type="button"
                                  onClick={() => setNewGuest({
                                    ...newGuest,
                                    topics: toggleArrayItem(newGuest.topics || [], topic)
                                  })}
                                  style={getTopicButtonStyles(topic, active)}
                                  className={`px-2 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors border shadow-2xs ${
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
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Formats Open To</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['Interview', 'Panel/Roundtable', 'Solo/Co-host'].map(f => {
                        const selected = (newGuest.preferredFormats || []).includes(f);
                        return (
                          <button
                            key={f}
                            type="button"
                            onClick={() => setNewGuest({
                              ...newGuest,
                              preferredFormats: toggleArrayItem(newGuest.preferredFormats || [], f)
                            })}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
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
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Dialect/Languages</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {AVAILABLE_LANGUAGES.map(lang => {
                        const active = (newGuest.languages || []).includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setNewGuest({
                              ...newGuest,
                              languages: toggleArrayItem(newGuest.languages || [], lang)
                            })}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
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
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Metadata Hash Tags (Comma separated values)</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="e.g. ML, Leadership, TechPsychology"
                      onChange={(e) => setNewGuest({ ...newGuest, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddGuest(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-transparent rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddGuest}
                    className="px-4 py-2 text-xs bg-slate-900 text-white hover:bg-slate-800 font-extrabold rounded-xl cursor-pointer"
                  >
                    Register Guest Profile
                  </button>
                </div>
              </div>
            )}

            {/* GUEST POSTS DATATABLE */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    <th className="p-4">Title (Display Name)</th>
                    <th className="p-4">Industry Focus</th>
                    <th className="p-4">Experience Value</th>
                    <th className="p-4">Location Preference</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {guests.map((g) => {
                    const isSelected = selectedPreviewId === g.id;
                    return (
                      <tr 
                        key={g.id} 
                        className={`hover:bg-slate-50/50 transition-colors ${
                          isSelected ? 'bg-amber-50/40 font-medium' : ''
                        }`}
                      >
                        <td className="p-4 flex items-center gap-2.5">
                          <img 
                            src={g.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop'} 
                            alt="" 
                            className="w-8 h-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="text-slate-900 font-bold block">{g.displayName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {g.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200/50">
                            {g.industry}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">
                          {g.experienceLevel}
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-bold text-slate-800">{g.remotePreference}</div>
                            <div className="text-[10px] text-slate-400">{g.location}</div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onSelectPreview('guest', g.id)}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                isSelected 
                                  ? 'bg-amber-500 text-white' 
                                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                              }`}
                              title="Render in Canvas"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              disabled={guests.length <= 1}
                              onClick={() => deleteGuest(g.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer disabled:opacity-30"
                              title="Delete Resource CPT"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= HOST CPT TAB ================= */}
        {activeTab === 'hosts' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">Core Postmeta Management</span>
                <p className="text-slate-500 text-xs mt-0.5 max-w-xl">
                  Inspect programmatically loaded custom fields inside <code className="font-mono bg-slate-100 text-sky-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">psc_host</code> post types.
                </p>
              </div>
              <button
                onClick={() => setShowAddHost(!showAddHost)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                Add New Host
              </button>
            </div>

            {/* EXPANDABLE ADD HOST FORM */}
            {showAddHost && (
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-500" />
                  WordPress ACF Field Binding Matrix — New Host Show
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Show / Podcast Name</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="e.g. Science Frontiers Podcast"
                      value={newHost.showName}
                      onChange={(e) => setNewHost({ ...newHost, showName: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Recording Studio City</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="e.g. Seattle, WA, USA"
                      value={newHost.location}
                      onChange={(e) => setNewHost({ ...newHost, location: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Show Concept Details (ACF Textarea)</label>
                    <textarea
                      rows={2}
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="Tell guests about listener demographics, topics, or formatting..."
                      value={newHost.description}
                      onChange={(e) => setNewHost({ ...newHost, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Primary Show Category</label>
                    <select
                      value={newHost.industry}
                      onChange={(e) => setNewHost({ ...newHost, industry: e.target.value })}
                      className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                    >
                      {AVAILABLE_INDUSTRIES.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Broadcast Format Structure</label>
                    <select
                      value={newHost.format}
                      onChange={(e) => setNewHost({ ...newHost, format: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                    >
                      <option value="Interview">Solo Interview</option>
                      <option value="Panel/Roundtable">Panel/Roundtable</option>
                      <option value="Solo/Co-host">Solo/Co-host slot</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Guest Entry Options</label>
                    <select
                      value={newHost.remoteOptions}
                      onChange={(e) => setNewHost({ ...newHost, remoteOptions: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                    >
                      <option value="Remote Only">Remote Only</option>
                      <option value="In-Person Only">In-Person Only</option>
                      <option value="Hybrid">Hybrid options</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Demographics Class Tier</label>
                    <select
                      value={newHost.audienceSize}
                      onChange={(e) => setNewHost({ ...newHost, audienceSize: e.target.value as any })}
                      className="w-full bg-white border border-slate-200 text-sm px-3 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                    >
                      <option value="Niche/Micro">Niche/Micro</option>
                      <option value="Emerging/Mid">Emerging/Mid-tier</option>
                      <option value="Established/Large">Established/Large</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Experience Expectations</label>
                    <div className="flex gap-4 mt-2">
                      {['Beginner', 'Intermediate', 'Expert'].map(level => (
                        <label key={level} className="flex items-center gap-1.5 text-xs text-slate-700 font-medium tracking-wide">
                          <input
                            type="radio"
                            name="hostExp"
                            checked={newHost.requiredExperienceLevel === level}
                            onChange={() => setNewHost({ ...newHost, requiredExperienceLevel: level as any })}
                            className="accent-amber-500"
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Guest Specifications Note</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="e.g. Must have appeared in prior media slots."
                      value={newHost.guestRequirements}
                      onChange={(e) => setNewHost({ ...newHost, guestRequirements: e.target.value })}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1.5">Topics Sought for Interviews</label>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-80 overflow-y-auto space-y-3.5">
                      {CATEGORIZED_TOPICS.map(cat => (
                        <div key={cat.category} className="space-y-1 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full inline-block shrink-0 shadow-xs" style={{ backgroundColor: cat.color }} />
                            {cat.category}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {cat.topics.map(topic => {
                              const active = (newHost.showTopics || []).includes(topic);
                              return (
                                <button
                                  key={topic}
                                  type="button"
                                  onClick={() => setNewHost({
                                    ...newHost,
                                    showTopics: toggleArrayItem(newHost.showTopics || [], topic)
                                  })}
                                  style={getTopicButtonStyles(topic, active)}
                                  className={`px-2 py-0.5 rounded-md text-xs font-semibold cursor-pointer transition-colors border shadow-2xs ${
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
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Main Broadcast Dialect</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {AVAILABLE_LANGUAGES.map(lang => {
                        const active = (newHost.languages || []).includes(lang);
                        return (
                          <button
                            key={lang}
                            type="button"
                            onClick={() => setNewHost({
                              ...newHost,
                              languages: toggleArrayItem(newHost.languages || [], lang)
                            })}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
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
                    <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">Metadata Hash Tags</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                      placeholder="e.g. Podcast, TechFront, SpaceResearch"
                      value={newHost.tags?.join(', ')}
                      onChange={(e) => setNewHost({ ...newHost, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddHost(false)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-transparent rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddHost}
                    className="px-4 py-2 text-xs bg-slate-900 text-white hover:bg-slate-800 font-extrabold rounded-xl cursor-pointer"
                  >
                    Register Host Profile
                  </button>
                </div>
              </div>
            )}

            {/* HOSTS POSTS DATATABLE */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                    <th className="p-4">Title (Show Name)</th>
                    <th className="p-4">Industry Sector</th>
                    <th className="p-4">Interview Format</th>
                    <th className="p-4">Demographics</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  {hosts.map((h) => {
                    const isSelected = selectedPreviewId === h.id;
                    return (
                      <tr 
                        key={h.id} 
                        className={`hover:bg-slate-50/50 transition-colors ${
                          isSelected ? 'bg-amber-50/40 font-medium' : ''
                        }`}
                      >
                        <td className="p-4 flex items-center gap-2.5">
                          <img 
                            src={h.logoUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=50&h=50&fit=crop'} 
                            alt="" 
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <span className="text-slate-900 font-bold block">{h.showName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">ID: {h.id}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-600 font-bold border border-slate-200/50">
                            {h.industry}
                          </span>
                        </td>
                        <td className="p-4 font-semibold text-slate-700">
                          {h.format}
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-bold text-slate-800">{h.audienceSize}</div>
                            <div className="text-[10px] text-slate-400">{h.location}</div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onSelectPreview('host', h.id)}
                              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                                isSelected 
                                  ? 'bg-amber-500 text-white' 
                                  : 'text-slate-400 hover:text-amber-500 hover:bg-slate-50'
                              }`}
                              title="Render in Canvas"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              disabled={hosts.length <= 1}
                              onClick={() => deleteHost(h.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer disabled:opacity-30"
                              title="Delete Resource CPT"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= MATCH WEIGHTS OPTIONS TAB ================= */}
        {activeTab === 'weights' && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-400">
                    WordPress ACF Options Page Settings
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5 max-w-xl">
                    Configure the index dimensions and weight coefficients representing standard WP database global rows. Toggle properties to balance computation profiles.
                  </p>
                </div>

                <button
                  onClick={handleAutoNormalize}
                  className="bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Auto-Normalize to 1.00
                </button>
              </div>

              {/* Status Banner */}
              <div className={`p-4 rounded-xl border flex items-center gap-3 transition-colors ${
                isWeightValid 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-900 animate-pulse'
              }`}>
                {isWeightValid ? (
                  <div className="bg-emerald-500 text-white p-1 rounded-full">
                    <Check className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="bg-red-500 text-white p-1 rounded-full">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                )}
                <div className="flex-1 text-xs leading-relaxed">
                  <div className="font-extrabold">
                    Database Integration Matrix: <span className="font-mono text-sm">{sumWeights.toFixed(2)}</span> / 1.00
                  </div>
                  <div className="text-[11px] opacity-90">
                    {isWeightValid 
                      ? "Configuration coefficients meet mathematical boundaries. Calculation engine fully online." 
                      : "Action Required: Sum of weights must equal exactly 1.00. Click Auto-Normalize to recalculate coefficients."}
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Elements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
              {[
                { key: 'reviews', label: 'Past Rating (w_reviews)', desc: 'Weighted score based on past guest/host reviews.' },
                { key: 'topics', label: 'Topics Alignment (w_topics)', desc: 'Weighted score based on shared talk categories.' },
                { key: 'industry', label: 'Industry Alignment (w_industry)', desc: 'Weighted coefficient of matching sectors.' },
                { key: 'experience', label: 'Experience Match (w_experience)', desc: 'Comparison of speaker skill with show tier.' },
                { key: 'format', label: 'Format Compatibility (w_format)', desc: 'Acceptance of solo, panel, or co-host structures.' },
                { key: 'audience', label: 'Audience Preference (w_audience)', desc: 'Demographic size alignment.' },
                { key: 'location', label: 'Remote / Geography (w_location)', desc: 'Physical studio proximity vs remote preferences.' },
                { key: 'language', label: 'Languages Spoken (w_language)', desc: 'Common broadcast dialects.' },
              ].map((wt) => {
                const val = weights[wt.key as keyof MatchWeights];
                return (
                  <div key={wt.key} className="space-y-2 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block">{wt.label}</span>
                        <span className="text-[10px] text-slate-400 block mt-0.5 leading-normal">{wt.desc}</span>
                      </div>
                      <span className="font-mono text-xs bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 font-extrabold text-amber-700">
                        {val.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 select-none">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={val}
                        onChange={(e) => handleWeightChange(wt.key as keyof MatchWeights, parseFloat(e.target.value))}
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
