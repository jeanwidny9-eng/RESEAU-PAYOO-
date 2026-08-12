import React, { useState } from 'react';
import { PayooUser, PayooVideo, PayooSupporter } from './types';
import {
  INITIAL_PAYOO_USER,
  INITIAL_PAYOO_VIDEOS,
  INITIAL_PAYOO_LIVE,
  INITIAL_PAYOO_SUPPORTERS,
  INITIAL_PAYOO_PRODUCTS
} from './data/samplePayooData';

import { PayooHeader } from './components/PayooHeader';
import { PayooBottomNav } from './components/PayooBottomNav';
import { PayooVideoFeed } from './components/PayooVideoFeed';
import { PayooLiveStreamView } from './components/PayooLiveStream';
import { PayooSupportersHub } from './components/PayooSupportersHub';
import { PayooCreatorHub } from './components/PayooCreatorHub';
import { PayooMarketplace } from './components/PayooMarketplace';
import { PayooUserProfile } from './components/PayooUserProfile';
import { PayooAuthModal } from './components/PayooAuthModal';

export function App() {
  const [currentNav, setCurrentNav] = useState<string>('feed');
  const [currentUser, setCurrentUser] = useState<PayooUser>(INITIAL_PAYOO_USER);
  const [videos, setVideos] = useState<PayooVideo[]>(INITIAL_PAYOO_VIDEOS);
  const [supporters, setSupporters] = useState<PayooSupporter[]>(INITIAL_PAYOO_SUPPORTERS);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  // Handle sending tips to creator
  const handleSendTip = (videoId: string, amountHTG: number) => {
    setVideos(prev =>
      prev.map(v =>
        v.id === videoId ? { ...v, earningsHTG: v.earningsHTG + amountHTG } : v
      )
    );
  };

  // Handle adding new supporter contribution
  const handleAddSupporter = (record: Omit<PayooSupporter, 'id' | 'date' | 'tierBadge'>) => {
    let tierBadge = 'Supporteur Bronze';
    if (record.amountHTG >= 1000000) tierBadge = 'Visionnaire Ayiti';
    else if (record.amountHTG >= 500000) tierBadge = 'Patron Diamant';
    else if (record.amountHTG >= 100000) tierBadge = 'Platinum';
    else if (record.amountHTG >= 50000) tierBadge = 'Gold';

    const newSupporter: PayooSupporter = {
      ...record,
      id: `sup-${Date.now()}`,
      tierBadge,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setSupporters([newSupporter, ...supporters]);

    // Update current user if this is their contribution
    setCurrentUser(prev => ({
      ...prev,
      isSupporter: true,
      supporterTier: tierBadge,
      totalContributionHTG: (prev.totalContributionHTG || 0) + record.amountHTG
    }));
  };

  const handleLoginSuccess = (email: string, name: string) => {
    setCurrentUser(prev => ({
      ...prev,
      email,
      name,
      username: name.toLowerCase().replace(/\s+/g, '')
    }));
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-white flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Header Bar */}
      <PayooHeader
        currentUser={currentUser}
        currentNav={currentNav}
        onNavigate={setCurrentNav}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-16">
        {currentNav === 'feed' && (
          <PayooVideoFeed
            videos={videos}
            currentUser={currentUser}
            onSendTip={handleSendTip}
            onNavigate={setCurrentNav}
          />
        )}

        {currentNav === 'live' && (
          <PayooLiveStreamView
            streams={INITIAL_PAYOO_LIVE}
            onNavigate={setCurrentNav}
          />
        )}

        {currentNav === 'supporters' && (
          <PayooSupportersHub
            supporters={supporters}
            currentUser={currentUser}
            onAddSupporter={handleAddSupporter}
          />
        )}

        {currentNav === 'creator' && (
          <PayooCreatorHub
            currentUser={currentUser}
            onNavigate={setCurrentNav}
          />
        )}

        {currentNav === 'marketplace' && (
          <PayooMarketplace products={INITIAL_PAYOO_PRODUCTS} />
        )}

        {currentNav === 'profile' && (
          <PayooUserProfile user={currentUser} onNavigate={setCurrentNav} />
        )}
      </main>

      {/* Bottom Floating Navigation */}
      <PayooBottomNav currentNav={currentNav} onNavigate={setCurrentNav} />

      {/* Auth Modal */}
      <PayooAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
