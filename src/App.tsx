import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import LandingPage from './components/LandingPage';
import LoginModal from './components/LoginModal';

function AppContent() {
  const { currentRole, setRole } = useSchool();
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

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
