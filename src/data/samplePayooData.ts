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
    isFollowing: false,
    title: 'Kijan pou w kreye kontni ak monètize l sou PAYOO Rézo an Ayiti 🇭🇹',
    description: 'Premye rezo sosyal 100% Ayisyen ki peye w pou chak 15 vues sou MonCash ak NatCash! Pataje videyo a pou sipòte kreyatè nou yo. #PAYOO #Monetizasyon #Ayiti #Teknoloji #Kreyatè',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-young-man-smiling-41525-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    viewsCount: 145800,
    likesCount: 18420,
    commentsCount: 1284,
    sharesCount: 3512,
    earningsHTG: 4860,
    isLiked: false,
    isSaved: false,
    audioTrack: 'Son Orijinal - Papas Beat Rasin Tech',
    audioAuthor: 'Jean Widny Papas',
    createdAt: '2 èdtan de sa',
    tags: ['PAYOO', 'Monètizasyon', 'Ayiti', 'Teknoloji', 'Kreyol'],
    commentsList: [
      {
        id: 'c1',
        user: 'Stephane_HT',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        text: 'Sa se pi gwo fyète pou nou an Ayiti! Mwen kòmanse poste videyo m yo jodi a 🔥🇭🇹',
        time: '45m',
        likes: 142,
        isLiked: false
      },
      {
        id: 'c2',
        user: 'Nadege_Kreyol',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        text: 'Retrè MonCash la mache vit vre! Mwen resevwa 1,500 HTG m nan 5 minit.',
        time: '1h',
        likes: 89,
        isLiked: true
      },
      {
        id: 'c3',
        user: 'Marc_Artiste',
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
        text: 'Bèl inisyativ pou jèn kreyatè ayisyen yo. Bravo Jean Widny! 👏',
        time: '2h',
        likes: 54,
        isLiked: false
      }
    ]
  },
  {
    id: 'vid_2',
    authorId: 'usr_2',
    authorName: 'Sonia Culture HT',
    authorUsername: 'soniaculture',
    authorAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=300',
    authorVerified: true,
    isFollowing: true,
    title: 'Bote ak Richès Citadelle Laferrière nan Okap 🇭🇹🏰',
    description: 'N ap vizite pi gwo moniman istorik nan Karayib la. Fyète zansèt nou yo toujou vivan! #Citadelle #Okap #AyitiCheri #Istwa #Kilti',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tree-branches-in-the-breeze-1188-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600',
    viewsCount: 289200,
    likesCount: 39410,
    commentsCount: 2610,
    sharesCount: 8420,
    earningsHTG: 9640,
    isLiked: true,
    isSaved: true,
    audioTrack: 'Mizik Tradisyonèl Tanbou & Rara Ayiti',
    audioAuthor: 'Sonia Culture HT',
    createdAt: '1 jou de sa',
    tags: ['Istwa', 'Touris', 'Citadelle', 'Okap', 'Kilti'],
    commentsList: [
      {
        id: 'c4',
        user: 'Kensley_Nord',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        text: 'Okap se pi bèl vil! Mèsi Sonia pou bèl videyo sa a 🇭🇹❤️',
        time: '3h',
        likes: 210,
        isLiked: true
      },
      {
        id: 'c5',
        user: 'Vanessa_Diaspora',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
        text: 'Mwen nan Miyami men kè m toujou Ayiti! M voye yon kado MonCash pou ou!',
        time: '5h',
        likes: 95,
        isLiked: false
      }
    ]
  },
  {
    id: 'vid_3',
    authorId: 'usr_3',
    authorName: 'Chef Manno Gastronomie',
    authorUsername: 'chefmanno',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    authorVerified: true,
    isFollowing: false,
    title: 'Resèt Soup Joumou tradisyonèl Ayisyen 🍲 Gou Inoubliyab!',
    description: 'Teknik sekrè epis kreyòl, vyann bèf byen marinen, bannann ak malanga pou yon soup joumou 100% otantik. #SoupJoumou #KizinnAyisyen #ManjeLokal #1Janvye #GouKreyol',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-fresh-vegetables-42777-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=600',
    viewsCount: 91400,
    likesCount: 12890,
    commentsCount: 895,
    sharesCount: 1380,
    earningsHTG: 3046,
    isLiked: false,
    isSaved: true,
    audioTrack: 'Gou Kreyòl - Instrumental Konpa Love',
    audioAuthor: 'Chef Manno',
    createdAt: '3 jou de sa',
    tags: ['Kizinn', 'SoupJoumou', 'Ayiti', 'Manje', 'Gastronomie'],
    commentsList: [
      {
        id: 'c6',
        user: 'Manman_Doudou',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
        text: 'Epis la santi bon depi sou ekran an! Bon travay chèf.',
        time: '1d',
        likes: 78,
        isLiked: false
      }
    ]
  },
  {
    id: 'vid_4',
    authorId: 'usr_4',
    authorName: 'DJ Kensley Mix HT',
    authorUsername: 'djkensleymix',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300',
    authorVerified: true,
    isFollowing: false,
    title: 'Nouvo Konpa Gouyad & Rabòday Mix 2026 🔥🎧',
    description: 'Met kask nan zòrèy ou pou w pran pi bon vibrasyon mizik ayisyen an dirèk! Like & Pataje! #Konpa #Raboday #Gouyad #MizikAyiti #DJSet',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-man-on-a-concert-40898-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80&w=600',
    viewsCount: 312000,
    likesCount: 45200,
    commentsCount: 3120,
    sharesCount: 12400,
    earningsHTG: 10400,
    isLiked: true,
    isSaved: false,
    audioTrack: 'Rabòday Kanaval & Gouyad Hits 2026',
    audioAuthor: 'DJ Kensley Mix HT',
    createdAt: '4 jou de sa',
    tags: ['Mizik', 'Konpa', 'Raboday', 'Danse', 'Gouyad'],
    commentsList: [
      {
        id: 'c7',
        user: 'Ti_Blanc_509',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        text: 'Rabòday sa a bay frison nèt! 🔥🇭🇹',
        time: '2d',
        likes: 312,
        isLiked: true
      }
    ]
  },
  {
    id: 'vid_5',
    authorId: 'usr_5',
    authorName: 'Ayiti Danse Academy',
    authorUsername: 'ayitidanse',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    authorVerified: false,
    isFollowing: false,
    title: 'Koregrafi Yanvalou & Ibo ak Tanbou Rasin 💃🪘',
    description: 'Rit zansèt nou yo nan chak mouvman. Aprann etap dans folklorik ayisyen an fasil. #DansKreyol #Yanvalou #Folklor #Rasin #Ayiti',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-in-a-field-of-wildflowers-41618-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80&w=600',
    viewsCount: 168000,
    likesCount: 22400,
    commentsCount: 1450,
    sharesCount: 4200,
    earningsHTG: 5600,
    isLiked: false,
    isSaved: false,
    audioTrack: 'Rit Yanvalou Tanbou Rasin - Ayiti Danse',
    audioAuthor: 'Ayiti Danse Academy',
    createdAt: '5 jou de sa',
    tags: ['Dans', 'Kilti', 'Folklor', 'Yanvalou', 'Ayiti'],
    commentsList: [
      {
        id: 'c8',
        user: 'Rose_Mirlene',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        text: 'Grasiye ak elegans fanm ayisyen an! 🇭🇹✨',
        time: '3d',
        likes: 184,
        isLiked: true
      }
    ]
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
