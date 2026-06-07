import { GuestProfile, HostProfile, MatchWeights } from './types';

export const DEFAULT_WEIGHTS: MatchWeights = {
  reviews: 0.20,
  topics: 0.20,
  industry: 0.15,
  experience: 0.15,
  format: 0.10,
  audience: 0.10,
  location: 0.05,
  language: 0.05,
};

export const INITIAL_GUESTS: GuestProfile[] = [
  {
    id: 'guest_1',
    displayName: 'Dr. Evelyn Martinez',
    bio: 'AI researcher and author of "The Collaborative Brain". Evelyn has 10+ years of explaining complex deep learning models in simple human terms.',
    topics: ['AI & Automation', 'Tech Ethics', 'Scientific Breakthroughs', 'Future of Work'],
    industry: 'Technology',
    experienceLevel: 'Expert',
    location: 'Austin, TX, USA',
    remotePreference: 'Hybrid',
    languages: ['English', 'Spanish'],
    audiencePreference: 'Established/Large',
    preferredFormats: ['Interview', 'Panel/Roundtable'],
    tags: ['ArtificialIntelligence', 'DeepLearning', 'TechEthics', 'Author'],
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
    emailContact: 'evelyn.m@techresearch.org'
  },
  {
    id: 'guest_2',
    displayName: 'Marcus "Sully" Sullivan',
    bio: 'Product leader and bootstrapper who scaled three SaaS start-ups to $10M ARR. Passionate about growth-hacking with a zero-dollar budget.',
    topics: ['Entrepreneurship', 'Scaling a Business', 'Brand Building', 'Marketing Strategy', 'Content Strategy'],
    industry: 'Business/Finance',
    experienceLevel: 'Expert',
    location: 'San Francisco, CA, USA',
    remotePreference: 'Remote Only',
    languages: ['English'],
    audiencePreference: 'Emerging/Mid',
    preferredFormats: ['Interview', 'Solo/Co-host'],
    tags: ['SaaS', 'Marketing', 'StartupFunding', 'GrowthHacking'],
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    emailContact: 'sullivan.growth@mms.com'
  },
  {
    id: 'guest_3',
    displayName: 'Siddharth Mehta',
    bio: 'Certified Nutritionist and Wellness Coach. Focused on plant-based optimization, metabolic efficiency, and designing sustainable routines for busy founders.',
    topics: ['Nutrition', 'Burnout Recovery', 'Habits', 'Biohacking'],
    industry: 'Health & Wellness',
    experienceLevel: 'Intermediate',
    location: 'London, UK',
    remotePreference: 'Remote Only',
    languages: ['English', 'Hindi'],
    audiencePreference: 'Niche/Micro',
    preferredFormats: ['Interview', 'Panel/Roundtable', 'Solo/Co-host'],
    tags: ['Wellness', 'Biohacking', 'Vegan', 'MentalHealth'],
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    emailContact: 'sid.mehta@holisticbound.co.uk'
  },
  {
    id: 'guest_4',
    displayName: 'Chloe Dubois',
    bio: 'Indie game developer and pixel artist. Host of several local developer meetups in Paris. Teaches interactive storytelling at university.',
    topics: ['Gaming', 'Creative Process', 'Storytelling', 'Design Thinking'],
    industry: 'Arts/Education',
    experienceLevel: 'Intermediate',
    location: 'Paris, France',
    remotePreference: 'In-Person Only',
    languages: ['French', 'English'],
    audiencePreference: 'Emerging/Mid',
    preferredFormats: ['Panel/Roundtable'],
    tags: ['Gamedev', 'RetroArt', 'CreativeCoding', 'Python'],
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    emailContact: 'chloe@pixelsandcode.fr'
  },
  {
    id: 'guest_5',
    displayName: 'Aaliyah Jackson',
    bio: 'Financial educator helping Gen Z build stock portfolios. Simplifies compound interest and macroeconomics with fast-paced social media hooks.',
    topics: ['Finance', 'Investing', 'Wealth Building', 'Generational Differences'],
    industry: 'Business/Finance',
    experienceLevel: 'Beginner',
    location: 'Atlanta, GA, USA',
    remotePreference: 'Hybrid',
    languages: ['English'],
    audiencePreference: 'Emerging/Mid',
    preferredFormats: ['Interview', 'Solo/Co-host'],
    tags: ['Stocks', 'Investing', 'FinancialLiteracy', 'GenZ'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    emailContact: 'jackson.aaliyah@investinghub.com'
  }
];

export const INITIAL_HOSTS: HostProfile[] = [
  {
    id: 'host_1',
    showName: 'The AI Horizon Podcast',
    description: 'Weekly conversations with researchers, founders, and ethicists exploring the frontier of synthetic intelligence.',
    showTopics: ['AI & Automation', 'Tech Ethics', 'Scientific Breakthroughs', 'Future of Work'],
    industry: 'Technology',
    format: 'Interview',
    audienceSize: 'Established/Large',
    location: 'San Francisco, CA, USA',
    remoteOptions: 'Hybrid',
    languages: ['English'],
    guestRequirements: 'Looking for researchers, senior engineers or authors with expert category knowledge willing to debate ethics.',
    requiredExperienceLevel: 'Expert',
    tags: ['Tech', 'AI', 'Ethics', 'Science'],
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&h=150&fit=crop',
    hostEmail: 'booking@aihorizon.io'
  },
  {
    id: 'host_2',
    showName: 'Bootstrapped Founders',
    description: 'Practical, down-to-earth chat with founders who built profitable companies without taking formal venture funding.',
    showTopics: ['Entrepreneurship', 'Scaling a Business', 'Brand Building', 'Marketing Strategy', 'Content Strategy'],
    industry: 'Business/Finance',
    format: 'Interview',
    audienceSize: 'Emerging/Mid',
    location: 'Remote Only',
    remoteOptions: 'Remote Only',
    languages: ['English'],
    guestRequirements: 'Must have built or scaled a product to at least $10k MRR. No pure theories—only real case studies.',
    requiredExperienceLevel: 'Intermediate',
    tags: ['SaaS', 'IndieHackers', 'Startup'],
    logoUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=150&h=150&fit=crop',
    hostEmail: 'sully@bootstrappedfounders.com'
  },
  {
    id: 'host_3',
    showName: 'Wellness Engineering',
    description: 'An expert-guided guide to feeling better, sleeping deeper, and extending healthspan. Ideal for desk-bound professionals.',
    showTopics: ['Nutrition', 'Burnout Recovery', 'Habits', 'Biohacking'],
    industry: 'Health & Wellness',
    format: 'Solo/Co-host',
    audienceSize: 'Niche/Micro',
    location: 'London, UK',
    remoteOptions: 'Hybrid',
    languages: ['English'],
    guestRequirements: 'Certified doctors, dietitians, or coaches who can provide concrete lifestyle routines, not abstract spiritual advice.',
    requiredExperienceLevel: 'Intermediate',
    tags: ['Wellness', 'Biohacking', 'Productivity'],
    logoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=150&h=150&fit=crop',
    hostEmail: 'producers@wellnesseng.co.uk'
  },
  {
    id: 'host_4',
    showName: 'Le Pixel Club',
    description: 'Chorale d’esprits créatifs. Nous parlons de la culture des jeux vidéo en France, des illustrateurs rétro, et d’ateliers de programmation.',
    showTopics: ['Gaming', 'Creative Process', 'Storytelling', 'Design Thinking'],
    industry: 'Arts/Education',
    format: 'Panel/Roundtable',
    audienceSize: 'Emerging/Mid',
    location: 'Paris, France',
    remoteOptions: 'In-Person Only',
    languages: ['French', 'English'],
    guestRequirements: 'Parler français est indispensable pour le panel. Capacité d’improvisation et d’amusement devant le public.',
    requiredExperienceLevel: 'Beginner',
    tags: ['Gaming', 'Creative', 'France', 'Art'],
    logoUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150&h=150&fit=crop',
    hostEmail: 'interviews@lepixelclub.fr'
  }
];

export const CATEGORIZED_TOPICS = [
  {
    category: "1. Personal Journey & Identity",
    color: "#F4D03F",
    textColor: "#000000",
    topics: [
      "Origin Story",
      "Defining Moments",
      "Turning Points",
      "Failures & Lessons",
      "Overcoming Adversity",
      "Identity & Values",
      "Life Transitions",
      "Reinvention",
      "Legacy",
      "Family Influence"
    ]
  },
  {
    category: "2. Career, Business & Industry",
    color: "#3498DB",
    textColor: "#ffffff",
    topics: [
      "Career Path",
      "Industry Trends",
      "Behind the Scenes",
      "Leadership",
      "Management",
      "Entrepreneurship",
      "Scaling a Business",
      "Innovation",
      "Future of Work",
      "Expert Predictions"
    ]
  },
  {
    category: "3. Mindset, Habits & Personal Development",
    color: "#27AE60",
    textColor: "#ffffff",
    topics: [
      "Mindset",
      "Habits",
      "Productivity",
      "Resilience",
      "Goal Setting",
      "Motivation",
      "Mental Health",
      "Burnout Recovery",
      "Confidence",
      "Time Management"
    ]
  },
  {
    category: "4. Creativity, Art & Media",
    color: "#9B59B6",
    textColor: "#ffffff",
    topics: [
      "Creative Process",
      "Storytelling",
      "Writing",
      "Music Creation",
      "Film & Media",
      "Design Thinking",
      "Inspiration Sources",
      "Artistic Identity"
    ]
  },
  {
    category: "5. Society, Culture & Community",
    color: "#E67E22",
    textColor: "#ffffff",
    topics: [
      "Social Issues",
      "Community Building",
      "Advocacy",
      "Education Reform",
      "Cultural Trends",
      "Generational Differences",
      "Diversity & Inclusion"
    ]
  },
  {
    category: "6. Business Growth, Marketing & Money",
    color: "#2980B9",
    textColor: "#ffffff",
    topics: [
      "Brand Building",
      "Marketing Strategy",
      "Sales Psychology",
      "Finance",
      "Investing",
      "Wealth Building",
      "E-commerce",
      "Content Strategy",
      "Audience Growth"
    ]
  },
  {
    category: "7. Health, Wellness & Lifestyle",
    color: "#2ECC71",
    textColor: "#000000",
    topics: [
      "Nutrition",
      "Fitness",
      "Longevity",
      "Biohacking",
      "Sleep Optimization",
      "Lifestyle Design",
      "Travel Stories",
      "Addiction Recovery"
    ]
  },
  {
    category: "8. Science, Technology & Innovation",
    color: "#1ABC9C",
    textColor: "#000000",
    topics: [
      "AI & Automation",
      "Scientific Breakthroughs",
      "Space Exploration",
      "Digital Culture",
      "Cybersecurity",
      "Tech Ethics"
    ]
  },
  {
    category: "9. Entertainment, Media & Pop Culture",
    color: "#E91E63",
    textColor: "#ffffff",
    topics: [
      "Movies & TV",
      "Music Industry",
      "Comedy",
      "Gaming",
      "Fandoms",
      "Celebrity Culture"
    ]
  },
  {
    category: "10. Philosophy, Meaning & Human Behavior",
    color: "#F7DC6F",
    textColor: "#000000",
    topics: [
      "Meaning & Purpose",
      "Ethics",
      "Human Behavior",
      "Spirituality",
      "Consciousness"
    ]
  },
  {
    category: "11. Fun, Lighthearted & Conversational",
    color: "#F06292",
    textColor: "#000000",
    topics: [
      "Rapid-Fire Questions",
      "Hypotheticals",
      "Funny Stories",
      "Embarrassing Moments",
      "Unexpected Skills"
    ]
  },
  {
    category: "12. Show-Specific & Promotional",
    color: "#F9E79F",
    textColor: "#000000",
    topics: [
      "Why They’re on the Show",
      "What They Want to Promote",
      "Audience Takeaways"
    ]
  }
];

export const AVAILABLE_TOPICS = CATEGORIZED_TOPICS.flatMap(c => c.topics);

export const AVAILABLE_INDUSTRIES = [
  'Technology',
  'Business/Finance',
  'Health & Wellness',
  'Arts/Education',
  'Science',
  'Society & Culture',
  'Sports & Leisure'
];

export const AVAILABLE_LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Hindi',
  'Mandarin',
  'Japanese'
];

