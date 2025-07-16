import Header from "@/app/_components/header";
import AgentLoader from '@/app/_components/agent-loader';
import { NewChatDialog } from '@/app/_components/new-chat-dialog';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <AgentLoader />
      <Header />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <NewChatDialog />
    </div>
  );
}
