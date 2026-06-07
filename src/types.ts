export interface GuestProfile {
  id: string;
  displayName: string;
  bio: string;
  topics: string[];
  industry: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  location: string;
  remotePreference: 'Remote Only' | 'In-Person Only' | 'Hybrid';
  languages: string[];
  audiencePreference: 'Niche/Micro' | 'Emerging/Mid' | 'Established/Large';
  preferredFormats: string[];
  tags: string[];
  avatarUrl?: string;
  headerBgUrl?: string;
  emailContact?: string;
  availability?: string;
  reviewRating?: number;
}

export interface HostProfile {
  id: string;
  showName: string;
  description: string;
  showTopics: string[];
  industry: string;
  format: 'Interview' | 'Panel/Roundtable' | 'Solo/Co-host';
  audienceSize: 'Niche/Micro' | 'Emerging/Mid' | 'Established/Large';
  location: string;
  remoteOptions: 'Remote Only' | 'In-Person Only' | 'Hybrid';
  languages: string[];
  guestRequirements: string;
  requiredExperienceLevel: 'Beginner' | 'Intermediate' | 'Expert';
  tags: string[];
  logoUrl?: string;
  headerBgUrl?: string;
  hostEmail?: string;
  availability?: string;
  reviewRating?: number;
}

export interface MatchWeights {
  reviews: number;
  topics: number;
  industry: number;
  experience: number;
  format: number;
  audience: number;
  location: number;
  language: number;
}

export interface ScoreTrace {
  reviews: { score: number; maxWeight: number; weighted: number; detail: string };
  topics: { score: number; maxWeight: number; weighted: number; detail: string };
  industry: { score: number; maxWeight: number; weighted: number; detail: string };
  experience: { score: number; maxWeight: number; weighted: number; detail: string };
  format: { score: number; maxWeight: number; weighted: number; detail: string };
  audience: { score: number; maxWeight: number; weighted: number; detail: string };
  location: { score: number; maxWeight: number; weighted: number; detail: string };
  language: { score: number; maxWeight: number; weighted: number; detail: string };
  compositeScore: number;
  isValid: boolean;
}

