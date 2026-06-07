import React, { useState, useEffect } from 'react';
import { 
  Terminal, Lock, ShieldCheck, Download, MessageSquare, 
  FileText, GitBranch, Server, Database, Globe, Cpu, Send, 
  Users, Activity, Code
} from 'lucide-react';


const componentsData = [
  {
    id: 'psc_interactive_simulator',
    name: 'Full Page System (Interactive Simulator)',
    shortcode: '[psc_interactive_simulator]',
    desc: 'The full React-based interactive simulator loading the entire page system.',
    attributes: 'N/A',
    phpCode: "<?php\nadd_shortcode('psc_interactive_simulator', 'psc_render_interactive_simulator_shortcode');\nfunction psc_render_interactive_simulator_shortcode($atts) {\n  return '<div id=\"root\"></div>'; // React binds here\n}\n?>",
    cssCode: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');\n\n@theme {\n  --font-sans: \"Inter\", ui-sans-serif, system-ui, sans-serif;\n  --font-display: \"Montserrat\", \"Inter\", ui-sans-serif, system-ui, sans-serif;\n  --font-mono: \"JetBrains Mono\", ui-monospace, SFMono-Regular, monospace;\n}\n\n::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n\n::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n  border-radius: 4px;\n}\n\nbody {\n  font-family: var(--font-sans);\n  background-color: #f8fafc;\n}\n"
  },
  {
    id: 'psc_core_system',
    name: 'Core System & Styles',
    shortcode: 'GLOBAL',
    desc: 'Base tailwind configurations, typography variables, and Core WP Plugin.',
    attributes: 'System Level',
    phpCode: "<?php\n/* \n * Plugin Name: PodSyndiConnect Core\n * Description: Foundation plugin to load all dependencies. Generated thoroughly on Code Generator tab.\n */\n?>",
    cssCode: "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Montserrat:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');\n\n@theme {\n  --font-sans: \"Inter\", ui-sans-serif, system-ui, sans-serif;\n  --font-display: \"Montserrat\", \"Inter\", ui-sans-serif, system-ui, sans-serif;\n  --font-mono: \"JetBrains Mono\", ui-monospace, SFMono-Regular, monospace;\n}\n\n::-webkit-scrollbar {\n  width: 6px;\n  height: 6px;\n}\n\n::-webkit-scrollbar-track {\n  background: transparent;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n  border-radius: 4px;\n}\n\nbody {\n  font-family: var(--font-sans);\n  background-color: #f8fafc;\n}\n"
  },
  {
    id: 'psc_home_page',
    name: 'Landing Home Page',
    shortcode: '[psc_home_page]',
    desc: 'Main public facing landing screen and intro wrapper.',
    attributes: 'None',
    phpCode: "<?php\nadd_shortcode('psc_home_page', 'psc_render_home_page');\nfunction psc_render_home_page($atts) {\n  return '<div id=\"psc-app-home-page\"></div>';\n}\n?>",
    cssCode: "/* psc_home_page styles */\n#psc-app-home-page {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n}\n"
  },
  {
    id: 'psc_admin_panel',
    name: 'Admin Dashboard',
    shortcode: '[psc_admin_panel]',
    desc: 'Metrics overview and algorithm weighting admin view.',
    attributes: 'access="admin_only"',
    phpCode: "<?php\nadd_shortcode('psc_admin_panel', 'psc_render_admin_panel');\nfunction psc_render_admin_panel($atts) {\n  if (!current_user_can('manage_options')) return '';\n  return '<div id=\"psc-app-admin-panel\"></div>';\n}\n?>",
    cssCode: "/* psc_admin_panel styles */\n#psc-app-admin-panel {\n  padding: 2rem;\n  background: #ffffff;\n}\n"
  },
  {
    id: 'psc_match_score_badge_dynamic',
    name: 'Profile Match Badge',
    shortcode: '[psc_match_score_badge_dynamic]',
    desc: 'Dynamic compatibility shield embedded on host/guest profiles.',
    attributes: 'profile_id="auto"',
    phpCode: "<?php\nadd_shortcode('psc_match_score_badge_dynamic', 'psc_render_match_badge');\nfunction psc_render_match_badge($atts) {\n  return '<div id=\"psc-app-badge-widget\"></div>';\n}\n?>",
    cssCode: "/* psc_match_score_badge_dynamic */\n#psc-app-badge-widget {\n  display: inline-flex;\n}\n"
  },
  {
    id: 'psc_guest_profile',
    name: 'Guest Single Profile Default',
    shortcode: '[psc_guest_profile id="123"]',
    desc: 'Publicly readable guest directory profile, stats, and match badge integration.',
    attributes: 'id="{guest_id}"',
    phpCode: "<?php\nadd_shortcode('psc_guest_profile', 'psc_render_guest_profile');\nfunction psc_render_guest_profile($atts) {\n  $a = shortcode_atts(array('id' => get_the_ID()), $atts);\n  return '<div id=\"psc-app-guest-profile\" data-guest=\"' . esc_attr($a['id']) . '\"></div>';\n}\n?>",
    cssCode: "/* psc_guest_profile styles */\n#psc-app-guest-profile {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n"
  },
  {
    id: 'psc_host_profile',
    name: 'Host Single Profile Default',
    shortcode: '[psc_host_profile id="123"]',
    desc: 'Publicly readable host/show directory profile with booking integration.',
    attributes: 'id="{host_id}"',
    phpCode: "<?php\nadd_shortcode('psc_host_profile', 'psc_render_host_profile');\nfunction psc_render_host_profile($atts) {\n  $a = shortcode_atts(array('id' => get_the_ID()), $atts);\n  return '<div id=\"psc-app-host-profile\" data-host=\"' . esc_attr($a['id']) . '\"></div>';\n}\n?>",
    cssCode: "/* psc_host_profile styles */\n#psc-app-host-profile {\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: 2rem;\n}\n"
  },
  {
    id: 'psc_member_portal',
    name: 'Member Portal',
    shortcode: '[psc_member_portal tab="guest|host|dashboard"]',
    desc: 'Main dashboard, user onboarding, metrics.',
    attributes: 'tab="guest|host|dashboard"',
    phpCode: "<?php\nadd_shortcode('psc_member_portal', 'psc_render_member_portal');\nfunction psc_render_member_portal($atts) {\n  $a = shortcode_atts(array('tab' => 'dashboard'), $atts);\n  return '<div id=\"psc-app-member-portal\" data-tab=\"' . esc_attr($a['tab']) . '\"></div>';\n}\n?>",
    cssCode: "/* psc_member_portal styles */\n#psc-app-member-portal {\n  display: block;\n  width: 100%;\n}\n"
  },
  {
    id: 'psc_ai_match',
    name: 'AI Discovery Grid',
    shortcode: '[psc_ai_match limit="10" filter="topics"]',
    desc: 'AI Discovery logic grid component.',
    attributes: 'limit="10", filter="topics"',
    phpCode: "<?php\nadd_shortcode('psc_ai_match', 'psc_render_ai_match');\nfunction psc_render_ai_match($atts) {\n  $a = shortcode_atts(array('limit' => '10', 'filter' => ''), $atts);\n  return '<div id=\"psc-app-ai-match\" data-limit=\"' . esc_attr($a['limit']) . '\" data-filter=\"' . esc_attr($a['filter']) . '\"></div>';\n}\n?>",
    cssCode: "/* psc_ai_match styles */\n#psc-app-ai-match {\n  display: grid;\n  gap: 1.5rem;\n}\n"
  },
  {
    id: 'psc_live_studio',
    name: 'Live Studio',
    shortcode: '[psc_live_studio episode_id="XXX"]',
    desc: 'Message flow, link coordination, and reviews.',
    attributes: 'episode_id="XXX"',
    phpCode: "<?php\nadd_shortcode('psc_live_studio', 'psc_render_live_studio');\nfunction psc_render_live_studio($atts) {\n  $a = shortcode_atts(array('episode_id' => null), $atts);\n  if (!$a['episode_id']) return 'Error: missing episode ID';\n  return '<div id=\"psc-app-live-studio\" data-episode=\"' . esc_attr($a['episode_id']) . '\"></div>';\n}\n?>",
    cssCode: "/* psc_live_studio styles */\n#psc-app-live-studio {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n}\n"
  },
  {
    id: 'psc_hall_of_fame',
    name: 'Hall of Fame',
    shortcode: '[psc_hall_of_fame type="rising_star" count="5"]',
    desc: 'Gamification rankings and leaderboards.',
    attributes: 'type="rising_star", count="5"',
    phpCode: "<?php\nadd_shortcode('psc_hall_of_fame', 'psc_render_hall_of_fame');\nfunction psc_render_hall_of_fame($atts) {\n  $a = shortcode_atts(array('type' => 'rising_star', 'count' => '5'), $atts);\n  return '<div id=\"psc-app-hall-of-fame\" data-type=\"' . esc_attr($a['type']) . '\" data-count=\"' . esc_attr($a['count']) . '\"></div>';\n}\n?>",
    cssCode: "/* psc_hall_of_fame styles */\n#psc-app-hall-of-fame {\n  background: #f8fafc;\n  border-radius: 1rem;\n}\n"
  }
];

