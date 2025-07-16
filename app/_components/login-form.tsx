'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '../_store/auth-store';

export default function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = () => {
    // MVP: Use a hardcoded user_id for now
    const tempUserId = '00000000-0000-0000-0000-000000000001'; // Example UUID
    login(tempUserId);
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
