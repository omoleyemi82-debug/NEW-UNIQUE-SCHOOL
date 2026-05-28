/**
 * Security and Auth Utilities for School Management Portal
 */

// Simple robust string hashing/obfuscation for mock password encryption in localStorage
export function encryptPassword(password: string): string {
  if (!password) return '';
  // Convert to simple secure-looking hash/base64-based cipher
  const clean = password.trim();
  let result = '';
  // A simple salt cipher
  for (let i = 0; i < clean.length; i++) {
    result += String.fromCharCode(clean.charCodeAt(i) ^ 42); // simple XOR
  }
  return btoa(result);
}

// Check if a plain password matches the encrypted password
export function verifyPassword(plain: string, encrypted: string): boolean {
  return encryptPassword(plain) === encrypted;
}

// Helper to auto-generate usernames
export function generateUsername(role: 'teacher' | 'parent' | 'student' | 'admin', name: string, subjectOrClass?: string): string {
  const cleanName = name.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
  const firstName = name.split(' ')[0]?.toLowerCase() || 'user';
  
  if (role === 'teacher') {
    const subject = (subjectOrClass || 'subject').toLowerCase().split(' ')[0] || 'staff';
    return `${firstName}.${subject}`;
  }
  
  if (role === 'parent') {
    return `parent-${firstName}`;
  }
  
  if (role === 'student') {
    const classAbbr = (subjectOrClass || 'SS1').toUpperCase().replace(/\s/g, '');
    const randomNum = String(Math.floor(100 + Math.random() * 900));
    return `${classAbbr}-${randomNum}`;
  }
  
  return `admin-${firstName}`;
}

// Auto-generate helper for strong random temporary passwords
export function generatePassword(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
  let pass = '';
  for (let i = 0; i < 10; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

// Interface for login session/activity tracking
export interface LoginActivity {
  id: string;
  userId: string;
  username: string;
  role: string;
  timestamp: string;
  ip: string;
  browser: string;
  status: 'SUCCESS' | 'FAILED' | 'LOCKED' | 'PASSWORD_RESET';
  details?: string;
}

// Generate basic simulated telemetry to make activity logs beautiful
export function createSimulatedActivity(username: string, role: string, status: 'SUCCESS' | 'FAILED' | 'PASSWORD_RESET', details?: string): Omit<LoginActivity, 'id'> {
  const ips = ['192.168.1.104', '102.89.43.12', '197.210.8.156', '41.190.3.45', '127.0.0.1'];
  const browsers = [
    'Chrome v124.0 (Windows NT 10.0)',
    'Safari v17.4 (Macintosh OS X)',
    'Firefox v125.0 (Ubuntu Linux)',
    'Chrome Mobile (iOS)'
  ];
  return {
    userId: username || 'unknown',
    username: username || 'Anonymous',
    role: role || 'guest',
    timestamp: new Date().toISOString(),
    ip: ips[Math.floor(Math.random() * ips.length)] || '127.0.0.1',
    browser: browsers[Math.floor(Math.random() * browsers.length)] || 'Chrome v124.0',
    status,
    details
  };
}
