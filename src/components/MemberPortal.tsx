import React, { useState, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { initAuth, googleSignIn, getAccessToken } from '../lib/firebase';
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
  Network,
  ArrowLeft,
  ListChecks,
  MessageSquare,
  UploadIcon,
  Info,
  Calendar,
  Heart,
  Star,
  Award,
  Zap,
  Flame,
  ThumbsUp,
  Activity,
  Radio
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
  setActiveWorkspaceTab: (tab: 'home' | 'studio' | 'database' | 'code' | 'portal' | 'aimatch') => void;
}


const FieldLabel = ({ label, tooltip, colorClass = "text-slate-400" }: { label: string, tooltip?: string, colorClass?: string }) => (
  <label className={`flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest mb-1 group relative w-max ${colorClass}`}>
    <span>{label}</span>
    {tooltip && (
      <>
        <Info className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity cursor-pointer" />
        <div className="absolute left-0 bottom-full mb-2 w-56 bg-slate-800 text-slate-200 text-xs p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 font-normal normal-case tracking-normal shadow-xl border border-slate-700 pointer-events-none">
          {tooltip}
          <div className="absolute left-6 top-full w-2.5 h-2.5 bg-slate-800 transform rotate-45 -mt-[5px] border-r border-b border-slate-700"></div>
        </div>
      </>
    )}
  </label>
);

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
  setActiveWorkspaceTab,
}) => {
  // We'll manage state for user's guest and host setup.
  // We'll tie them to a specific persistent ID: 'my_guest_profile' and 'my_host_profile'
  const [needsAuth, setNeedsAuth] = useState(false);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, t) => {
        setGoogleUser(user);
        if (t) {
          setGoogleToken(t);
        }
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleGoogleConnect = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleToken(result.accessToken);
        setGoogleUser(result.user);
        triggerNotification('Google Calendar connected!');
      }
    } catch (err) {
      console.error('Login failed:', err);
      triggerNotification('Failed to connect Google Calendar');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const MY_GUEST_ID = 'user_joined_guest';
  const MY_HOST_ID = 'user_joined_host';

  const existingMyGuest = guests.find(g => g.id === MY_GUEST_ID);
  const existingMyHost = hosts.find(h => h.id === MY_HOST_ID);

  // Joining states
  const [isJoinedGuest, setIsJoinedGuest] = useState(!!existingMyGuest);
  const [isJoinedHost, setIsJoinedHost] = useState(!!existingMyHost);

  // Active sub-tab in portal: guest form or host form or connections
  const [portalSubTab, setPortalSubTab] = useState<'dashboard' | 'guest' | 'host' | 'connections'>('dashboard');
  const [showBadgeInfoModal, setShowBadgeInfoModal] = useState(false);


  // Success indicator message state
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Demo Connections State
  const [connections, setConnections] = useState([
    {
      id: 'req_1',
      fromName: 'Tech Today Media',
      fromType: 'Host',
      status: 'Pending',
      date: 'Today',
      message: 'Loved your profile! We are looking for an expert on your topics for our next episode block. Let us connect!',
      workflowState: 0,
      messages: [] as { sender: 'me' | 'them', text: string, date: string }[],
      availabilityText: 'Thursdays from 1pm - 5pm EST',
      bookedTime: null as string | null,
      recordingUrl: null as string | null,
      recordingConfirmedByMe: false,
      recordingConfirmedByThem: false,
      reviewTitle: null as string | null,
      reviewText: null as string | null,
      reviewRating: null as number | null
    },
    {
      id: 'req_2',
      fromName: 'Sarah Jenkins',
      fromType: 'Guest',
      status: 'Accepted',
      date: 'Yesterday',
      message: 'I would love to be a guest on your podcast. My audience aligns perfectly with your show demographics.',
      workflowState: 2,
      messages: [
        { sender: 'them', text: 'I would love to be a guest on your podcast. My audience aligns perfectly with your show demographics.', date: 'Yesterday' },
        { sender: 'me', text: 'Sounds great! I just accepted.', date: 'Today' }
      ],
      availabilityText: 'Tuesdays and Wednesdays before 12pm PST',
      bookedTime: null as string | null,
      recordingConfirmedByMe: false,
      recordingConfirmedByThem: false,
      reviewTitle: null as string | null,
      reviewText: null as string | null,
      reviewRating: null as number | null
    }
  ]);

  const [expandedConnectionId, setExpandedConnectionId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [recordingLinkInput, setRecordingLinkInput] = useState('');
  const [reviewTitleInput, setReviewTitleInput] = useState('');
  const [reviewInput, setReviewInput] = useState('');
  const [reviewRatingInput, setReviewRatingInput] = useState(5.0);

  const WORKFLOW_STEPS = [
    {
      title: 'Connection Accepted',
      description: 'Both parties have agreed to connect.',
      action: 'Say hello in the chat and express your excitement to collaborate! Once introductions are made, advance to the setup phase.'
    },
    {
      title: 'Pre-Interview Setup',
      description: 'Exchange essential details to ensure a high-quality episode.',
      action: 'Share your Media Kit, one-sheet, or suggested interview questions in the chat. Validate audio/video tech requirements.'
    },
    {
      title: 'Interview Scheduled',
      description: 'Lock in a date and time and share the recording link.',
      action: 'Schedule the interview below. Once scheduled, optionally share the recording or meeting link.'
    },
    {
      title: 'Recording Completed',
      description: 'Confirm that the interview has concluded successfully.',
      action: 'Once the interview is over, confirm you finished recording. Waiting for the other party to confirm as well.'
    },
    {
      title: 'Review & Complete',
      description: 'Leave a review for your collaboration partner.',
      action: 'Share a testimonial or review to complete this collaboration.'
    }
  ];

  const handleConnectionAction = (id: string, action: 'Accepted' | 'Declined') => {
    setConnections(prev => prev.map(c => {
      if (c.id === id) {
        let newMessages = [...c.messages];
        if (action === 'Accepted') {
          newMessages = [
            { sender: 'them', text: c.message, date: c.date },
            { sender: 'me', text: 'Connection request accepted.', date: 'Just now' }
          ];
        }
        return { ...c, status: action, messages: newMessages };
      }
      return c;
    }));
    triggerNotification(`Connection request ${action.toLowerCase()}.`);
    if(action === 'Accepted') {
      setExpandedConnectionId(id);
    }
  };

  const advanceWorkflow = (id: string) => {
    setConnections(prev => prev.map(c => 
      c.id === id && c.workflowState < WORKFLOW_STEPS.length - 1 
        ? { ...c, workflowState: c.workflowState + 1 } 
        : c
    ));
    triggerNotification('Booking workflow advanced!');
  };

  const sendMessage = (id: string) => {
    if(!newMessage.trim()) return;
    setConnections(prev => prev.map(c => 
      c.id === id 
        ? { ...c, messages: [...c.messages, { sender: 'me', text: newMessage.trim(), date: 'Just now' }] } 
        : c
    ));
    setNewMessage('');
    triggerNotification('Message sent!');
  };

  const bookInterview = async (activeConn: any) => {
    if(!bookingDate || !bookingTime) {
      triggerNotification('Please select a date and time.');
      return;
    }
    const bookedString = `${bookingDate} at ${bookingTime}`;
    // Construct datetime
    let eventCreated = false;

    if (googleToken && window.confirm('Would you like to add this interview to your Google Calendar?')) {
      try {
        const startDateTime = new Date(`${bookingDate} ${bookingTime}`);
        const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour later
        
        const event = {
          summary: `Podcast Interview: ${activeConn.fromName}`,
          description: `Interview scheduled via PodSyndi.\nWith: ${activeConn.fromName}`,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        };

        const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${googleToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event)
        });

        if (res.ok) {
          triggerNotification('Added to Google Calendar!');
          eventCreated = true;
        } else {
          console.error("Failed to add to calendar", await res.json());
          triggerNotification('Failed to add to Google Calendar.');
        }
      } catch (err) {
        console.error(err);
        triggerNotification('Error connecting to Google Calendar.');
      }
    }

    setConnections(prev => prev.map(c => 
      c.id === activeConn.id 
        ? { ...c, bookedTime: bookedString, messages: [...c.messages, { sender: 'me', text: `I have scheduled our interview for ${bookedString}. Looking forward to it!`, date: 'Just now' }] } 
        : c
    ));
    setBookingDate('');
    setBookingTime('');
    if (!eventCreated) {
      triggerNotification('Interview successfully booked!');
    }
  };

  const saveRecordingLink = (id: string) => {
    if(!recordingLinkInput.trim()) {
      triggerNotification('Please enter a recording link.');
      return;
    }
    setConnections(prev => prev.map(c => 
      c.id === id 
        ? { ...c, recordingUrl: recordingLinkInput, messages: [...c.messages, { sender: 'me', text: `Here is the meeting/recording link: ${recordingLinkInput}`, date: 'Just now' }] } 
        : c
    ));
    setRecordingLinkInput('');
    advanceWorkflow(id);
    triggerNotification('Recording link saved!');
  };

  const confirmRecording = (activeConn: any) => {
    setConnections(prev => prev.map(c => 
      c.id === activeConn.id 
        ? { ...c, recordingConfirmedByMe: true, messages: [...c.messages, { sender: 'me', text: `I have confirmed that the recording is complete.`, date: 'Just now' }] } 
        : c
    ));
    triggerNotification('Recording confirmed! Waiting for the other party...');
    
    // Simulate other party confirming
    setTimeout(() => {
      setConnections(prev => prev.map(c => 
        c.id === activeConn.id 
          ? { ...c, recordingConfirmedByThem: true, workflowState: c.workflowState + 1, messages: [...c.messages, { sender: 'them', text: `Recording confirmed on my end too!`, date: 'Just now' }] } 
          : c
      ));
      triggerNotification('Recording mutually confirmed!');
    }, 3000);
  };

  const submitReview = (id: string) => {
    if(!reviewInput.trim() || !reviewTitleInput.trim()) {
       triggerNotification('Please enter a review title and text.');
       return;
    }

    const conn = connections.find(c => c.id === id);

    setConnections(prev => prev.map(c => 
      c.id === id 
        ? { ...c, reviewTitle: reviewTitleInput, reviewText: reviewInput, reviewRating: reviewRatingInput, messages: [...c.messages, { sender: 'me', text: `Review submitted: ${reviewRatingInput} stars`, date: 'Just now' }] } 
        : c
    ));

    if (conn) {
      const isReviewingHost = conn.fromType === 'Host';
      const myName = isReviewingHost ? (existingMyGuest?.displayName || guestForm.displayName || 'You') : (existingMyHost?.showName || hostForm.showName || 'You');
      const myPhoto = isReviewingHost ? (existingMyGuest?.avatarUrl || guestForm.avatarUrl || '') : (existingMyHost?.logoUrl || hostForm.logoUrl || '');
      const myType = isReviewingHost ? 'Guest' : 'Host';

      const newReview = {
        id: `rev_${Date.now()}`,
        authorName: myName,
        authorType: myType as 'Guest'|'Host',
        authorPhoto: myPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        rating: reviewRatingInput,
        title: reviewTitleInput,
        text: reviewInput,
        date: 'Just now'
      };

      if (isReviewingHost) {
        // Find host by name and update
        const hostIndex = hosts.findIndex(h => h.showName === conn.fromName);
        if (hostIndex !== -1) {
          const updatedHosts = [...hosts];
          const host = updatedHosts[hostIndex];
          updatedHosts[hostIndex] = {
            ...host,
            reviews: host.reviews ? [...host.reviews, newReview] : [newReview],
            reviewRating: host.reviews 
              ? ((host.reviewRating || 0) * host.reviews.length + newReview.rating) / (host.reviews.length + 1)
              : newReview.rating
          };
          onUpdateHosts(updatedHosts);
        }
      } else {
        const guestIndex = guests.findIndex(g => g.displayName === conn.fromName);
        if (guestIndex !== -1) {
          const updatedGuests = [...guests];
          const guest = updatedGuests[guestIndex];
          updatedGuests[guestIndex] = {
            ...guest,
            reviews: guest.reviews ? [...guest.reviews, newReview] : [newReview],
            reviewRating: guest.reviews
              ? ((guest.reviewRating || 0) * guest.reviews.length + newReview.rating) / (guest.reviews.length + 1)
              : newReview.rating
          };
          onUpdateGuests(updatedGuests);
        }
      }
    }

    setReviewTitleInput('');
    setReviewInput('');
    setReviewRatingInput(5.0);
    advanceWorkflow(id);
    triggerNotification('Review submitted successfully!');
  };


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
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200 overflow-x-auto">
          <button
            onClick={() => setPortalSubTab('dashboard')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              portalSubTab === 'dashboard'
                ? 'bg-white text-indigo-950 shadow-xs ring-1 ring-black/5 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            My Dashboard
          </button>
          
          <button
            onClick={() => setPortalSubTab('guest')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
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
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              portalSubTab === 'host'
                ? 'bg-white text-indigo-950 shadow-xs ring-1 ring-black/5 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-sky-500" />
            My Podcast Host Property
          </button>

          <button
            onClick={() => setPortalSubTab('connections')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
              portalSubTab === 'connections'
                ? 'bg-white text-indigo-950 shadow-xs ring-1 ring-black/5 font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-emerald-500" />
            My Network Connections
            {connections.filter(c => c.status === 'Pending').length > 0 && (
              <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full px-1.5 py-0.5 ml-1">
                {connections.filter(c => c.status === 'Pending').length}
              </span>
            )}
          </button>
        </div>

        {/* Quick Simulation Trigger Buttons */}
        <div className="flex gap-2 shrink-0">
          {portalSubTab === 'guest' ? (
            <button
              onClick={startTestingAsGuest}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-amber-400"
            >
              <Eye className="w-3.5 h-3.5" />
              Simulate Matching As Me (Guest)
            </button>
          ) : portalSubTab === 'host' ? (
            <button
              onClick={startTestingAsHost}
              className="bg-sky-500 hover:bg-sky-600 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer transition-all border border-sky-400"
            >
              <Eye className="w-3.5 h-3.5" />
              Simulate Matching As Me (Host)
            </button>
          ) : null}
        </div>
      </div>

      {/* PORTAL EDIT MATRIX FORMS */}
      <div className="flex-1 p-6 md:p-8">
        {portalSubTab === 'dashboard' ? (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <h3 className="font-display font-black text-2xl text-slate-800 flex items-center gap-2 mb-8 border-b border-slate-100 pb-4">
              <Zap className="w-6 h-6 text-amber-500 fill-current" />
              Gamification Dashboard
            </h3>

            {/* Overall Progress Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Profile Card Summary */}
              <div className="bg-white border text-center border-slate-200 rounded-2xl shadow-3xs p-6 flex flex-col items-center justify-between">
                <div className="w-24 h-24 bg-gradient-to-tr from-amber-400 to-amber-200 rounded-full flex items-center justify-center shadow-lg relative mb-4">
                  <Star className="w-10 h-10 text-white fill-current" />
                  <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white font-mono font-black text-xs px-2 py-0.5 rounded shadow">
                    Lvl 2
                  </div>
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Your Profile Rank</h4>
                <p className="text-slate-500 text-sm mt-1">Consistency pays off. Complete your profile & connections to rank up.</p>
                <div className="w-full mt-4 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-[#D4AF37] h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <div className="w-full flex justify-between text-[11px] font-bold text-slate-400 uppercase mt-2">
                  <span>120 PTS</span>
                  <span>NEXT: 250 PTS</span>
                </div>
              </div>

              {/* Badges Collection */}
              <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl shadow-3xs p-6 flex flex-col items-start justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <Star className="w-48 h-48" />
                </div>
                <h4 className="font-extrabold text-amber-900 text-md uppercase tracking-wider mb-2">My Unlocked Badges</h4>
                <div className="flex flex-wrap gap-2.5 z-10 w-full mb-4">
                  <div className="flex items-center gap-2 bg-white border border-amber-200 text-amber-800 rounded-xl px-3 py-2 shadow-sm font-bold text-xs"><Sparkles className="w-4 h-4 text-amber-500 fill-current" /> New Talent</div>
                  <div className="flex items-center gap-2 bg-slate-100/50 border border-slate-200 border-dashed text-slate-400 rounded-xl px-3 py-2 font-bold text-xs"><Heart className="w-4 h-4 text-slate-300" /> Community Fav (Locked)</div>
                  <div className="flex items-center gap-2 bg-slate-100/50 border border-slate-200 border-dashed text-slate-400 rounded-xl px-3 py-2 font-bold text-xs"><Award className="w-4 h-4 text-slate-300" /> Top Rated (Locked)</div>
                </div>
                <button onClick={() => setShowBadgeInfoModal(true)} className="text-xs font-bold text-amber-600 bg-amber-100 hover:bg-amber-200 px-4 py-2 rounded-lg transition-colors w-full z-10 cursor-pointer">
                  View Badge Requirements
                </button>
              </div>

            </div>

            {/* Action Checklist */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-3xs overflow-hidden mt-6">
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-widest text-xs">Suggested Actions to Earn More</h4>
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded">Action-based rewards</span>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                      <UserCheck className="w-4 h-4 stroke-2" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Complete Profile 100%</p>
                      <p className="text-xs text-slate-500">Add an avatar, bio, and all contact details.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-600 font-mono">+50 pts</span>
                    <button onClick={()=>setPortalSubTab('guest')} className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">Go</button>
                  </div>
                </div>

                <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 stroke-2" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Leave a Review</p>
                      <p className="text-xs text-slate-500">Provide feedback after your first connection.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-600 font-mono">+100 pts</span>
                    <button onClick={()=>setPortalSubTab('connections')} className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">Go</button>
                  </div>
                </div>

                <div className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                      <Radio className="w-4 h-4 stroke-2" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">Complete Interview</p>
                      <p className="text-xs text-slate-500">Confirm an episode was successfully recorded.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-emerald-600 font-mono">+250 pts</span>
                    <button onClick={()=>setPortalSubTab('connections')} className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded-md hover:bg-slate-800 transition-colors">Go</button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : portalSubTab === 'connections' ? (
          <div className="space-y-6 h-full flex flex-col">
            {!expandedConnectionId ? (
              <>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                   <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                     <span className="p-1 px-2.2 text-xs bg-emerald-500/10 text-emerald-700 rounded font-bold font-mono">{connections.length}</span>
                     Network Connection Requests
                   </h3>
                   {googleToken ? (
                     <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
                       <Calendar className="w-3.5 h-3.5" />
                       Calendar Connected
                     </div>
                   ) : (
                     <button
                       disabled={isLoggingIn}
                       onClick={handleGoogleConnect}
                       className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                     >
                       <Calendar className="w-3.5 h-3.5" />
                       Connect Google Calendar
                     </button>
                   )}
                 </div>
     
                 {connections.length === 0 ? (
                   <div className="text-center py-12 text-slate-500 text-sm font-medium">
                     No connection requests yet. Update your profiles to get matched!
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {connections.map((conn) => (
                       <div key={conn.id} className="bg-white border text-sm border-slate-200 rounded-xl p-4 shadow-sm flex flex-col gap-3 group relative hover:border-emerald-200 transition-colors">
                         <div className="flex justify-between items-start">
                           <div>
                             <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 block mb-1">
                               From: {conn.fromType}
                             </span>
                             <h4 className="font-bold text-slate-900">{conn.fromName}</h4>
                             <span className="text-xs text-slate-500">{conn.date}</span>
                             {(conn.bookedTime || conn.recordingUrl) && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                  {conn.bookedTime && (
                                    <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 font-bold max-w-full">
                                      <Calendar className="w-3 h-3 shrink-0" /> <span className="truncate">{conn.bookedTime}</span>
                                    </div>
                                  )}
                                  {conn.recordingUrl && (
                                    <a href={conn.recordingUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[10px] text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors px-1.5 py-0.5 rounded border border-indigo-100 font-bold max-w-full z-10 relative">
                                      <UploadIcon className="w-3 h-3 shrink-0" /> <span className="truncate">Recording Link</span>
                                    </a>
                                  )}
                                </div>
                              )}
                           </div>
                           <div>
                             <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                               conn.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 
                               conn.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 
                               'bg-red-100 text-red-800'
                             }`}>
                               {conn.status}
                             </span>
                           </div>
                         </div>
                         
                         <div className="bg-slate-50 p-3 rounded-lg text-slate-600 text-xs italic border border-slate-100">
                           "{conn.message}"
                         </div>
                         
                         {conn.status === 'Pending' && (
                           <div className="flex gap-2 pt-2 border-t border-slate-100">
                             <button 
                               onClick={() => handleConnectionAction(conn.id, 'Accepted')}
                               className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                             >
                               <Check className="w-3.5 h-3.5" /> Accept Connection
                             </button>
                             <button 
                               onClick={() => handleConnectionAction(conn.id, 'Declined')}
                               className="flex-1 bg-white hover:bg-red-50 text-slate-500 hover:text-red-600 border border-slate-200 hover:border-red-200 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer"
                             >
                               Decline
                             </button>
                           </div>
                         )}
                         
                         {conn.status === 'Accepted' && (
                           <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                             {conn.bookedTime && (
                               <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-md border border-emerald-100 font-medium">
                                 <Calendar className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{conn.bookedTime}</span>
                               </div>
                             )}
                             {conn.recordingUrl && (
                               <a href={conn.recordingUrl} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center gap-2 text-xs text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors px-2.5 py-1.5 rounded-md border border-indigo-100 font-medium truncate">
                                 <UploadIcon className="w-3.5 h-3.5 shrink-0" /> <span className="truncate">{conn.recordingUrl}</span>
                               </a>
                             )}
                             <button 
                               onClick={() => setExpandedConnectionId(conn.id)}
                               className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 py-1.5 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                             >
                               <MessageSquare className="w-3.5 h-3.5" /> Open Booking Workspace
                             </button>
                           </div>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
              </>
            ) : (() => {
              const activeConn = connections.find(c => c.id === expandedConnectionId);
              if(!activeConn) return null;
              return (
                <div className="flex flex-col h-full gap-4 relative animate-fade-in pb-12 w-full max-w-full">
                  <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-4">
                       <button onClick={() => setExpandedConnectionId(null)} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 transition-colors cursor-pointer shrink-0">
                         <ArrowLeft className="w-4 h-4" />
                       </button>
                       <div>
                         <h2 className="text-xl font-display font-black text-slate-900 leading-none mb-1">{activeConn.fromName}</h2>
                         <span className="text-[10px] uppercase tracking-widest text-emerald-600 font-bold font-mono">Connection Active Workspace</span>
                       </div>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-500 mb-1">Collaborating to produce a great episode together!</p>
                      <button 
                         onClick={() => setExpandedConnectionId(null)}
                         className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                      >
                         &larr; Back to Network
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 items-start">
                     {/* Left: Workflow Timeline */}
                     <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-amber-500/5 blur-3xl rounded-full" />
                       <div className="relative z-10">
                         <h3 className="font-bold text-sm text-slate-800 font-mono uppercase tracking-widest flex items-center gap-2 mb-2">
                           <ListChecks className="w-4 h-4 text-amber-500" /> Booking Workflow
                         </h3>
                         <p className="text-xs text-slate-500 mb-8 max-w-sm">
                           Follow these steps to schedule, record, and publish your feature. Your connection sees this same progress.
                         </p>

                         <div className="pl-4 space-y-6 relative before:absolute before:inset-y-0 before:left-[35px] before:w-0.5 before:bg-slate-200 py-2">
                            {WORKFLOW_STEPS.map((step, idx) => {
                              const isCompleted = idx < activeConn.workflowState;
                              const isActive = idx === activeConn.workflowState;

                              return (
                                <div key={idx} className={`relative flex gap-6 ${isCompleted ? 'opacity-60' : isActive ? 'opacity-100' : 'opacity-40'}`}>
                                  <div className={`w-10 h-10 rounded-full flex flex-col items-center justify-center shrink-0 border-2 relative z-10 bg-white transition-all duration-300 ${
                                    isCompleted ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]' :
                                    isActive ? 'border-amber-500 ring-4 ring-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.3)]' :
                                    'border-slate-300'
                                  }`}>
                                    {isCompleted ? (
                                      <Check className="w-5 h-5 text-emerald-500" />
                                    ) : (
                                      <span className={`font-mono text-sm font-bold ${isActive ? 'text-amber-600' : 'text-slate-400'}`}>{idx + 1}</span>
                                    )}
                                  </div>
                                  <div className={`flex-1 pt-2 pb-4 ${idx !== WORKFLOW_STEPS.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <h4 className={`text-base font-bold font-display tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{step.title}</h4>
                                    
                                    {isActive && (
                                      <div className="mt-3 bg-amber-50 border border-amber-200/60 p-4 rounded-xl flex flex-col items-start gap-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-50"><Info className="w-16 h-16 text-amber-500 blur-xl" /></div>
                                        <div className="relative z-10 text-left w-full space-y-3">
                                            <div>
                                              <p className="text-xs text-amber-900 font-bold mb-1">To Do: {step.description}</p>
                                              <p className="text-[11px] text-amber-800/80 leading-relaxed max-w-sm">{step.action}</p>
                                            </div>
                                            {idx === 2 && (
                                              <div className="bg-white border border-slate-200 rounded-xl p-4 mt-2 mb-2 w-full">
                                                {activeConn.bookedTime ? (
                                                  <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-2">
                                                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Interview Booked For</span>
                                                      <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 font-bold px-3 py-2 rounded-lg border border-emerald-100 text-sm">
                                                        <Calendar className="w-4 h-4" /> {activeConn.bookedTime}
                                                      </div>
                                                    </div>
                                                    <hr className="border-slate-100" />
                                                    {activeConn.recordingUrl ? (
                                                      <div className="flex flex-col gap-2">
                                                        <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest">Recording Link</span>
                                                        <a href={activeConn.recordingUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-2 rounded-lg border border-indigo-100 text-sm transition-colors cursor-pointer break-all">
                                                          <UploadIcon className="w-4 h-4 shrink-0" /> {activeConn.recordingUrl}
                                                        </a>
                                                      </div>
                                                    ) : (
                                                      <div className="flex flex-col gap-3">
                                                        <span className="text-xs font-bold text-slate-700">Add Recording Link</span>
                                                        <p className="text-[10px] text-slate-500">
                                                          Share the raw recording or episode link to complete this step.
                                                        </p>
                                                        <div className="flex gap-2">
                                                          <input 
                                                            type="url" 
                                                            placeholder="https://..."
                                                            value={recordingLinkInput}
                                                            onChange={(e) => setRecordingLinkInput(e.target.value)}
                                                            className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 flex-1 min-w-0"
                                                          />
                                                          <button 
                                                            onClick={() => saveRecordingLink(activeConn.id)}
                                                            className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 text-xs rounded-lg transition-all shadow-sm shrink-0 cursor-pointer"
                                                          >
                                                            Save
                                                          </button>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                ) : (
                                                  <div className="flex flex-col gap-3">
                                                    <span className="text-xs font-bold text-slate-700">Schedule Interview</span>
                                                    <p className="text-[10px] text-slate-500">
                                                      Based on availability: <strong className="text-indigo-600">{activeConn.availabilityText}</strong>
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-2">
                                                      <input 
                                                        type="date" 
                                                        value={bookingDate}
                                                        onChange={(e) => setBookingDate(e.target.value)}
                                                        className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 w-full"
                                                      />
                                                      <select 
                                                        className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 w-full"
                                                        value={bookingTime}
                                                        onChange={(e) => setBookingTime(e.target.value)}
                                                      >
                                                        <option value="">Time</option>
                                                        <option value="9:00 AM">9:00 AM</option>
                                                        <option value="10:00 AM">10:00 AM</option>
                                                        <option value="1:00 PM">1:00 PM</option>
                                                        <option value="3:30 PM">3:30 PM</option>
                                                      </select>
                                                    </div>
                                                    <button 
                                                      onClick={() => bookInterview(activeConn)}
                                                      className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 text-xs rounded-lg transition-all shadow-sm w-full cursor-pointer"
                                                    >
                                                      <Calendar className="w-3.5 h-3.5" /> Confirm & Book Interview
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                            )}
                                            {idx === 3 && (
                                              <div className="bg-white border border-slate-200 rounded-xl p-4 mt-2 mb-2 w-full">
                                                <div className="flex flex-col gap-3">
                                                  {activeConn.recordingConfirmedByMe ? (
                                                    <div className="flex flex-col gap-2">
                                                      <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 text-xs font-bold px-3 py-2 rounded-lg border border-emerald-100">
                                                        <Check className="w-4 h-4" /> You confirmed recording is complete.
                                                      </div>
                                                      {activeConn.recordingConfirmedByThem ? (
                                                        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 text-xs font-bold px-3 py-2 rounded-lg border border-emerald-100">
                                                          <Check className="w-4 h-4" /> Partner confirmed recording is complete.
                                                        </div>
                                                      ) : (
                                                        <div className="flex items-center gap-2 text-amber-700 bg-amber-50 text-xs font-bold px-3 py-2 rounded-lg border border-amber-100">
                                                          <span className="animate-pulse">⏳</span> Waiting for partner to confirm...
                                                        </div>
                                                      )}
                                                    </div>
                                                  ) : (
                                                    <>
                                                      <span className="text-xs font-bold text-slate-700">Confirm Recording</span>
                                                      <p className="text-[10px] text-slate-500">
                                                        Click below once the interview is over and you have secured the recording.
                                                      </p>
                                                      <button 
                                                        onClick={() => confirmRecording(activeConn)}
                                                        className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 text-xs rounded-lg transition-all shadow-sm w-full cursor-pointer"
                                                      >
                                                        <Check className="w-3.5 h-3.5" /> Confirm Recording Completed
                                                      </button>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                            {idx === 4 && (() => {
                                              const reviewerName = activeConn.fromType === 'Host' 
                                                ? (existingMyGuest?.displayName || guestForm.displayName || 'You') 
                                                : (existingMyHost?.showName || hostForm.showName || 'You');

                                              const reviewerPhoto = activeConn.fromType === 'Host'
                                                ? (existingMyGuest?.avatarUrl || guestForm.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face')
                                                : (existingMyHost?.showCoverUrl || hostForm.showCoverUrl || 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=150&h=150&fit=crop');

                                              return (
                                              <div className="bg-white border border-slate-200 rounded-xl p-4 mt-2 mb-2 w-full">
                                                {activeConn.reviewText ? (
                                                  <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                                                    <div className="flex items-center justify-between">
                                                      <div className="flex items-center gap-2">
                                                        <img src={reviewerPhoto} alt={reviewerName} className="w-6 h-6 rounded-full object-cover border border-slate-200 shadow-sm" />
                                                        <a 
                                                          href="#" 
                                                          onClick={(e) => {
                                                            e.preventDefault();
                                                            const reviewerType = activeConn.fromType === 'Host' ? 'guest' : 'host';
                                                            const reviewerProfileId = reviewerType === 'guest' ? 'my_guest_profile' : 'my_host_profile';
                                                            onSelectPreview(reviewerType, reviewerProfileId);
                                                            setActiveWorkspaceTab('studio');
                                                          }}
                                                          className="font-bold text-emerald-600 hover:text-emerald-700 underline decoration-emerald-200 underline-offset-2"
                                                        >
                                                          {reviewerName}
                                                        </a>
                                                      </div>
                                                      {activeConn.reviewRating !== undefined && activeConn.reviewRating !== null && (
                                                        <div className="flex text-amber-500 text-xs">
                                                          {'★'.repeat(Math.floor(activeConn.reviewRating))}
                                                          {activeConn.reviewRating % 1 !== 0 ? '½' : ''}
                                                          <span className="text-slate-400 ml-1">({activeConn.reviewRating})</span>
                                                        </div>
                                                      )}
                                                    </div>
                                                    {activeConn.reviewTitle && (
                                                      <h5 className="text-sm font-bold text-slate-900 leading-snug">{activeConn.reviewTitle}</h5>
                                                    )}
                                                    <p className="text-xs text-slate-700 italic">"{activeConn.reviewText}"</p>
                                                  </div>
                                                ) : (
                                                  <div className="flex flex-col gap-3">
                                                    <span className="text-xs font-bold text-slate-700">Leave a Review</span>
                                                    <p className="text-[10px] text-slate-500">
                                                      Share your experience working with {activeConn.fromName}.
                                                    </p>
                                                    
                                                    <div className="flex flex-col gap-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                                      <div className="flex justify-between items-center">
                                                        <span className="text-xs font-bold text-slate-700">Rating</span>
                                                        <span className="font-mono text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded">{reviewRatingInput.toFixed(2)} Stars</span>
                                                      </div>
                                                      <input 
                                                        type="range"
                                                        min="0" max="5" step="0.25"
                                                        value={reviewRatingInput}
                                                        onChange={(e) => setReviewRatingInput(parseFloat(e.target.value))}
                                                        className="w-full accent-amber-500 mt-1"
                                                      />
                                                      <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-bold">
                                                        <span>0</span>
                                                        <span>2.5</span>
                                                        <span>5.0</span>
                                                      </div>
                                                    </div>

                                                    <input
                                                      type="text"
                                                      value={reviewTitleInput}
                                                      onChange={(e) => setReviewTitleInput(e.target.value)}
                                                      placeholder="Review Title (e.g., Amazing interview!)"
                                                      className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 w-full mb-1"
                                                    />

                                                    <textarea 
                                                      value={reviewInput}
                                                      onChange={(e) => setReviewInput(e.target.value)}
                                                      placeholder="They were a fantastic guest..."
                                                      className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 w-full min-h-[60px] resize-none"
                                                    />
                                                    <button 
                                                      onClick={() => submitReview(activeConn.id)}
                                                      className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-2 text-xs rounded-lg transition-all shadow-sm w-full cursor-pointer"
                                                    >
                                                      <Check className="w-3.5 h-3.5" /> Submit Review
                                                    </button>
                                                  </div>
                                                )}
                                              </div>
                                              );
                                            })()}
                                        </div>
                                        {idx < 2 && (
                                          <button 
                                            onClick={() => advanceWorkflow(activeConn.id)} 
                                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 text-xs rounded-lg transition-transform active:scale-95 cursor-pointer shadow-sm relative z-10 flex items-center gap-2"
                                          >
                                            Mark Stage Complete <Check className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                         </div>
                       </div>
                     </div>

                     {/* Right: Messaging Widget */}
                     <div className="bg-slate-50 border border-slate-200 rounded-2xl shadow-inner flex flex-col h-[550px] overflow-hidden lg:sticky lg:top-4">
                        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm relative z-10 w-full overflow-hidden">
                          <div>
                            <h3 className="font-bold text-xs text-slate-800 font-mono uppercase tracking-widest flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-indigo-500" /> Collaborative Chat
                            </h3>
                            <p className="text-[10px] text-slate-500 mt-0.5">Share links, assets, and scheduling info</p>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                          {activeConn.messages.map((msg, i) => (
                            <div key={i} className={`flex flex-col w-full ${msg.sender === 'me' ? 'items-end text-right' : 'items-start text-left'}`}>
                              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1 px-1">
                                {msg.sender === 'me' ? 'You' : activeConn.fromName}
                              </span>
                              <div className={`text-xs px-4 py-2.5 rounded-2xl break-words break-all max-w-[85%] shadow-sm ${
                                msg.sender === 'me' 
                                  ? 'bg-indigo-600 text-white rounded-tr-sm' 
                                  : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm'
                              }`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-slate-400 mt-1 px-1 opacity-70">{msg.date}</span>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 bg-white border-t border-slate-200 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] w-full overflow-hidden">
                          <div className="flex gap-2 relative bg-slate-100 rounded-full border border-slate-200 p-1">
                            <input
                              type="text"
                              placeholder="Message..."
                              value={newMessage}
                              onChange={e => setNewMessage(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    sendMessage(activeConn.id);
                                }
                              }}
                              className="flex-1 bg-transparent px-4 py-2 text-xs font-medium focus:outline-none text-slate-700 min-w-0"
                            />
                            <button
                              onClick={() => sendMessage(activeConn.id)}
                              disabled={!newMessage.trim()}
                              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-slate-400 text-white rounded-full p-2 h-9 w-9 flex items-center justify-center shrink-0 transition-colors cursor-pointer shadow-sm"
                            >
                              <UploadIcon className="w-4 h-4 rotate-90 ml-1" />
                            </button>
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : portalSubTab === 'guest' ? (
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
                <FieldLabel label="Speaker Display Name" tooltip="The name that will be visible to Hosts when they view your profile." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Cynthia Rogers"
                  value={guestForm.displayName}
                  onChange={(e) => setGuestForm({ ...guestForm, displayName: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel label="Contact Email (Private)" tooltip="Your email address for notifications and direct contact. This is kept private until you accept a connection." />
                <input
                  type="email"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. cynthia@rogers.com"
                  value={guestForm.emailContact}
                  onChange={(e) => setGuestForm({ ...guestForm, emailContact: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Speaker Bio Excerpt" tooltip="A short, engaging introduction about who you are and what value you bring to a podcast." />
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Briefly pitch your speaking experience, background and credentials for podcasts hosts to find you..."
                  value={guestForm.bio}
                  onChange={(e) => setGuestForm({ ...guestForm, bio: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel label="Your Primary Industry Accent" tooltip="The main industry category you specialize in." />
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
                <FieldLabel label="Experience Level Options" tooltip="Your level of experience as a podcast speaker." />
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
                <FieldLabel label="Physical Location Base" tooltip="Your city or country, useful for local matching or timezone coordination." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. New York, USA"
                  value={guestForm.location}
                  onChange={(e) => setGuestForm({ ...guestForm, location: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel label="Recording Modality" tooltip="How you prefer to record (e.g., Remote, In-Person, Hybrid)." />
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
                <FieldLabel label="Preferred Audience Size" tooltip="The type of show demographics you are looking to reach." />
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
                <FieldLabel label="Speaker Avatar URL" tooltip="Link to a professional headshot or profile picture (must be a valid image URL)." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Paste an avatar, self graphic, or photo link..."
                  value={guestForm.avatarUrl || ''}
                  onChange={(e) => setGuestForm({ ...guestForm, avatarUrl: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel label="Header Background Image URL" tooltip="Link to a wide banner image that displays at the top of your profile." colorClass="text-[#D4AF37]" />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Paste cover background image URL..."
                  value={guestForm.headerBgUrl || ''}
                  onChange={(e) => setGuestForm({ ...guestForm, headerBgUrl: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="My Topics of Expertise (Select as many as apply)" tooltip="Select all topics you confidently speak about. Used for AI matching." />
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
                <FieldLabel label="Interactive Formats Open To" tooltip="What types of podcast formats you enjoy participating in." />
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
                <FieldLabel label="Dialect Speak Languages" tooltip="Languages you are fluent in and can use for a podcast recording." />
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
                <FieldLabel label="Additional Filter Hashtags (Comma Separated)" tooltip="Custom keywords or tags to help hosts find you in search." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. AI, PublicSpeaking, TechEthics"
                  value={guestForm.tags?.join(', ')}
                  onChange={(e) => setGuestForm({ ...guestForm, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="My General Availability" tooltip="Your typical weekly availability for recording sessions (e.g., 'Tuesdays & Thursdays, 1 PM - 4 PM EST')." />
                <textarea
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden min-h-[60px]"
                  placeholder="e.g. Tuesdays & Thursdays after 2pm EST, or share a Calendly link..."
                  value={guestForm.availability || ''}
                  onChange={(e) => setGuestForm({ ...guestForm, availability: e.target.value })}
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
                <FieldLabel label="Show Name (Title CPT)" tooltip="The official name of your podcast." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Science Frontiers Podcast"
                  value={hostForm.showName}
                  onChange={(e) => setHostForm({ ...hostForm, showName: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel label="Booking Email (Secure)" tooltip="Where you receive booking responses and notifications." />
                <input
                  type="email"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. producers@creatorhub.com"
                  value={hostForm.hostEmail}
                  onChange={(e) => setHostForm({ ...hostForm, hostEmail: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Podcast Description & Audience Details" tooltip="A description of what your podcast is about and who listens to it." />
                <textarea
                  rows={3}
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Tell potential candidates what your show centers about and your specific broadcast expectations..."
                  value={hostForm.description}
                  onChange={(e) => setHostForm({ ...hostForm, description: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel label="Show Primary Subject" tooltip="The main overarching topic of your podcast." />
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
                <FieldLabel label="Expected Speaker Experience Level" tooltip="The level of experience you require from your guests." />
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
                <FieldLabel label="Recording Base Location" tooltip="Where your podcast is based out of (city/country/timezone)." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Chicago, IL, USA"
                  value={hostForm.location}
                  onChange={(e) => setHostForm({ ...hostForm, location: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel label="Recording Accommodations" tooltip="How you usually record your episodes (e.g., Remote via WebRTC, In-Person Studio)." />
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
                <FieldLabel label="Broadcast Demographics Size" tooltip="The approximate size of your audience/listenership." />
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
                <FieldLabel label="Podcast logo / Graphic URI" tooltip="Link to your podcast's square cover art/logo image." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Paste a show logo image URL..."
                  value={hostForm.logoUrl || ''}
                  onChange={(e) => setHostForm({ ...hostForm, logoUrl: e.target.value })}
                />
              </div>

              <div>
                <FieldLabel label="Header Background Image URL" tooltip="Link to a wide banner image that displays at the top of your profile." colorClass="text-[#D4AF37]" />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="Paste show cover background image URL..."
                  value={hostForm.headerBgUrl || ''}
                  onChange={(e) => setHostForm({ ...hostForm, headerBgUrl: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Speaker Prerequisites note" tooltip="Any specific requirements (e.g., must have professional mic, must pre-listen to an episode)." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Must have dynamic portfolio or work in science sector."
                  value={hostForm.guestRequirements}
                  onChange={(e) => setHostForm({ ...hostForm, guestRequirements: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Show Segment Topic Covers" tooltip="Topics you actively want guests to discuss on your show." />
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
                <FieldLabel label="Interview Format Structure" tooltip="The format style of your podcast." />
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
                <FieldLabel label="Main Broadcast Dialects" tooltip="The language(s) spoken on your podcast." />
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
                <FieldLabel label="Show Tags (Comma Separated)" tooltip="Custom tags for your show to assist matching." />
                <input
                  type="text"
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden"
                  placeholder="e.g. Technology, Innovators, Science"
                  value={hostForm.tags?.join(', ')}
                  onChange={(e) => setHostForm({ ...hostForm, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                />
              </div>

              <div className="md:col-span-2">
                <FieldLabel label="Show Booking Availability" tooltip="Your typical weekly time slots dedicated to recording podcast episodes." />
                <textarea
                  className="w-full bg-white border border-slate-200 text-sm px-3.5 py-2 rounded-xl focus:ring-1 focus:ring-amber-500 outline-hidden min-h-[60px]"
                  placeholder="e.g. We record on Mondays 9am-12pm PST. Or drop a Calendly link..."
                  value={hostForm.availability || ''}
                  onChange={(e) => setHostForm({ ...hostForm, availability: e.target.value })}
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

      {/* Badges Info Modal */}
      {showBadgeInfoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-display text-xl font-black uppercase tracking-wider flex items-center gap-2 text-slate-800">
                <Award className="w-6 h-6 text-amber-500" />
                Badge Requirements
              </h2>
              <button 
                onClick={() => setShowBadgeInfoModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors border border-slate-200 shadow-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'new_talent', icon: Sparkles, iconColor: 'text-purple-500', name: 'New Talent', description: 'Complete your profile and make your first connection.', condition: 'Profile 100% + 1 Connection' },
                  { id: 'rising_star', icon: Flame, iconColor: 'text-orange-500', name: 'Rising Star', description: 'Be highly rated in your first 3 completed episodes.', condition: '3 Reviews · 4.5+ Avg' },
                  { id: 'top_rated', icon: Star, iconColor: 'text-amber-500', name: 'Top Rated', description: 'Maintain a 4.8+ rating over 10 or more episodes.', condition: '10+ Reviews · 4.8+ Avg' },
                  { id: 'community_fav', icon: Heart, iconColor: 'text-pink-500', name: 'Community Favorite', description: 'Receive 5+ glowing textual reviews praising your specific topics from other creators.', condition: '5+ Written Reviews' },
                  { id: 'highly_rec', icon: ThumbsUp, iconColor: 'text-blue-500', name: 'Highly Recommended', description: 'Voted highly likely to refer by 5 different connection partners.', condition: '5+ Referrals' },
                  { id: 'consistent', icon: Activity, iconColor: 'text-emerald-500', name: 'Consistent Contributor', description: 'Participated in at least one episode a month for 6 consecutive months.', condition: '6 Months Activity' }
                ].map(badge => (
                  <div key={badge.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm space-y-3">
                    <div className="flex items-center gap-2">
                      <badge.icon className={`w-5 h-5 ${badge.iconColor} fill-current flex-shrink-0`} />
                      <h3 className="font-bold text-slate-800">{badge.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{badge.description}</p>
                    <div className="inline-block bg-slate-100 px-2 py-1 rounded text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                      Requires: {badge.condition}
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
