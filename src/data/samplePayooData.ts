import { PayooVideo, PayooLiveStream, PayooSupporter, PayooProduct, PayooUser } from '../types';

export const INITIAL_PAYOO_USER: PayooUser = {
  id: 'usr_widny_01',
  name: 'Jean Widny Papas',
  username: 'widnypapas',
  email: 'jeanwidny9@gmail.com',
  phoneNumber: '+509 3812 9045',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  coverPhoto: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=1200',
  bio: 'Fondateur & Kreyatè Kontni sou PAYOO Rézo d\'Haïti 🇭🇹 | Devlopman teknolojik ak kiltirèl.',
  followersCount: 12450,
  followingCount: 340,
  isVerified: true,
  isIdentityVerified: true,
  isSupporter: true,
  supporterTier: 'Visionnaire Ayiti',
  totalContributionHTG: 1000000,
  accountType: 'creator',
  earningsHTG: 84500,
  payooTokens: 1250,
  location: 'Port-au-Prince, Haïti'
};

export const INITIAL_PAYOO_VIDEOS: PayooVideo[] = [
  {
    id: 'vid_1',
    authorId: 'usr_widny_01',
    authorName: 'Jean Widny Papas',
    authorUsername: 'widnypapas',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    authorVerified: true,
    title: 'Kijan pou w kreye kontni ak monètize l sou PAYOO Rézo an Ayiti 🇭🇹',
    description: 'Benveni sou premye rezo sosyal ak platfòm videyo Ayisyen an! Gade kijan w ka genyen goud ak MonCash ak NatCash.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-young-man-smiling-41525-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    viewsCount: 45800,
    likesCount: 3420,
    commentsCount: 284,
    sharesCount: 512,
    earningsHTG: 1526,
    isLiked: true,
    isSaved: true,
    createdAt: '2 èdtan de sa',
    tags: ['PAYOO', 'Monètizasyon', 'Ayiti', 'Teknoloji']
  },
  {
    id: 'vid_2',
    authorId: 'usr_2',
    authorName: 'Sonia Culture HT',
    authorUsername: 'soniaculture',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
    authorVerified: true,
    title: 'Bote ak Richès Citadelle Laferrière nan Okap 🇭🇹🏰',
    description: 'N ap vizite rès istwa nou ak fyète nasyonal nou. Pataje videyo sa pou tout moun wè bote peyi d Ayiti!',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    viewsCount: 89200,
    likesCount: 9410,
    commentsCount: 610,
    sharesCount: 1420,
    earningsHTG: 2973,
    createdAt: '1 jou de sa',
    tags: ['Istwa', 'Touris', 'Citadelle', 'Okap']
  },
  {
    id: 'vid_3',
    authorId: 'usr_3',
    authorName: 'Chef Manno Gastronomie',
    authorUsername: 'chefmanno',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    authorVerified: false,
    title: 'Resèt Soup Joumou tradisyonèl Ayisyen 🍲',
    description: 'Teknik sekrè pou soup joumou an gen yon gou inoubliyab! Mèsi tout moun ki sipòte m sou MonCash.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-serving-dinner-in-a-restaurant-41484-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600',
    viewsCount: 31400,
    likesCount: 2890,
    commentsCount: 195,
    sharesCount: 380,
    earningsHTG: 1046,
    createdAt: '3 jou de sa',
    tags: ['Kizinn', 'SoupJoumou', 'Ayiti', 'Manje']
  }
];

export const INITIAL_PAYOO_LIVE: PayooLiveStream[] = [
  {
    id: 'live_1',
    hostName: 'Konkou Mizik Kreyòl 2026',
    hostAvatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=300',
    hostVerified: true,
    title: '🔴 Gwann Konkou Entènasyonal Talent Ayisyen an Dirèk!',
    category: 'Mizik & Kilti',
    viewersCount: 1420,
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=600',
    isLive: true,
    startedAt: 'Gen 45 minit',
    totalGiftsHTG: 45800
  },
  {
    id: 'live_2',
    hostName: 'Papas Tech Live Show',
    hostAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    hostVerified: true,
    title: '🔴 Kijan pou w itilize IA pou kreye kontni ak fe lajan an Ayiti',
    category: 'Teknoloji & Biznis',
    viewersCount: 890,
    thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600',
    isLive: true,
    startedAt: 'Gen 15 minit',
    totalGiftsHTG: 28400
  }
];

export const INITIAL_PAYOO_SUPPORTERS: PayooSupporter[] = [
  {
    id: 'sup_1',
    supporterName: 'Jean Widny Papas',
    companyName: 'Papas Tech Media Inc.',
    amountHTG: 1000000,
    email: 'jeanwidny9@gmail.com',
    contactNumber: '+509 3812 9045',
    reason: 'Soutenir l\'infrastructure vidéo nationale et la monétisation des jeunes créateurs haïtiens.',
    paymentMethod: 'bank_transfer',
    tierBadge: 'Visionnaire Ayiti',
    date: '12 Out 2026',
    isPublicConsent: true
  },
  {
    id: 'sup_2',
    supporterName: 'Fondation Digicel & MonCash',
    companyName: 'Digicel Haïti',
    amountHTG: 5000000,
    email: 'contact@digicelhaiti.com',
    contactNumber: '+509 3700 0000',
    reason: 'Encourager l\'inclusion financière numérique et la créativité locale.',
    paymentMethod: 'moncash',
    tierBadge: 'Patron Diamant',
    date: '10 Out 2026',
    isPublicConsent: true
  },
  {
    id: 'sup_3',
    supporterName: 'Natcom & NatCash FinTech',
    companyName: 'Natcom S.A.',
    amountHTG: 2500000,
    email: 'support@natcom.com.ht',
    contactNumber: '+509 2222 2222',
    reason: 'Promouvoir le réseau haut débit et les télécommunications modernes.',
    paymentMethod: 'natcash',
    tierBadge: 'Platinum',
    date: '08 Out 2026',
    isPublicConsent: true
  }
];

export const INITIAL_PAYOO_PRODUCTS: PayooProduct[] = [
  {
    id: 'prod_1',
    title: 'Kit Studio Micro & Lumière Ring Light pou Kreyatè',
    sellerName: 'Papas Tech Store',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    sellerVerified: true,
    priceHTG: 6500,
    category: 'Teknoloji',
    location: 'Petyonvil, Pòtoprens',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
    description: 'Kit konplè ak trepye, mikwo lapel san fil, ak limyè dirije pou bèl videyo sou PAYOO Rézo.',
    inStock: true,
    contactPhone: '+509 3812 9045'
  },
  {
    id: 'prod_2',
    title: 'Tableau d\'Art Peinture Haïtienne d\'Origine Jacmel',
    sellerName: 'Galri Art Kreyòl',
    sellerAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
    sellerVerified: true,
    priceHTG: 12500,
    category: 'Art & Kilti',
    location: 'Jakmèl, Haïti',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&q=80&w=600',
    description: 'Penti orijinal sou twal fèt pa atis popilè nan Jakmèl. Livrezon disponib toupatou.',
    inStock: true,
    contactPhone: '+509 3600 1234'
  }
];
