import { JobPosting, CompanyProfile, JobApplication, EmailMessage, PlatformIntegration } from '../types';

export const SAMPLE_JOB_POSTINGS: JobPosting[] = [];

export const SAMPLE_COMPANIES: CompanyProfile[] = [];

export const INITIAL_APPLICATIONS: JobApplication[] = [];

export const INITIAL_EMAILS: EmailMessage[] = [];

export const PLATFORM_INTEGRATIONS: PlatformIntegration[] = [
  { id: 'int-1', name: 'LinkedIn Jobs & InMail', iconName: 'Linkedin', connected: false, description: 'Importez votre profil LinkedIn et recevez des alertes d\'offres directes.', category: 'Auth & Profile' },
  { id: 'int-2', name: 'Google Calendar & Gmail', iconName: 'Mail', connected: false, description: 'Synchronisez vos entretiens et vos e-mails de candidatures.', category: 'CRM & Cloud' },
  { id: 'int-3', name: 'GitHub Pro', iconName: 'Github', connected: false, description: 'Exposez vos dépôts et vos projets de code dans votre portfolio.', category: 'Auth & Profile' },
  { id: 'int-4', name: 'Indeed Job Indexer', iconName: 'Search', connected: false, description: 'Agrégation automatique d\'offres d\'emploi internationales.', category: 'Job Boards' },
  { id: 'int-5', name: 'Glassdoor Reviews & Salaries', iconName: 'Star', connected: false, description: 'Comparez les salaires et avis d\'entreprises en temps réel.', category: 'Job Boards' },
  { id: 'int-6', name: 'ZipRecruiter Partner', iconName: 'Briefcase', connected: false, description: 'Postulez en 1 clic sur plus de 100 000 offres partenaires.', category: 'Job Boards' }
];
