'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import ThemeSelector from '@/app/_components/theme-selector';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    // MVP: No actual logout, just redirect to login page
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center space-x-4">
        <Link href="/chat" className="text-2xl font-bold">Logy-Desk</Link>
        <nav className="flex items-center space-x-1">
          <Link 
            href="/chat" 
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              pathname === '/chat' 
                ? 'text-primary border-primary' 
                : 'text-muted-foreground border-transparent hover:text-primary'
            }`}>
            AI 상담 보조
          </Link>
          <Link 
            href="/agents" 
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              pathname === '/agents' 
                ? 'text-primary border-primary' 
                : 'text-muted-foreground border-transparent hover:text-primary'
            }`}>
            Agent 관리
          </Link>
          <Link 
            href="/knowledge" 
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              pathname === '/knowledge' 
                ? 'text-primary border-primary' 
                : 'text-muted-foreground border-transparent hover:text-primary'
            }`}>
            지식 베이스 관리
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <ThemeSelector />
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
    </header>
  );
}
