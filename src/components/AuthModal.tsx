import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import {
  auth,
  googleProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  User
} from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (user: User, isNewSignUp?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !email.includes('@')) {
      setErrorMsg('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMsg('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    if (mode === 'signup' && !displayName.trim()) {
      setErrorMsg('Veuillez renseigner votre nom complet.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        if (displayName.trim()) {
          await updateProfile(userCred.user, { displayName: displayName.trim() });
        }
        setSuccessMsg('Compte créé avec succès ! Bienvenue sur PAYOO REZO.');
        setTimeout(() => {
          onAuthSuccess(userCred.user, true);
          onClose();
        }, 1000);
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email.trim(), password);
        setSuccessMsg('Connexion réussie !');
        setTimeout(() => {
          onAuthSuccess(userCred.user, false);
          onClose();
        }, 800);
      }
    } catch (err: any) {
      console.error('Firebase Auth error:', err);
      let message = 'Une erreur est survenue lors de l\'authentification.';
      if (err.code === 'auth/email-already-in-use') {
        message = 'Cette adresse e-mail est déjà utilisée. Essayez de vous connecter.';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = 'E-mail ou mot de passe incorrect.';
      } else if (err.code === 'auth/weak-password') {
        message = 'Le mot de passe est trop faible.';
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setSuccessMsg('Connexion Google réussie !');
      setTimeout(() => {
        onAuthSuccess(res.user, false);
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('La fenêtre Google s\'est fermée. Vous pouvez utiliser l\'inscription par e-mail.');
      } else {
        setErrorMsg('Connexion Google non disponible. Utilisez l\'inscription e-mail ci-dessous.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Demo Sign in
      const demoEmail = 'prospecteur.pro@payoorezo.com';
      const demoPass = 'PayooRezo2026!';
      try {
        const userCred = await signInWithEmailAndPassword(auth, demoEmail, demoPass);
        onAuthSuccess(userCred.user, false);
        onClose();
      } catch {
        const userCred = await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
        await updateProfile(userCred.user, { displayName: 'Membre Pro Démo' });
        onAuthSuccess(userCred.user, true);
        onClose();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Impossible d\'activer le compte démo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setSuccessMsg('Déconnexion effectuée.');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold tracking-wider uppercase text-blue-200 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/20">
              PAYOO REZO
            </span>
            <span className="text-xs text-blue-200 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Authentification Sécurisée
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-white">
            {currentUser
              ? 'Mon Compte'
              : mode === 'signup'
              ? 'Inscription Gratuite'
              : 'Connexion à votre espace'}
          </h3>
          <p className="text-xs text-blue-100/90 mt-1">
            {currentUser
              ? 'Gérez vos accès et synchronisez vos prospects enregistrés.'
              : 'Accédez à votre générateur de leads IA et vos exports CSV.'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {currentUser ? (
            /* Logged in state */
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-700 font-black text-2xl flex items-center justify-center mx-auto border-2 border-blue-200 shadow-md">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-lg">
                  {currentUser.displayName || 'Utilisateur PAYOO REZO'}
                </h4>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{currentUser.email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Compte Vérifié & Actif
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
                <p className="font-bold text-slate-800">Inclus dans votre session :</p>
                <ul className="space-y-1 text-slate-600">
                  <li className="flex items-center gap-1.5">✓ Recherche prioritaire de prospects B2B</li>
                  <li className="flex items-center gap-1.5">✓ Sauvegarde cloud synchronisée</li>
                  <li className="flex items-center gap-1.5">✓ Générateur de messages de prospection IA</li>
                </ul>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-md"
              >
                Se Déconnecter
              </button>
            </div>
          ) : (
            /* Auth Form (SignIn / SignUp) */
            <div>
              {/* Mode Switch Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'signup'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-4 h-4" /> Inscription
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    mode === 'signin'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-4 h-4" /> Connexion
                </button>
              </div>

              {/* Status Alert Messages */}
              {errorMsg && (
                <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom complet / Entreprise :
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Ex: Marc Dupont"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors font-medium"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Adresse e-mail :
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mot de passe :
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-blue-600 focus:outline-none transition-colors font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="inline-block animate-spin text-sm">⏳</span>
                  ) : mode === 'signup' ? (
                    <>
                      <UserPlus className="w-4 h-4" /> Créer mon Compte Gratuit
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" /> Se Connecter
                    </>
                  )}
                </button>
              </form>

              {/* Social or Quick Demo login divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">ou accès rapide</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.15C3.26 21.3 7.37 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.39l3.99-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.61l3.99 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
                    />
                  </svg>
                  Continuer avec Google
                </button>

                <button
                  type="button"
                  onClick={handleDemoSignIn}
                  disabled={loading}
                  className="w-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  Connexion Démo Instantanée (Sans Saisie)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
