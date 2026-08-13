export interface Lead {
  id: string;
  name: string;
  website: string;
  contactEmail: string;
  contactPage?: string;
  socialUrl?: string;
  leadScore: number; // 0-100
  location: string;
  niche: string;
  suggestedAngle: string;
  phone?: string;
  address?: string;
}

export type LeadStatus = 'New' | 'Contacted' | 'Replied' | 'Won' | 'Lost';

export interface SavedLead extends Lead {
  savedAt: string;
  status: LeadStatus;
  notes: string;
  lastContactedAt?: string;
}

export interface SearchQuery {
  niche: string;
  location: string;
  service: string;
  count: number;
}

export type PlanType = 'free' | 'pro' | 'business' | 'enterprise' | 'agency' | 'ultimate_vip';

export interface SubscriptionPlan {
  id: PlanType;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  badge?: string;
  iconName: string;
  description: string;
  maxLeadsPerMonth: number | 'Illimité';
  features: string[];
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  expiryDate: string;
  maxUses: number;
  currentUses: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  userEmail: string;
  plan: PlanType;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'Reussi' | 'En attente' | 'Remboursé';
  invoiceNumber: string;
  date: string;
}

export interface ReferralData {
  referralCode: string;
  totalReferrals: number;
  totalCommissionsUSD: number;
  pendingCommissionsUSD: number;
  commissionRatePercent: number; // 20%
}

export interface AdSenseConfig {
  publisherId: string;
  enableHeaderBanner: boolean;
  enableSidebarBanner: boolean;
  enableResultsSpotlight: boolean;
  testMode: boolean;
}

export interface OutreachMessage {
  coldEmailSubject: string;
  coldEmailBody: string;
  linkedinMessage: string;
  followUpEmailSubject: string;
  followUpEmailBody: string;
}

export interface FilterOptions {
  minScore: number;
  hasWebsite: boolean;
  hasEmail: boolean;
  searchQuery: string;
}

export interface UserStats {
  searchesToday: number;
  leadsExported: number;
  activePlan: PlanType;
}

// --- GLOBAL JOB SEARCH & COMPANY TYPES ---
export type ContractType = 'CDI' | 'CDD' | 'Freelance' | 'Stage' | 'Remote' | 'Temps plein' | 'Temps partiel';

export interface JobPosting {
  id: string;
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  country: string;
  city: string;
  sector: string;
  contractType: ContractType;
  salaryMin: number;
  salaryMax: number;
  currency: string; // 'USD' | 'EUR' | 'CAD' etc.
  experienceLevel: 'Junior (0-2 ans)' | 'Intermédiaire (2-5 ans)' | 'Sénior (5+ ans)' | 'Executive';
  description: string;
  requirements: string[];
  contactEmail: string;
  postedDate: string;
  featured?: boolean;
  remoteAvailable: boolean;
  aiCompatibilityScore?: number; // Calculated dynamically
}

export interface CompanyProfile {
  id: string;
  name: string;
  logo: string;
  sector: string;
  country: string;
  city: string;
  website: string;
  email: string;
  phone: string;
  contactPerson: string;
  headcount: string;
  description: string;
  openJobsCount: number;
  verified: boolean;
  rating: number;
}

// --- CANDIDATURE INTELLIGENTE & CV TYPES ---
export type ApplicationStatus = 'Envoyée' | 'En cours' | 'Entretien' | 'Acceptée' | 'Refusée';

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  applicantName: string;
  applicantEmail: string;
  appliedDate: string;
  status: ApplicationStatus;
  compatibilityScore: number;
  coverLetter: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  notes?: string;
}

export interface CandidateProfile {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  skills: string[];
  experiences: {
    id: string;
    role: string;
    company: string;
    period: string;
    description: string;
  }[];
  education: {
    id: string;
    degree: string;
    school: string;
    year: string;
  }[];
  certifications: string[];
  portfolioLinks: { label: string; url: string }[];
  linkedinUrl: string;
  githubUrl: string;
  idVerified: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  // Extended social profile fields
  coverPhoto?: string;
  avatarUrl?: string;
  profession?: string;
  country?: string;
  city?: string;
  availability?: string;
  workPreference?: 'Remote' | 'Présentiel' | 'Hybride';
  desiredSalary?: number;
  currency?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  websiteUrl?: string;
  socialLinks?: { twitter?: string; linkedin?: string; github?: string; youtube?: string };
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

// --- SOCIAL NETWORK & PROFESSIONAL FEED TYPES ---
export type PostCategory =
  | 'text'
  | 'photo'
  | 'video'
  | 'document'
  | 'cv'
  | 'portfolio'
  | 'project'
  | 'service'
  | 'job_request'
  | 'job_offer'
  | 'collaboration'
  | 'announcement';

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorTitle: string;
  text: string;
  createdAt: string;
  likesCount?: number;
}

export interface BoostTargeting {
  country?: string;
  region?: string;
  sector?: string;
  profession?: string;
  skills?: string[];
  language?: string;
  targetAudience?: string;
}

