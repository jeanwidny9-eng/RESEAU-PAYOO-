// Client Helper Library connecting to Server-side REST & AI APIs

export interface APIResponse<T = any> {
  success: boolean;
  error?: string;
  [key: string]: any;
}

// 1. Auth API Helpers
export async function apiRegisterUser(email: string, fullName: string, role: string = 'candidate') {
  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName, role })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function apiLoginUser(email: string) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 2. Job Search & Recruitment API Helpers
export async function apiSearchJobs(filters: { keyword?: string; country?: string; sector?: string; contractType?: string; remoteOnly?: boolean }) {
  try {
    const params = new URLSearchParams();
    if (filters.keyword) params.append('keyword', filters.keyword);
    if (filters.country) params.append('country', filters.country);
    if (filters.sector) params.append('sector', filters.sector);
    if (filters.contractType) params.append('contractType', filters.contractType);
    if (filters.remoteOnly) params.append('remoteOnly', 'true');

    const res = await fetch(`/api/jobs/search?${params.toString()}`);
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 3. CV Analysis & AI Cover Letter
export async function apiAnalyzeCV(cvText: string, targetJobTitle: string, targetRequirements: string[] = []) {
  try {
    const res = await fetch('/api/cv/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cvText, targetJobTitle, targetRequirements })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function apiGenerateCoverLetter(applicantName: string, jobTitle: string, companyName: string, requirements: string[] = []) {
  try {
    const res = await fetch('/api/cv/generate-cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantName, jobTitle, companyName, requirements })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 4. Job Applications & Auto Dispatch
export async function apiSubmitApplication(appData: { jobId: string; jobTitle: string; companyName: string; applicantName: string; applicantEmail: string; coverLetter: string }) {
  try {
    const res = await fetch('/api/applications/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function apiAutoDispatchApplications(applicantEmail: string, applicantName: string, maxJobs: number = 3) {
  try {
    const res = await fetch('/api/applications/auto-dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicantEmail, applicantName, maxJobs })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 5. Email & Messaging
export async function apiSendEmail(recipientEmail: string, subject: string, body: string, senderEmail?: string) {
  try {
    const res = await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipientEmail, subject, body, senderEmail })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function apiDispatchContact(data: {
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  candidateTitle?: string;
  candidateBio?: string;
  resumeUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  companyEmail: string;
  companyName?: string;
  jobTitle?: string;
  messageText?: string;
}) {
  try {
    const res = await fetch('/api/contact/dispatch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function apiCreateVisioRoom(data: {
  jobTitle?: string;
  companyName?: string;
  candidateEmail?: string;
  recruiterEmail?: string;
  scheduledTime?: string;
}) {
  try {
    const res = await fetch('/api/visio/create-room', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 6. Notifications API
export async function apiFetchNotifications() {
  try {
    const res = await fetch('/api/notifications/list');
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// 7. Analytics & System Stats API
export async function apiFetchDashboardStats() {
  try {
    const res = await fetch('/api/analytics/dashboard-stats');
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
