'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const router = useRouter();

  const handleLogin = () => {
    // MVP: No actual authentication, just redirect
    router.push('/chat');
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Logy-Desk</h1>
        <p className="text-gray-500">AI-Powered Customer Support</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required />
      </div>
      <Button onClick={handleLogin} className="w-full">Login</Button>
    </div>
  );
}
