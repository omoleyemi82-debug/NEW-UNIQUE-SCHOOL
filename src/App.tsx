import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';
import SetupPortal from './components/SetupPortal';

function AppContent() {
  const { currentRole, setRole, admins } = useSchool();
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  // If no administrators are registered, enforce First System Setup immediately!
  if (admins.length === 0) {
    return <SetupPortal />;
  }

  return (
    <>
      <LandingPage onLoginClick={() => setIsLoginOpen(true)} />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={() => {}}
      />
    </>
  );
}

export default function App() {
  return (
    <SchoolProvider>
      <AppContent />
    </SchoolProvider>
  );
}
