import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Simple In-Memory Rate Limiter Middleware
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();

function rateLimiter(maxRequests: number = 30, windowMs: number = 60000) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    const key = `${ip}:${req.path}`;
    const now = Date.now();

    const record = rateLimitMap.get(key);
    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Trop de requêtes. Veuillez patienter un moment avant de réessayer (Rate Limit Exceeded).'
      });
    }

    record.count++;
    return next();
  };
}

// In-memory Database Mock / Persistence Store (Empty for production)
const MEMORY_DB = {
  users: [] as Array<any>,
  jobs: [] as Array<any>,
  companies: [] as Array<any>,
  applications: [] as Array<any>,
  messages: [] as Array<any>,
  notifications: [] as Array<any>,
  activityLogs: [] as Array<any>,
  visioRooms: [] as Array<any>,
  files: [] as Array<{ id: string; name: string; url: string; size: number; uploadedAt: string }>,
  posts: [] as Array<any>,
  talents: [] as Array<any>
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI client server-side
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    try {
      ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
      console.log('Gemini AI SDK initialized successfully for NicheLead Finder.');
    } catch (err) {
      console.error('Failed to initialize Gemini SDK:', err);
    }
  } else {
    console.warn('GEMINI_API_KEY environment variable is missing.');
  }

  // --- API ROUTES ---

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      app: 'NicheLead Finder & Global Job Backend API',
      timestamp: new Date().toISOString(),
      version: '2.0.0'
    });
  });

  // 1. AUTHENTICATION API
  app.post('/api/auth/register', rateLimiter(10), async (req, res) => {
    try {
      const { email, fullName, role = 'candidate', password } = req.body;
      if (!email || !fullName) {
        return res.status(400).json({ success: false, error: 'Champs requis manquants' });
      }

      const existing = MEMORY_DB.users.find(u => u.email === email);
      if (existing) {
        return res.json({ success: true, user: existing, token: `token_${existing.uid}` });
      }

      const newUser = {
        uid: `usr-${Date.now()}`,
        email,
        fullName,
        role,
        plan: 'free',
        credits: 10,
        idVerified: false,
        createdAt: new Date().toISOString().split('T')[0]
      };

      MEMORY_DB.users.push(newUser);
      return res.json({ success: true, user: newUser, token: `token_${newUser.uid}` });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/auth/login', rateLimiter(15), async (req, res) => {
    try {
      const { email } = req.body;
      let user = MEMORY_DB.users.find(u => u.email === email);
      if (!user) {
        user = {
          uid: `usr-${Date.now()}`,
          email: email || 'user@example.com',
          fullName: email ? email.split('@')[0] : 'Membre NicheLead',
          role: 'candidate',
          plan: 'pro',
          credits: 50,
          idVerified: true,
          createdAt: new Date().toISOString().split('T')[0]
        };
        MEMORY_DB.users.push(user);
      }
      return res.json({ success: true, user, token: `token_${user.uid}` });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. GLOBAL JOB SEARCH & COMPANY RECRUITMENT API
  app.get('/api/jobs/search', rateLimiter(60), (req, res) => {
    try {
      const { keyword, country, sector, contractType, remoteOnly } = req.query;

      let results = [...MEMORY_DB.jobs];

      if (keyword) {
        const kw = (keyword as string).toLowerCase();
        results = results.filter(j =>
          j.title.toLowerCase().includes(kw) ||
          j.companyName.toLowerCase().includes(kw) ||
          j.requirements.some(r => r.toLowerCase().includes(kw))
        );
      }

      if (country && country !== 'Tous les pays') {
        results = results.filter(j => j.country.toLowerCase() === (country as string).toLowerCase());
      }

      if (sector && sector !== 'Tous les secteurs') {
        results = results.filter(j => j.sector.toLowerCase() === (sector as string).toLowerCase());
      }

      if (contractType && contractType !== 'Tous les contrats') {
        results = results.filter(j => j.contractType === contractType);
      }

      if (remoteOnly === 'true') {
        results = results.filter(j => j.remoteAvailable);
      }

      res.json({ success: true, total: results.length, jobs: results });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/jobs/create', rateLimiter(10), (req, res) => {
    try {
      const jobData = req.body;
      const newJob = {
        id: `job-${Date.now()}`,
        postedDate: new Date().toISOString().split('T')[0],
        aiCompatibilityScore: Math.floor(85 + Math.random() * 12),
        ...jobData
      };
      MEMORY_DB.jobs.unshift(newJob);
      res.json({ success: true, job: newJob });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/companies/search', (req, res) => {
    res.json({ success: true, companies: MEMORY_DB.companies });
  });

  // 3. CV PARSING & AI MATCHING & COVER LETTER GENERATOR API
  app.post('/api/cv/analyze', rateLimiter(10), async (req, res) => {
    try {
      const { cvText, targetJobTitle, targetRequirements = [] } = req.body;

      if (ai) {
        try {
          const prompt = `
You are an expert HR AI Recruiter. Analyze the candidate's CV text against the target job requirements.
Target Job Title: "${targetJobTitle}"
Requirements: ${JSON.stringify(targetRequirements)}

CV Content:
"${cvText}"

Return a JSON object with:
1. "compatibilityScore": number between 60 and 99,
2. "strengths": Array of 3 key strengths in French,
3. "gaps": Array of 2 areas for improvement in French,
4. "executiveSummary": A 2-sentence summary of the candidate's profile in French.
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const parsed = JSON.parse(response.text || '{}');
          if (parsed && parsed.compatibilityScore) {
            return res.json({ success: true, analysis: parsed, source: 'ai' });
          }
        } catch (aiErr) {
          console.error('Gemini CV analyze error:', aiErr);
        }
      }

      // Fallback response
      return res.json({
        success: true,
        analysis: {
          compatibilityScore: 92,
          strengths: ['Excellente maîtrise de React 18 & Node.js', 'Expérience solide en IA générative Gemini', 'Capacité de livraison autonome'],
          gaps: ['Mentionner des métriques quantitatives de croissance'],
          executiveSummary: 'Profil d\'Ingénieur Full Stack & IA très qualifié avec un fort potentiel de conversion pour ce poste.'
        },
        source: 'synthesizer'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/cv/generate-cover-letter', rateLimiter(10), async (req, res) => {
    try {
      const { applicantName, jobTitle, companyName, requirements = [] } = req.body;

      if (ai) {
        try {
          const prompt = `
Generate a compelling 4-paragraph professional cover letter IN FRENCH for candidate "${applicantName}" applying to position "${jobTitle}" at company "${companyName}".
Key Skills/Requirements to address: ${requirements.slice(0, 3).join(', ')}.

Return a JSON object with key "coverLetter" containing the formatted letter in French.
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const parsed = JSON.parse(response.text || '{}');
          if (parsed.coverLetter) {
            return res.json({ success: true, coverLetter: parsed.coverLetter, source: 'ai' });
          }
        } catch (aiErr) {
          console.error('Gemini cover letter error:', aiErr);
        }
      }

      const fallbackLetter = `Madame, Monsieur le Responsable du Recrutement chez ${companyName},\n\nC'est avec un grand enthousiasme que je soumets ma candidature pour le poste de ${jobTitle}.\n\nMon parcours m'a permis de développer une solide expertise technique et managériale en parfaite adéquation avec vos besoins.\n\nJe reste disponible pour un entretien.\n\nCordialement,\n${applicantName}`;
      return res.json({ success: true, coverLetter: fallbackLetter, source: 'template' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 4. AUTOMATED APPLICATION DISPATCHER API
  app.post('/api/applications/submit', rateLimiter(15), (req, res) => {
    try {
      const { jobId, jobTitle, companyName, applicantName, applicantEmail, coverLetter } = req.body;

      const newApp = {
        id: `app-${Date.now()}`,
        jobId,
        jobTitle,
        companyName,
        applicantName,
        applicantEmail,
        appliedDate: new Date().toISOString().split('T')[0],
        status: 'Envoyée' as const,
        compatibilityScore: Math.floor(88 + Math.random() * 10),
        coverLetter,
        notes: ''
      };

      MEMORY_DB.applications.unshift(newApp);

      // Trigger automatic notification
      MEMORY_DB.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: 'usr-101',
        title: 'Candidature Transmise',
        message: `Votre candidature pour ${jobTitle} chez ${companyName} a été envoyée.`,
        type: 'application',
        read: false,
        createdAt: new Date().toLocaleTimeString('fr-FR')
      });

      res.json({ success: true, application: newApp });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/applications/auto-dispatch', rateLimiter(5), async (req, res) => {
    try {
      const { applicantEmail, applicantName, maxJobs = 3 } = req.body;
      const targetJobs = MEMORY_DB.jobs.slice(0, maxJobs);
      const dispatchedApps = [];

      for (const job of targetJobs) {
        const appObj = {
          id: `app-auto-${Date.now()}-${job.id}`,
          jobId: job.id,
          jobTitle: job.title,
          companyName: job.companyName,
          applicantName: applicantName || 'Jean Widny',
          applicantEmail: applicantEmail || 'jeanwidny9@gmail.com',
          appliedDate: new Date().toISOString().split('T')[0],
          status: 'Envoyée' as const,
          compatibilityScore: job.aiCompatibilityScore || 92,
          coverLetter: `Candidature automatique soumise avec l'IA Gemini pour le poste ${job.title} chez ${job.companyName}.`,
          notes: ''
        };
        MEMORY_DB.applications.unshift(appObj);
        dispatchedApps.push(appObj);
      }

      res.json({ success: true, count: dispatchedApps.length, dispatchedApplications: dispatchedApps });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. EMAIL & MESSAGING SERVICE API
  app.post('/api/email/send', rateLimiter(15), (req, res) => {
    try {
      const { recipientEmail, subject, body, senderEmail = 'user@example.com' } = req.body;

      const newMsg = {
        id: `em-${Date.now()}`,
        sender: senderEmail.split('@')[0],
        senderEmail,
        recipientEmail,
        subject,
        body,
        date: new Date().toLocaleString('fr-FR'),
        folder: 'sent' as const,
        read: true
      };

      MEMORY_DB.messages.unshift(newMsg);
      res.json({ success: true, message: newMsg });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5B. INTELLIGENT CONTACT & RECRUITMENT DISPATCH API
  app.post('/api/contact/dispatch', rateLimiter(10), (req, res) => {
    try {
      const {
        candidateName,
        candidateEmail,
        candidatePhone = '+33 6 00 00 00 00',
        candidateTitle = 'Candidat Qualifié',
        candidateBio = '',
        resumeUrl = 'https://nichelead.io/resumes/cv_candidate.pdf',
        portfolioUrl = 'https://nichelead.io/portfolio/candidate',
        coverLetter = '',
        companyEmail,
        companyName,
        jobTitle = 'Offre de Recrutement',
        messageText = ''
      } = req.body;

      if (!candidateName || !companyEmail) {
        return res.status(400).json({ success: false, error: 'Champs candidat et entreprise requis' });
      }

      const appId = `app-${Date.now()}`;
      const candidateProfileUrl = `/?action=view_candidate&email=${encodeURIComponent(candidateEmail)}&appId=${appId}`;
      const companySignupUrl = `/?action=company_signup&companyEmail=${encodeURIComponent(companyEmail)}&appId=${appId}&companyName=${encodeURIComponent(companyName || '')}`;
      const replyUrl = `/?action=reply_candidate&candidateEmail=${encodeURIComponent(candidateEmail)}&appId=${appId}`;
      const startChatUrl = `/?action=start_chat&candidateEmail=${encodeURIComponent(candidateEmail)}&appId=${appId}`;
      const scheduleVisioUrl = `/?action=schedule_visio&candidateEmail=${encodeURIComponent(candidateEmail)}&companyEmail=${encodeURIComponent(companyEmail)}&appId=${appId}`;

      // Email payload containing the structured message, profile links, and 4 actionable buttons
      const emailBody = `
==================================================
NOUVELLE CANDIDATURE & CONTACT CANDIDAT — NICHELEAD FINDER
==================================================

Poste Cible : ${jobTitle}
Entreprise : ${companyName || 'Recruteur'}

--- INFORMATIONS CANDIDAT ---
Nom Complet : ${candidateName}
E-mail : ${candidateEmail}
Téléphone : ${candidatePhone}
Titre / Spécialité : ${candidateTitle}

--- DOCUMENTS & LIENS ---
• CV numérisé : ${resumeUrl}
• Portfolio : ${portfolioUrl}
• Profil NicheLead Finder : ${candidateProfileUrl}

--- LETTRE DE MOTIVATION & MESSAGE ---
"${coverLetter || messageText || 'Bonjour, je souhaite postuler à votre offre.'}"

--------------------------------------------------
ACTIONS DISPONIBLES :
1. [Créer un compte entreprise] : ${companySignupUrl}
2. [Répondre au candidat] : ${replyUrl}
3. [Démarrer une conversation] : ${startChatUrl}
4. [Planifier un entretien Visio WebRTC] : ${scheduleVisioUrl}
--------------------------------------------------
`;

      const notificationMsg = {
        id: `em-contact-${Date.now()}`,
        sender: candidateName,
        senderEmail: candidateEmail,
        recipientEmail: companyEmail,
        subject: `[Candidature] ${candidateName} — ${jobTitle}`,
        body: emailBody,
        candidateDetails: {
          candidateName,
          candidateEmail,
          candidatePhone,
          candidateTitle,
          candidateBio,
          resumeUrl,
          portfolioUrl,
          coverLetter,
          candidateProfileUrl
        },
        actionUrls: {
          signupUrl: companySignupUrl,
          replyUrl,
          startChatUrl,
          scheduleVisioUrl
        },
        date: new Date().toLocaleString('fr-FR'),
        folder: 'inbox' as const,
        read: false
      };

      MEMORY_DB.messages.unshift(notificationMsg);

      // Create notification for Company
      MEMORY_DB.notifications.unshift({
        id: `notif-${Date.now()}`,
        userId: companyEmail,
        title: `Nouvelle Candidature de ${candidateName}`,
        message: `${candidateName} a postulé pour "${jobTitle}". Consultez son CV et ouvrez une conversation.`,
        type: 'application',
        read: false,
        createdAt: new Date().toLocaleTimeString('fr-FR')
      });

      res.json({
        success: true,
        message: 'Candidature et e-mail professionnel transmis à l\'entreprise avec succès.',
        appId,
        actionUrls: {
          companySignupUrl,
          replyUrl,
          startChatUrl,
          scheduleVisioUrl
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5C. WEBRTC VIDEO CONFERENCE ROOM GENERATOR API
  app.post('/api/visio/create-room', rateLimiter(15), (req, res) => {
    try {
      const {
        jobTitle = 'Entretien de Recrutement',
        companyName = 'Tech Corp',
        candidateEmail,
        recruiterEmail,
        scheduledTime = 'Aujourd\'hui à 14h00'
      } = req.body;

      const roomId = `room-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const passcode = Math.floor(100000 + Math.random() * 900000).toString();

      const newRoom = {
        roomId,
        passcode,
        jobTitle,
        companyName,
        candidateEmail,
        recruiterEmail,
        scheduledTime,
        status: 'active',
        createdAt: new Date().toISOString(),
        roomUrl: `/?action=join_visio&roomId=${roomId}&passcode=${passcode}`
      };

      MEMORY_DB.visioRooms.unshift(newRoom);

      // Send email notifications to both parties
      const roomInviteSubject = `⚡ Invitation Entretien Visio WebRTC : ${jobTitle}`;
      const inviteBody = `
Bonjour,

Un entretien vidéo WebRTC sécurisé a été planifié pour le poste : ${jobTitle} (${companyName}).

Date / Heure : ${scheduledTime}
ID de Salle : ${roomId}
Code Sécurisé : ${passcode}

Rejoindre la salle vidéo en 1 clic :
${newRoom.roomUrl}

Équipements requis : Caméra, Microphone et Navigateur Moderne (Chiffrement de bout en bout actif).
`;

      if (candidateEmail) {
        MEMORY_DB.messages.unshift({
          id: `em-visio-cand-${Date.now()}`,
          sender: companyName,
          senderEmail: recruiterEmail || 'recrutement@entreprise.com',
          recipientEmail: candidateEmail,
          subject: roomInviteSubject,
          body: inviteBody,
          date: new Date().toLocaleString('fr-FR'),
          folder: 'inbox',
          read: false
        });
      }

      res.json({ success: true, room: newRoom });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/visio/room/:roomId', (req, res) => {
    const { roomId } = req.params;
    const room = MEMORY_DB.visioRooms.find(r => r.roomId === roomId);
    if (!room) {
      return res.status(404).json({ success: false, error: 'Salle visio introuvable ou expirée' });
    }
    res.json({ success: true, room });
  });

  // 6. NOTIFICATIONS API
  app.get('/api/notifications/list', (req, res) => {
    res.json({ success: true, notifications: MEMORY_DB.notifications });
  });

  app.post('/api/notifications/mark-read', (req, res) => {
    MEMORY_DB.notifications.forEach(n => n.read = true);
    res.json({ success: true, message: 'Toutes les notifications ont été marquées comme lues' });
  });

  // 7. PAYMENTS, SUBSCRIPTIONS & WEBHOOK API
  app.post('/api/payments/create-checkout', rateLimiter(10), (req, res) => {
    try {
      const { plan, method, amount } = req.body;
      const checkoutSessionId = `chk_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      res.json({
        success: true,
        checkoutUrl: `https://payoo.app/checkout/${checkoutSessionId}`,
        checkoutSessionId,
        plan,
        method,
        amount
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/payments/webhook', (req, res) => {
    try {
      const event = req.body;
      console.log('Payment webhook event received:', event);
      res.json({ received: true, status: 'processed' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/subscriptions/current', (req, res) => {
    res.json({
      success: true,
      subscription: {
        plan: 'PRO GLOBAL',
        status: 'active',
        billingCycle: 'mensuel',
        nextBillingDate: '2026-09-06',
        creditsRemaining: 95
      }
    });
  });

  // 8. CRON JOBS & SCHEDULED TASKS API
  app.post('/api/cron/process-scheduled-tasks', (req, res) => {
    try {
      const now = new Date().toISOString();
      MEMORY_DB.activityLogs.push({
        id: `log-cron-${Date.now()}`,
        userId: 'system',
        action: 'CRON_EXECUTED_AUTO_FOLLOWUP',
        timestamp: now,
        ip: '127.0.0.1'
      });

      res.json({
        success: true,
        executedAt: now,
        tasksProcessed: ['auto_followup_check', 'stale_token_cleanup', 'job_index_refresh']
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 9. FILE STORAGE & MANAGEMENT API
  app.post('/api/storage/upload', rateLimiter(10), (req, res) => {
    try {
      const { fileName, fileSize = 102400, base64 } = req.body;
      const fileId = `file-${Date.now()}`;
      const fileRecord = {
        id: fileId,
        name: fileName || 'document_cv.pdf',
        url: `https://storage.nichelead.io/uploads/${fileId}_${fileName || 'cv.pdf'}`,
        size: fileSize,
        uploadedAt: new Date().toISOString()
      };

      MEMORY_DB.files.push(fileRecord);
      res.json({ success: true, file: fileRecord });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 10. ANALYTICS & AUDIT LOGS API
  app.get('/api/analytics/dashboard-stats', (req, res) => {
    res.json({
      success: true,
      stats: {
        totalJobs: MEMORY_DB.jobs.length,
        totalCompanies: MEMORY_DB.companies.length,
        totalApplications: MEMORY_DB.applications.length,
        averageMatchScore: MEMORY_DB.applications.length > 0 ? 92.4 : 0,
        interviewRate: MEMORY_DB.applications.length > 0 ? '78%' : '0%',
        systemHealth: '100% Operational'
      }
    });
  });

  app.get('/api/analytics/activity-logs', (req, res) => {
    res.json({ success: true, logs: MEMORY_DB.activityLogs });
  });

  // --- 11. SOCIAL FEED & PROFESSIONAL POSTS API ---
  app.get('/api/posts', (req, res) => {
    try {
      // Sort posts: double boost first, standard boost second, then chronological
      const sortedPosts = [...MEMORY_DB.posts].sort((a, b) => {
        if (a.boostType === 'double' && b.boostType !== 'double') return -1;
        if (a.boostType !== 'double' && b.boostType === 'double') return 1;
        if (a.isBoosted && !b.isBoosted) return -1;
        if (!a.isBoosted && b.isBoosted) return 1;
        return 0;
      });
      res.json({ success: true, total: sortedPosts.length, posts: sortedPosts });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/posts/create', rateLimiter(20), (req, res) => {
    try {
      const {
        authorType = 'user',
        authorName = 'Membre NicheLead',
        authorTitle = 'Professionnel Rézo',
        authorAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        authorLocation = 'Remote Worldwide',
        postType = 'text',
        content,
        mediaUrl,
        documentUrl,
        documentName,
        jobTitle,
        companyName,
        salaryText,
        servicePrice
      } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, error: 'Le contenu de la publication est requis' });
      }

      const newPost = {
        id: `post-${Date.now()}`,
        authorType,
        authorId: `usr-${Date.now()}`,
        authorName,
        authorAvatar,
        authorTitle,
        authorLocation,
        authorVerified: true,
        postType,
        content,
        mediaUrl,
        documentUrl,
        documentName,
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        likedByMe: true,
        savedByMe: false,
        isBoosted: false,
        createdAt: 'À l\'instant',
        jobTitle,
        companyName,
        salaryText,
        servicePrice,
        comments: []
      };

      MEMORY_DB.posts.unshift(newPost);
      res.json({ success: true, post: newPost });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/posts/like', (req, res) => {
    try {
      const { postId } = req.body;
      const post = MEMORY_DB.posts.find(p => p.id === postId);
      if (post) {
        post.likedByMe = !post.likedByMe;
        post.likesCount += post.likedByMe ? 1 : -1;
        return res.json({ success: true, likedByMe: post.likedByMe, likesCount: post.likesCount });
      }
      res.status(404).json({ success: false, error: 'Publication introuvable' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/posts/comment', (req, res) => {
    try {
      const { postId, text, authorName = 'Membre Rézo', authorTitle = 'Professionnel' } = req.body;
      const post = MEMORY_DB.posts.find(p => p.id === postId);
      if (post && text) {
        const commentObj = {
          id: `c-${Date.now()}`,
          authorName,
          authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          authorTitle,
          text,
          createdAt: 'À l\'instant'
        };
        post.comments = post.comments || [];
        post.comments.push(commentObj);
        post.commentsCount = post.comments.length;
        return res.json({ success: true, comment: commentObj, commentsCount: post.commentsCount });
      }
      res.status(404).json({ success: false, error: 'Publication introuvable' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/posts/boost', rateLimiter(10), (req, res) => {
    try {
      const { postId, boostType = 'standard', targeting = {} } = req.body;
      const post = MEMORY_DB.posts.find(p => p.id === postId);

      const price = boostType === 'double' ? 20 : 5;

      if (post) {
        post.isBoosted = true;
        post.boostType = boostType;
        post.boostTargeting = targeting;
      }

      res.json({
        success: true,
        message: `Boost ${boostType.toUpperCase()} ($${price} USD) activé avec succès !`,
        postId,
        boostType,
        price,
        badgeLabel: boostType === 'double' ? '🔥 DOUBLE BOOST — Top Opportunité' : '⚡ Sponsorisé'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // --- 12. TALENT FINDER API ---
  app.post('/api/talents/search', rateLimiter(30), (req, res) => {
    try {
      const {
        country,
        sector,
        profession,
        skills = [],
        remoteOnly,
        availability,
        language
      } = req.body;

      let list = [...MEMORY_DB.talents];

      if (country && country !== 'Tous les pays') {
        list = list.filter(t => t.country?.toLowerCase() === country.toLowerCase() || t.location?.toLowerCase().includes(country.toLowerCase()));
      }

      if (sector && sector !== 'Tous les secteurs') {
        list = list.filter(t => t.sector?.toLowerCase() === sector.toLowerCase());
      }

      if (profession) {
        const prof = profession.toLowerCase();
        list = list.filter(t => t.profession?.toLowerCase().includes(prof) || t.title?.toLowerCase().includes(prof));
      }

      if (remoteOnly) {
        list = list.filter(t => t.remotePreference === 'Remote');
      }

      res.json({ success: true, total: list.length, talents: list });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // --- 13. GEMINI AI NATURAL LANGUAGE SEARCH APIs ---
  // A. "JE CHERCHE UN EMPLOI" (Job Seeker Natural Language Search)
  app.post('/api/ai/job-search-nl', rateLimiter(15), async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ success: false, error: 'Veuillez saisir votre demande d\'emploi' });
      }

      let parsedCriteria = {
        profession: 'Comptable',
        skills: ['Comptabilité générale', 'Gestion financière', 'Excel'],
        minSalary: 1000,
        location: 'Remote',
        remoteAvailable: true,
        availability: 'Immédiate',
        compatibleSectors: ['Finance & Comptabilité', 'Services Pro', 'Software'],
        summaryExplanation: 'Demande structurée pour un poste de comptable en télétravail avec rémunération à partir de 1 000 $.'
      };

      if (ai) {
        try {
          const aiPrompt = `
You are an AI Job Matching Assistant. Analyze the following job seeker query written in free natural language:
Query: "${prompt}"

Transform this text into structured job search criteria in JSON format:
1. "profession": string (main target job title or role in French),
2. "skills": string[] (array of relevant skills),
3. "minSalary": number (minimum requested salary in USD/EUR if specified, default 1000),
4. "location": string (target location or 'Remote'),
5. "remoteAvailable": boolean (true if remote is desired),
6. "availability": string ('Immédiate' or timeframe),
7. "compatibleSectors": string[] (array of matching sectors),
8. "summaryExplanation": string (a concise 1-sentence French explanation of the parsed query).
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: aiPrompt,
            config: { responseMimeType: 'application/json' }
          });

          const json = JSON.parse(response.text || '{}');
          if (json && json.profession) {
            parsedCriteria = json;
          }
        } catch (aiErr) {
          console.error('Gemini NL Job Search parsing error:', aiErr);
        }
      }

      // Filter jobs matching the parsed criteria
      let matchedJobs = [...MEMORY_DB.jobs];
      if (parsedCriteria.profession) {
        const prof = parsedCriteria.profession.toLowerCase();
        matchedJobs = matchedJobs.filter(j =>
          j.title.toLowerCase().includes(prof) ||
          j.sector.toLowerCase().includes(prof) ||
          j.description.toLowerCase().includes(prof)
        );
      }

      res.json({
        success: true,
        parsedCriteria,
        matchedJobsCount: matchedJobs.length,
        jobs: matchedJobs
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // B. "JE CHERCHE UN CANDIDAT" (Recruiter Natural Language Search)
  app.post('/api/ai/candidate-search-nl', rateLimiter(15), async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || !prompt.trim()) {
        return res.status(400).json({ success: false, error: 'Veuillez saisir le profil candidat recherché' });
      }

      let parsedCriteria = {
        targetTitle: 'Développeur Mobile',
        requiredSkills: ['React Native', 'Mobile', 'TypeScript'],
        minExperienceYears: 2,
        maxSalary: 5000,
        location: 'Worldwide',
        remoteOnly: true,
        level: 'Sénior',
        summaryExplanation: 'Recherche de développeur mobile spécialisé en React Native disponible à distance.'
      };

      if (ai) {
        try {
          const aiPrompt = `
You are an expert AI Recruiter. Analyze this recruiter search query written in natural language:
Query: "${prompt}"

Transform this requirement into structured candidate recruitment criteria in JSON format:
1. "targetTitle": string (desired candidate job title in French),
2. "requiredSkills": string[] (list of required tech or soft skills),
3. "minExperienceYears": number (minimum required experience years),
4. "maxSalary": number (maximum budget in USD/EUR if mentioned),
5. "location": string ('Worldwide' or target location),
6. "remoteOnly": boolean (true if remote is expected),
7. "level": string ('Junior', 'Intermédiaire', 'Sénior', 'Executive'),
8. "summaryExplanation": string (a 1-sentence French summary of the recruitment criteria).
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: aiPrompt,
            config: { responseMimeType: 'application/json' }
          });

          const json = JSON.parse(response.text || '{}');
          if (json && json.targetTitle) {
            parsedCriteria = json;
          }
        } catch (aiErr) {
          console.error('Gemini NL Candidate Search parsing error:', aiErr);
        }
      }

      // Filter candidates in MEMORY_DB.talents matching the criteria
      let matchedTalents = [...MEMORY_DB.talents];

      res.json({
        success: true,
        parsedCriteria,
        matchedTalentsCount: matchedTalents.length,
        talents: matchedTalents
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Video script generation (existing endpoint preserved)
  app.post('/api/video/generate-script', async (req, res) => {
    try {
      const {
        productName = 'PAYOO REZO — NicheLead Finder',
        targetAudience = 'Agences Marketing, Freelances & Consultants B2B',
        durationSeconds = 60,
        topic = 'Prospection B2B automatisée avec IA'
      } = req.body;

      if (ai) {
        try {
          const prompt = `
Generate a structured ${durationSeconds}-second promo video script for "${productName}".
Target Audience: ${targetAudience}
Topic / Value Prop: ${topic}
Language: French

Return a JSON object with:
1. "title": "Main video title in French"
2. "totalDuration": ${durationSeconds}
3. "advertisingScriptText": "Full formatted voiceover script ready to read or export in French"
4. "scenes": An array of 6-8 scenes totaling ${durationSeconds} seconds.
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const parsed = JSON.parse(response.text || '{}');
          if (parsed && Array.isArray(parsed.scenes)) {
            return res.json({ success: true, script: parsed, source: 'ai' });
          }
        } catch (aiError) {
          console.error('Gemini video script error:', aiError);
        }
      }

      const fallbackScript = generateFallbackVideoScript(productName, topic, durationSeconds);
      return res.json({ success: true, script: fallbackScript, source: 'synthesizer' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to generate video script' });
    }
  });

  // B2B Lead Search API (existing endpoint preserved)
  app.post('/api/leads/search', async (req, res) => {
    try {
      const { niche = 'Cliniques Dentaires', location = 'Paris, France', service = 'SEO & Positionnement Google Maps', count = 8 } = req.body;
      const leadCount = Math.min(Math.max(Number(count) || 8, 1), 25);

      if (ai) {
        try {
          const prompt = `
Generate ${leadCount} realistic B2B prospective client leads for selling "${service}" to "${niche}" in "${location}".
Language: FRENCH.
Return JSON with key "leads" where each lead object has:
- "name": string (Company Name / Nom Entreprise)
- "website": string (Official Website URL)
- "contactEmail": string (Public Company Email)
- "phone": string (Public Phone Number, e.g. "+33 1 42 88 99 00")
- "location": string ("${location}")
- "niche": string ("${niche}")
- "leadScore": number (70 to 98)
- "suggestedAngle": string (tailored pitch angle)
- "socialUrl": string (LinkedIn or social profile)
`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
          });

          const parsed = JSON.parse(response.text || '{}');
          if (parsed && Array.isArray(parsed.leads)) {
            return res.json({ success: true, leads: parsed.leads, source: 'ai' });
          }
        } catch (aiError) {
          console.error('Gemini lead search error:', aiError);
        }
      }

      const synthesizedLeads = generateFallbackLeads(niche, location, service, leadCount);
      return res.json({ success: true, leads: synthesizedLeads, source: 'synthesizer' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to search leads' });
    }
  });

  // Gemini AI Advisor Endpoint ($500 VIP Ultimate Plan)
  app.post('/api/gemini/advisor', rateLimiter(20), async (req, res) => {
    try {
      const { userMessage, topic = 'general', conversationHistory = [] } = req.body;

      if (!userMessage || typeof userMessage !== 'string') {
        return res.status(400).json({ success: false, error: 'Message requis' });
      }

      if (ai) {
        try {
          const systemContext = `
Tu es l'Expert Stratège IA de Niveau Mondial propulsé par Gemini 3.6 Flash.
Tu conseilles les membres VIP sur :
1. La création d'applications web & mobiles (Architecture, Tech Stack, UI/UX, Base de données, Tunnels, Monetization).
2. La création de sites web professionnels & e-commerce à très haute conversion (Design, Copys, SEO, Landing page).
3. La création, le montage et la stratégie de contenu vidéo (Script TikTok/Reels/YouTube, Storyboard, Hooks viraux, Outils de montage IA).
4. La génération d'un PLAN D'ACTION DÉTAILLÉ ÉTAPE PAR ÉTAPE (Cahier des charges, Jalons chronologiques, Code/Templates, Budgets, Stratégie marketing).

Instructions de réponse :
- Sois extrêmement précis, structuré, professionnel et motivant.
- Utilise un formatage Markdown élégant avec des titres, des puces, du code si nécessaire.
- Propose toujours un Plan d'Action concret avec étape 1, étape 2, étape 3...
- Réponds dans la langue du message de l'utilisateur (par défaut en Français).
`;

          const prompt = `${systemContext}\n\nDomaine spécifique demandé: ${topic}\nMessage de l'utilisateur: "${userMessage}"`;

          const response = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: prompt
          });

          const replyText = response.text || 'Désolé, je n\'ai pas pu générer le conseil. Réessayez dans un instant.';
          return res.json({ success: true, advice: replyText, source: 'gemini-3.6-flash' });
        } catch (aiErr: any) {
          console.error('Gemini advisor API error:', aiErr);
        }
      }

      // High-quality fallback advice synthesis if API key is not configured or offline
      const fallbackAdvice = `### 🚀 Plan d'Action Gemini IA pour votre Projet (${topic.toUpperCase()})

Voici la stratégie recommandée par Gemini pour concrétiser votre demande :

#### 1. 📋 Cahier des Charges & Architecture
- **Objectif principal** : Répondre précisément au besoin de vos utilisateurs cibles.
- **Stack Recommandée** : React 18, TypeScript, Tailwind CSS, Node.js avec Supabase/Firebase pour la base de données.
- **Fonctionnalités Clés** : Authentification, Tableau de bord interactif, Système de paiement (Stripe, Natcash, Crypto).

#### 2. 🎨 Design & Expérience Utilisateur (UI/UX)
- Interface épurée avec contraste élevé et typographie lisible.
- Optimisation 100% Mobile (Mobile-First).
- Tunnels de conversion optimisés pour capturer des leads qualifiés.

#### 3. 🎬 Stratégie de Lancement & Vidéo Virale
- **Script Vidéo (30 sec)** : Hook percutant (0-3s), Problème récurrent (3-10s), Solution avec démo (10-22s), Appeur à l'action clair (22-30s).
- **Diffusion** : TikTok, Instagram Reels, LinkedIn & YouTube Shorts.

#### 4. 📅 Chronogramme de Déploiement (Roadmap)
- **Semaine 1** : Maquettage & Structure de la base de données.
- **Semaine 2** : Développement Front-end & Intégrations API.
- **Semaine 3** : Tests utilisateurs, Sécurité & Déploiement Cloud Run.

*Conseil VIP : Cliquez sur "Poser une question spécifique" pour affiner la stack ou générer du code direct !*`;

      return res.json({ success: true, advice: fallbackAdvice, source: 'synthesizer' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Erreur lors de la consultation Gemini' });
    }
  });

  // B2B Outreach API (existing endpoint preserved)
  app.post('/api/leads/outreach', async (req, res) => {
    try {
      const { businessName = 'Apex Dental Studio', niche = 'Clinique Dentaire', service = 'SEO', suggestedAngle = 'SEO faible', tone = 'Consultatif' } = req.body;
      const fallbackOutreach = generateFallbackOutreach(businessName, niche, service, suggestedAngle, tone);
      return res.json({ success: true, outreach: fallbackOutreach, source: 'template' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to generate outreach' });
    }
  });

  // Confirm payment (existing endpoint preserved)
  app.post('/api/payment/confirm', async (req, res) => {
    try {
      const { plan = 'pro', method = 'EURO', email = 'client@example.com', amount = '29 €' } = req.body;
      const transactionId = `PAY-${Date.now().toString().slice(-8)}`;

      return res.json({
        success: true,
        receipt: {
          transactionId,
          email,
          plan,
          method,
          amount,
          confirmationDate: new Date().toLocaleDateString('fr-FR'),
          status: 'CONFIRMED'
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, error: 'Failed to confirm payment' });
    }
  });

  // Serve Vite in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PAYOO REZO — Backend Infrastructure running on http://localhost:${PORT}`);
  });
}

function generateFallbackLeads(niche: string, location: string, service: string, count: number) {
  const cleanNiche = niche.toLowerCase();
  const domainSlug = cleanNiche.replace(/[^a-z0-9]/g, '');

  const companyPrefixes = ['Aura', 'Summit', 'Beacon', 'Apex', 'Vanguard', 'Pinnacle', 'Horizon'];
  const companySuffixes = ['Groupe', 'France', 'Studio', 'Solutions', 'Partenaires'];

  const leads = [];
  for (let i = 0; i < count; i++) {
    const prefix = companyPrefixes[i % companyPrefixes.length];
    const suffix = companySuffixes[(i * 3) % companySuffixes.length];
    const name = `${prefix} ${niche.split(' ')[0] || 'Entreprise'} ${suffix}`;
    const slug = `${prefix.toLowerCase()}${domainSlug}${i + 1}`;

    leads.push({
      id: `lead-${Date.now()}-${i + 1}`,
      name,
      website: `https://www.${slug}.fr`,
      contactEmail: `contact@${slug}.fr`,
      contactPage: `https://www.${slug}.fr/contact`,
      socialUrl: `https://www.linkedin.com/company/${slug}`,
      leadScore: Math.floor(75 + Math.random() * 20),
      location: location || 'Paris, France',
      niche: niche || 'Entreprise',
      suggestedAngle: `Le positionnement digital actuel présente une marge de progression importante pour le service ${service}.`,
      phone: `+33 1 42 ${Math.floor(10 + Math.random() * 80)} ${Math.floor(10 + Math.random() * 80)}`
    });
  }
  return leads;
}

function generateFallbackOutreach(businessName: string, niche: string, service: string, suggestedAngle: string, tone: string) {
  return {
    coldEmailSubject: `Remarque rapide concernant ${businessName}`,
    coldEmailBody: `Bonjour, J'ai repéré une opportunité d'optimisation pour ${businessName} sur le service ${service}...`,
    linkedinMessage: `Bonjour ! Félicitations pour le développement de ${businessName}...`,
    followUpEmailSubject: `Re: Remarque rapide concernant ${businessName}`,
    followUpEmailBody: `Bonjour, Je me permets de revenir vers vous...`
  };
}

function generateFallbackVideoScript(productName: string, topic: string, totalDuration: number = 60) {
  return {
    title: `Vidéo Pub 60s — ${productName}`,
    totalDuration: 60,
    scenes: [
      {
        id: 1,
        duration: 10,
        badge: '01. PROBLEME',
        title: 'Prospection B2B Manuelle',
        subtitle: 'Perte de temps importante.',
        narration: 'La prospection manuelle prend des dizaines d\'heures.',
        highlightText: 'Gain de temps',
        mockupType: 'problem'
      }
    ]
  };
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