export interface SocialPost {
  id: string;
  authorType: 'user' | 'company';
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorTitle: string;
  authorLocation?: string;
  authorVerified?: boolean;
  postType: PostCategory;
  content: string;
  mediaUrl?: string;
  documentUrl?: string;
  documentName?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
  isBoosted?: boolean;
  boostType?: 'standard' | 'double'; // 'standard' = $5 USD, 'double' = $20 USD
  boostTargeting?: BoostTargeting;
  createdAt: string;
  comments?: PostComment[];
  // Optional meta data for specific post types
  jobTitle?: string;
  companyName?: string;
  salaryText?: string;
  servicePrice?: number;
  compatibilityScore?: number;
}

// --- TALENT FINDER & CANDIDATE SEARCH TYPES ---
export interface TalentFilter {
  country: string;
  city: string;
  sector: string;
  profession: string;
  skills: string[];
  minExperienceYears: number;
  maxSalary: number;
  availability: string;
  remoteOnly: boolean;
  language: string;
  professionalLevel: string; // 'Junior' | 'Intermédiaire' | 'Sénior' | 'Executive'
}

export interface TalentProfile extends CandidateProfile {
  id: string;
  avatarUrl: string;
  coverPhotoUrl?: string;
  country: string;
  city: string;
  sector: string;
  profession: string;
  experienceYears: number;
  desiredSalary: number;
  currency: string;
  availability: string;
  remotePreference: 'Remote' | 'Présentiel' | 'Hybride';
  languages: string[];
  professionalLevel: string;
  compatibilityScore?: number;
  followersCount: number;
  isFollowing?: boolean;
}

// --- NATURAL LANGUAGE GEMINI AI QUERY TYPES ---
export interface NaturalLanguageJobQuery {
  prompt: string;
  profession?: string;
  skills?: string[];
  minSalary?: number;
  location?: string;
  remoteAvailable?: boolean;
  availability?: string;
  compatibleSectors?: string[];
  summaryExplanation?: string;
}

export interface NaturalLanguageCandidateQuery {
  prompt: string;
  targetTitle?: string;
  requiredSkills?: string[];
  minExperienceYears?: number;
  maxSalary?: number;
  location?: string;
  remoteOnly?: boolean;
  level?: string;
  summaryExplanation?: string;
}

// --- MESSAGING & PROFESSIONAL EMAIL TYPES ---
export interface EmailMessage {
  id: string;
  sender: string;
  senderEmail: string;
  recipientEmail: string;
  subject: string;
  body: string;
  date: string;
  folder: 'inbox' | 'sent' | 'starred' | 'drafts';
  read: boolean;
  autoFollowUpEnabled?: boolean;
}

// --- SERVICES & FREELANCE MARKETPLACE TYPES ---
export interface FreelanceService {
  id: string;
  providerName: string;
  providerAvatar: string;
  title: string;
  category: string; // 'Développement Web' | 'Design UI/UX' | 'Marketing Digital' | 'IA' etc.
  description: string;
  startingPrice: number;
  rating: number;
  reviewsCount: number;
  deliveryDays: number;
  badge?: string;
}

export interface ProjectMission {
  id: string;
  clientName: string;
  title: string;
  category: string;
  budget: number;
  deadline: string;
  description: string;
  proposalsCount: number;
  status: 'Ouverte' | 'En cours' | 'Terminée';
  postedAt: string;
}

// --- INTEGRATIONS & SECURITY TYPES ---
export interface PlatformIntegration {
  id: string;
  name: string;
  iconName: string;
  connected: boolean;
  description: string;
  category: 'Job Boards' | 'Auth & Profile' | 'CRM & Cloud';
}

// --- PAYOO RÉZO D'HAÏTI TYPES ---
export interface PayooUser {
  id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber?: string;
  avatar: string;
  coverPhoto?: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  isVerified: boolean;
  isIdentityVerified: boolean;
  isSupporter: boolean;
  supporterTier?: string;
  totalContributionHTG?: number;
  accountType: 'personal' | 'creator' | 'business' | 'supporter';
  earningsHTG: number;
  payooTokens: number;
  location?: string;
}

export interface VideoComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  isLiked?: boolean;
}

export interface VideoGift {
  id: string;
  user: string;
  giftName: string;
  amountHTG: number;
  icon: string;
  time: string;
}

export interface PayooVideo {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorVerified: boolean;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  viewsCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  earningsHTG: number;
  isLiked?: boolean;
  isSaved?: boolean;
  isBoosted?: boolean;
  isFollowing?: boolean;
  audioTrack?: string;
  audioAuthor?: string;
  commentsList?: VideoComment[];
  giftContributions?: VideoGift[];
  createdAt: string;
  tags: string[];
}

export interface PayooLiveStream {
  id: string;
  hostName: string;
  hostAvatar: string;
  hostVerified: boolean;
  title: string;
  category: string;
  viewersCount: number;
  thumbnailUrl: string;
  isLive: boolean;
  startedAt: string;
  totalGiftsHTG: number;
}

export interface PayooSupporter {
  id: string;
  supporterName: string;
  companyName?: string;
  amountHTG: number;
  email: string;
  contactNumber: string;
  reason: string;
  paymentMethod: 'moncash' | 'natcash' | 'bank_transfer' | 'card';
  tierBadge: string;
  date: string;
  isPublicConsent: boolean;
}

export interface PayooProduct {
  id: string;
  title: string;
  sellerName: string;
  sellerAvatar: string;
  sellerVerified: boolean;
  priceHTG: number;
  category: string;
  location: string;
  imageUrl: string;
  description: string;
  inStock: boolean;
  contactPhone: string;
}