export const DevPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'manual' | 'comms'>('manual');
  
  // Mock dev comms board
  const [messages, setMessages] = useState([
    { id: 1, user: 'DevLead_Alex', time: '10:45 AM', text: 'Pushed the new gamification badges logic to staging. Please review.' },
    { id: 2, user: 'DB_Admin_Sarah', time: '11:12 AM', text: 'Noticed a slight delay in the aimatch queries, adding an index to guest_topics.' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '8080') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Developer PIN');
      setPin('');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), user: 'Current_Dev', time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), text: newMessage }
    ]);
    setNewMessage('');
  };

  
  const handleDownloadCode = (filename: string, content: string, type: 'css' | 'php') => {
    const mimeType = type === 'css' ? 'text/css' : 'application/x-httpd-php';
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [docUrl, setDocUrl] = useState<string>('');

  useEffect(() => {
    // Generate a robust HTML blob disguised as a stylized .doc compatible file
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Developer Manual - PodSyndiConnect</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #0f172a; font-size: 28pt; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 5px; }
          .subtitle { font-size: 12pt; color: #64748b; margin-bottom: 40px; }
          h2 { color: #3b82f6; font-size: 18pt; margin-top: 30px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; }
          h3 { color: #0f172a; font-size: 14pt; margin-top: 20px; }
          .section { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; vertical-align: top; }
          th { background-color: #f8fafc; font-weight: bold; color: #334155; }
          .highlight { background-color: #f1f5f9; padding: 15px; border-left: 4px solid #3b82f6; margin-top: 10px;}
          .code { font-family: 'Consolas', 'Courier New', monospace; background-color: #f1f5f9; padding: 2px 4px; border-radius: 4px; color: #d97706; font-size: 10pt; }
          ul, ol { margin-top: 5px; margin-bottom: 15px; padding-left: 20px; }
          li { margin-bottom: 5px; }
          .label { font-weight: bold; color: #0f172a; }
        </style>
      </head>
      <body>
        <h1>PodSyndiConnect - Complete Developer Manual</h1>
        <div class="subtitle">Generated: ${new Date().toLocaleDateString()} | System Version: 1.0.4-beta</div>
        
        <div class="section">
          <h2>1. System Usage & User Flow</h2>
          <p>The platform enables the discovery, matching, and connection between Podcast Hosts and prospective Guests. The user flow works as follows:</p>
          <ol>
            <li><strong>Landing & Discovery:</strong> Users land on the HomePage and choose whether to explore as a Guest or Host.</li>
            <li><strong>Onboarding (Member Portal):</strong> Users register via dedicated Gravity Forms (converted to custom post types) supplying robust topic data.</li>
            <li><strong>Profile Processing:</strong> Fields are mapped into ACF profiles.</li>
            <li><strong>AI Matching:</strong> The AiMatch algorithm scores overlap in topics and availability, providing percentage-based compatibility scores and ranking cards.</li>
            <li><strong>Live Studio:</strong> Once matched, users coordinate episodes and enter the LiveStudio interface to communicate via the message flow, set recording links, review guidelines, and earn gamification badges based on post-recording review prompts.</li>
          </ol>
        </div>

        <div class="section">
          <h2>2. Custom Post Types (CPTs)</h2>
          <table>
            <tr><th width="25%">CPT Slug</th><th width="45%">Description</th><th width="30%">Core Supports</th></tr>
            <tr><td><span class="code">psc_guests</span></td><td>Registered guest profiles</td><td>Title, Editor, Thumbnail</td></tr>
            <tr><td><span class="code">psc_hosts</span></td><td>Registered host profiles</td><td>Title, Editor, Thumbnail</td></tr>
            <tr><td><span class="code">psc_episodes</span></td><td>Completed/Scheduled podcast episodes</td><td>Title, Editor, Author</td></tr>
            <tr><td><span class="code">psc_reviews</span></td><td>Feedback and ratings from LiveStudio</td><td>Title, Editor, Custom Fields</td></tr>
            <tr><td><span class="code">psc_badges</span></td><td>System gamification badge templates</td><td>Title, Editor, Thumbnail</td></tr>
          </table>
        </div>

        <div class="section">
          <h2>3. Advanced Custom Fields (ACF) Groups & Fields</h2>
          
          <h3>Group: Guest Profile Details (Attached to psc_guests)</h3>
          <ul>
            <li><span class="label">guest_topics</span> (Checkbox): Selected expertise areas.</li>
            <li><span class="label">guest_availability</span> (Text/Time): Typical recording hours.</li>
            <li><span class="label">guest_experience</span> (Select): New, Intermediate, Expert.</li>
            <li><span class="label">guest_social_urls</span> (Repeater): Contains Platform Name (Text) and Link (URL).</li>
          </ul>
          
          <h3>Group: Host Profile Details (Attached to psc_hosts)</h3>
          <ul>
            <li><span class="label">host_audience_size</span> (Number): Verified monthly listener stat.</li>
            <li><span class="label">host_topics_sought</span> (Checkbox): Wanted guest topics.</li>
            <li><span class="label">host_podcast_url</span> (URL): Link to primary RSS/Spotify feed.</li>
            <li><span class="label">host_equipment_reqs</span> (Textarea): Hardware required from guests.</li>
          </ul>

          <h3>Group: Rating & Gamification Data (Attached to psc_reviews / Users)</h3>
          <ul>
            <li><span class="label">review_score</span> (Number: 1-5): Episode rating step 0.1.</li>
            <li><span class="label">review_target_user</span> (User ID): Who was reviewed.</li>
            <li><span class="label">review_type</span> (Select: guest/host): Type of review provided.</li>
            <li><span class="label">user_earned_badges</span> (Relationship): Linked to psc_badges to show on profiles.</li>
          </ul>
        </div>

        <div class="section">
          <h2>4. Shortcodes Reference</h2>
          <table>
            <tr><th width="25%">Shortcode</th><th width="35%">Purpose</th><th width="40%">Attributes</th></tr>
            <tr><td><span class="code">[psc_member_portal]</span></td><td>Renders the dashboard/onboarding UI</td><td><span class="code">tab="guest|host|dashboard"</span></td></tr>
            <tr><td><span class="code">[psc_ai_match]</span></td><td>Renders the AiMatch discovery grid</td><td><span class="code">limit="10" filter="topics"</span></td></tr>
            <tr><td><span class="code">[psc_live_studio]</span></td><td>Outputs message flow and link layout</td><td><span class="code">episode_id="123"</span></td></tr>
            <tr><td><span class="code">[psc_hall_of_fame]</span></td><td>Renders the gamification leaderboard</td><td><span class="code">type="rising_star" count="5"</span></td></tr>
          </table>
          <div class="highlight">
            <p><strong>Note:</strong> Ensure these are rendered on full-width templates as the Tailwind utilities rely heavily on container queries and flex layouts.</p>
          </div>
        </div>

        <div class="section">
          <h2>5. Gamification Logic & Badges</h2>
          <p>The gamification system is completely dynamic. When User A writes a review for User B, the core triggers an evaluation sequence against badge rules.</p>
          <ul>
            <li><strong>New Talent:</strong> Requires Profile completion 100% and 1 confirmed Connection.</li>
            <li><strong>Rising Star:</strong> Requires 3 completed session reviews displaying a 4.5+ average.</li>
            <li><strong>Top Rated:</strong> Requires 10+ reviews maintaining a 4.8+ average rating.</li>
            <li><strong>Community Favorite:</strong> Requires 5+ glowing text-based reviews from different creators.</li>
          </ul>
        </div>
      </body>
      </html>
    `;
    
    // Creating a blob with ms-word MIME type (this allows Word to open and render HTML natively)
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/msword'
    });
    const url = URL.createObjectURL(blob);
    setDocUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-slate-900 rounded-3xl animate-fade-in border border-slate-800">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 shadow-inner">
              <Lock className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-white text-center mb-2 font-mono">DEV_PANEL_AUTH</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Secure terminal access. Enter developer PIN.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="**** (Hint: try 8080)"
                className="w-full bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-center tracking-[1em] text-2xl py-4 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none placeholder:tracking-normal placeholder:text-sm placeholder:text-slate-600 transition-all font-bold"
                autoFocus
              />
              {error && <p className="text-red-400 text-xs text-center mt-3 font-bold">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Terminal className="w-5 h-5" />
              AUTHENTICATE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 rounded-3xl overflow-hidden animate-fade-in border border-slate-200">
      {/* Dev Header */}
      <div className="bg-slate-900 text-white p-4 px-6 shrink-0 flex flex-col md:flex-row md:items-center justify-between border-b-4 border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-800 text-emerald-400 flex items-center justify-center rounded-lg shadow-inner border border-slate-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-lg font-mono tracking-widest text-slate-100 flex items-center gap-2">
              DEV_OPS_CONSOLE <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-xs text-slate-400 font-mono">System Integrity: Nominal • Version: 1.0.4-beta</p>
          </div>
        </div>
        
        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 font-black text-xs font-mono rounded-md transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'manual' ? 'bg-slate-700 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
          >
            <GitBranch className="w-4 h-4" />
            DEV_MANUAL
          </button>
          <button
            onClick={() => setActiveTab('comms')}
            className={`px-4 py-2 font-black text-xs font-mono rounded-md transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'comms' ? 'bg-slate-700 text-emerald-400 shadow' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
          >
            <MessageSquare className="w-4 h-4" />
            TEAM_COMMS
          </button>
        </div>
      </div>

      {/* Dev Body */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-slate-100 p-6 font-sans">
        {activeTab === 'manual' && (
          <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-xs border border-slate-200 gap-4">
              <div>
                <h3 className="font-black text-2xl text-slate-800">Architecture & Operations Manual</h3>
                <p className="text-slate-500 text-sm mt-1">Comprehensive UI mapping, CPT details, ACF logic, and flow charts.</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <a
                  href={docUrl}
                  download="PodSyndiConnect_Dev_Manual.doc"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md text-sm shrink-0"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  Download Complete Doc (.DOC)
                </a>
              </div>
            </div>

            {/* User Flow & Lifecycle Pipeline graphic */}
            <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-200">
              <h4 className="font-extrabold text-slate-800 text-lg mb-8 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-500" /> 
                Entity Lifecycle & Usage Flow
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-sm font-medium text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div className="flex flex-col items-center text-center relative">
                  <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-3 font-bold shadow-sm z-10"><Users className="w-6 h-6 text-indigo-500"/></div>
                  <span className="font-bold text-slate-800 mb-1">1. Discovery</span>
                  <span className="text-xs text-slate-500 leading-tight">Land on HomePage.<br/>Choose profile path.</span>
                  <div className="hidden lg:block absolute top-7 right-0 w-1/2 h-0.5 bg-slate-300 -translate-y-1/2 -mr-6 z-0"></div>
                </div>
                
                <div className="flex flex-col items-center text-center relative">
                  <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-3 font-bold shadow-sm z-10"><FileText className="w-6 h-6 text-emerald-500"/></div>
                  <span className="font-bold text-slate-800 mb-1">2. Onboarding</span>
                  <span className="text-xs text-slate-500 leading-tight">Registers CPTs via<br/>Member Portal.</span>
                  <div className="hidden lg:block absolute top-7 left-0 w-1/2 h-0.5 bg-slate-300 -translate-y-1/2 -ml-6 z-0"></div>
                  <div className="hidden lg:block absolute top-7 right-0 w-1/2 h-0.5 bg-slate-300 -translate-y-1/2 -mr-6 z-0"></div>
                </div>

                <div className="flex flex-col items-center text-center relative">
                  <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-3 font-bold shadow-sm z-10"><Database className="w-6 h-6 text-amber-500"/></div>
                  <span className="font-bold text-slate-800 mb-1">3. Processing</span>
                  <span className="text-xs text-slate-500 leading-tight">Map fields into<br/>ACF profiles.</span>
                  <div className="hidden lg:block absolute top-7 left-0 w-1/2 h-0.5 bg-slate-300 -translate-y-1/2 -ml-6 z-0"></div>
                  <div className="hidden lg:block absolute top-7 right-0 w-1/2 h-0.5 bg-slate-300 -translate-y-1/2 -mr-6 z-0"></div>
                </div>
                
                <div className="flex flex-col items-center text-center relative">
                  <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-3 font-bold shadow-sm z-10"><Cpu className="w-6 h-6 text-fuchsia-500"/></div>
                  <span className="font-bold text-slate-800 mb-1">4. AI Match Engine</span>
                  <span className="text-xs text-slate-500 leading-tight">Queries DB limits.<br/>Outputs fit scores.</span>
                  <div className="hidden lg:block absolute top-7 left-0 w-1/2 h-0.5 bg-slate-300 -translate-y-1/2 -ml-6 z-0"></div>
                  <div className="hidden lg:block absolute top-7 right-0 w-1/2 h-0.5 bg-slate-300 -translate-y-1/2 -mr-6 z-0"></div>
                </div>

                <div className="flex flex-col items-center text-center relative">
                  <div className="w-14 h-14 bg-white border-2 border-slate-200 text-slate-800 rounded-xl flex items-center justify-center mb-3 font-bold shadow-sm z-10"><Globe className="w-6 h-6 text-rose-500"/></div>
                  <span className="font-bold text-slate-800 mb-1">5. Live Studio</span>
                  <span className="text-xs text-slate-500 leading-tight">Message flow.<br/>Link coordination.</span>
                  <div className="hidden lg:block absolute top-7 left-0 w-1/2 h-0.5 bg-slate-300 -translate-y-1/2 -ml-6 z-0"></div>
                </div>
              </div>
            </div>

            {/* Architecture Details Grids */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Custom Post Types */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
                <h4 className="font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" />
                  Custom Post Types (CPTs)
                </h4>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500"></div>
                    <div className="font-mono text-emerald-700 font-bold mb-1">psc_guests</div>
                    <p className="text-xs text-slate-600 mb-2">Primary entity for guest registration models.</p>
                    <div className="flex gap-2 text-[10px] font-mono text-slate-500">
                       <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Tax: psc_topics</span>
                       <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Supports: title, editor</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500"></div>
                    <div className="font-mono text-emerald-700 font-bold mb-1">psc_hosts</div>
                    <p className="text-xs text-slate-600 mb-2">Primary entity for host and show registrations.</p>
                    <div className="flex gap-2 text-[10px] font-mono text-slate-500">
                       <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Tax: psc_topics</span>
                       <span className="bg-white border border-slate-200 px-2 py-0.5 rounded">Supports: title, editor</span>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500"></div>
                    <div className="font-mono text-emerald-700 font-bold mb-1">psc_episodes</div>
                    <p className="text-xs text-slate-600">Scheduler state for matched endpoints to coordinate.</p>
                  </div>
                </div>
              </div>

              {/* ACF Fields */}
              <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
                <h4 className="font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-500" />
                  ACF Core Field Groups
                </h4>
                <div className="space-y-4">
                  <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                    <h5 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div> Group: Guest Profile
                    </h5>
                    <ul className="text-xs text-slate-600 font-mono space-y-2">
                      <li className="flex justify-between items-center"><span className="text-amber-700 font-bold w-1/2">guest_availability</span> <span className="bg-white border border-slate-200 px-2 py-1 rounded w-1/3 text-center">Text</span></li>
                      <li className="flex justify-between items-center"><span className="text-amber-700 font-bold w-1/2">guest_social_links</span> <span className="bg-white border border-slate-200 px-2 py-1 rounded w-1/3 text-center">Repeater</span></li>
                      <li className="flex justify-between items-center"><span className="text-amber-700 font-bold w-1/2">guest_experience</span> <span className="bg-white border border-slate-200 px-2 py-1 rounded w-1/3 text-center">Select</span></li>
                    </ul>
                  </div>
                  <div className="border border-slate-100 p-4 rounded-xl bg-slate-50/50">
                    <h5 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div> Group: Host Profile
                    </h5>
                    <ul className="text-xs text-slate-600 font-mono space-y-2">
                      <li className="flex justify-between items-center"><span className="text-amber-700 font-bold w-1/2">host_audience_size</span> <span className="bg-white border border-slate-200 px-2 py-1 rounded w-1/3 text-center">Number</span></li>
                      <li className="flex justify-between items-center"><span className="text-amber-700 font-bold w-1/2">host_podcast_url</span> <span className="bg-white border border-slate-200 px-2 py-1 rounded w-1/3 text-center">URL</span></li>
                      <li className="flex justify-between items-center"><span className="text-amber-700 font-bold w-1/2">host_topics_sought</span> <span className="bg-white border border-slate-200 px-2 py-1 rounded w-1/3 text-center">Checkbox</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            
            {/* Component Pages & Downloads Section */}
            <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200">
              <h4 className="font-extrabold text-slate-800 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-500" />
                System Component Pages & Extracts
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {componentsData.map((comp) => (
                  <div key={comp.id} className="border border-slate-200 rounded-xl p-5 bg-slate-50 flex flex-col items-start relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                    
                    <h5 className="font-bold text-slate-800 text-lg mb-1 relative">{comp.name}</h5>
                    <code className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded inline-block mb-3 border border-indigo-100 relative shadow-sm">
                      {comp.shortcode}
                    </code>
                    
                    <p className="text-sm text-slate-600 mb-2 relative flex-1">{comp.desc}</p>
                    <p className="text-xs text-slate-500 font-mono mb-6 relative">
                      Attributes: <span className="font-bold">{comp.attributes}</span>
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 w-full relative">
                      <button
                        onClick={() => handleDownloadCode(comp.id + '.php', comp.phpCode, 'php')}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg font-bold text-xs transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        PHP Entry
                      </button>
                      <button
                        onClick={() => handleDownloadCode(comp.id + '.css', comp.cssCode, 'css')}
                        className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 px-4 rounded-lg font-bold text-xs transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        Core CSS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Team Comms Tab - Maintained from prior */}
        {activeTab === 'comms' && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden flex flex-col h-[600px] animate-fade-in">
            <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 flex justify-between items-center">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-500" /> Team Comms channel: #dev-ops
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded font-bold font-mono border border-emerald-200 shadow-sm">2 ONLINE</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-sm">
              {messages.map((msg) => (
                <div key={msg.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl shadow-sm">
                  <div className="flex items-end gap-3 mb-1">
                    <span className="font-extrabold text-indigo-700">{msg.user}</span>
                    <span className="text-[10px] text-slate-400 font-bold">{msg.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed font-sans">{msg.text}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-200 shrink-0 bg-white shadow-inner flex flex-col gap-2 bg-slate-50/50">
              <span className="text-xs font-bold text-slate-400 font-mono pl-1">TERMINAL INPUT:</span>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message to the dev team..."
                  className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono text-sm shadow-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-md"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