export function getTopicColor(topicName: string): { bg: string; text: string } {
  const category = CATEGORIZED_TOPICS.find(cat => cat.topics.includes(topicName));
  if (category) {
    return {
      bg: category.color,
      text: category.textColor
    };
  }
  return {
    bg: '#f1f5f9', // fallback slate-100
    text: '#334155' // fallback slate-700
  };
}

export function getTopicButtonStyles(topicName: string, active: boolean): Record<string, string | number> {
  const category = CATEGORIZED_TOPICS.find(cat => cat.topics.includes(topicName));
  if (!category) {
    return active 
      ? { backgroundColor: '#334155', color: '#ffffff', borderColor: '#334155' }
      : { backgroundColor: '#f1f5f9', color: '#64748b', borderColor: '#cbd5e1' };
  }
  
  if (active) {
    return {
      backgroundColor: category.color,
      color: category.textColor,
      borderColor: category.color,
      fontWeight: 'bold',
    };
  } else {
    // Return a soft tinted background with the category's color at low opacity,
    // and full color border at 30% opacity, with a dark neutral/colored text.
    return {
      backgroundColor: `${category.color}15`, // ~8% opacity
      borderColor: `${category.color}50`,     // ~31% opacity
      color: category.textColor === '#000000' ? '#1e293b' : `${category.color}`, // deep dark or cat color
    };
  }
}
