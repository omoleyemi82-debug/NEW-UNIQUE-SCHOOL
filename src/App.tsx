import React, { useState, useEffect } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import LandingPage from './components/LandingPage';
import LoginPortalPage from './components/LoginPortalPage';
import SetupPortal from './components/SetupPortal';

function AppContent() {
  const { currentRole, setRole, admins } = useSchool();

  // Auto-logout after 5 minutes of inactivity for logged-in users
  useEffect(() => {
    if (currentRole === 'guest') return;

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
  }, [currentRole, setRole]);

  // If no administrators are registered, enforce First System Setup immediately!
  if (admins.length === 0) {
    return <SetupPortal />;
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
