import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import LandingPage from './components/LandingPage';
import LoginPortalPage from './components/LoginPortalPage';
import SetupPortal from './components/SetupPortal';

function AppContent() {
  const { currentRole, setRole, admins, loading } = useSchool();

  // Auto-logout after 5 minutes of inactivity for logged-in users
  useEffect(() => {
    if (loading || currentRole === 'guest') return;

    let timeoutId: any;
    const INACTIVITY_TIME = 5 * 60 * 1000; // 5 minutes inactivity limit

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setRole('guest', 'guest');
        console.log('Session expired due to user inactivity.');
      }, INACTIVITY_TIME);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(ev => {
      window.addEventListener(ev, resetTimer);
    });

    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(ev => {
        window.removeEventListener(ev, resetTimer);
      });
    };
  }, [loading, currentRole, setRole]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="space-y-4 text-center">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 font-mono text-sm animate-pulse">
            Connecting to NEW UNIQUE ACADEMY Secure Records...
          </p>
        </div>
      </div>
    );
  }

  // Display only the login portal if user is guest/unauthenticated
  if (currentRole === 'guest') {
    return <LoginPortalPage onSuccess={() => {}} />;
  }

  // Otherwise, user is authenticated: render corresponding portal panel (handled neatly inside LandingPage)
  return (
    <LandingPage onLoginClick={() => {}} />
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
