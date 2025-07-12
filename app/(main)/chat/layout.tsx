import ChatSidebar from "../../_components/chat-sidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full">
      <ChatSidebar />
      <div className="flex-1 h-full">
        {children}
      </div>
    </div>
  );
}
