'use client';

import { useEffect } from 'react';
import LoginForm from "./_components/login-form";

export default function LoginPage() {
  useEffect(() => {
    console.log('[Page Render] LoginPage rendered.');
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <LoginForm />
    </main>
  );
}
