import AgentListSidebar from './agent-list-sidebar';
import AgentForm from './agent-form';

export default function AgentManager() {
  return (
    <div className="flex h-full bg-background">
      <AgentListSidebar />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">
          <AgentForm />
        </div>
      </div>
    </div>
  );
}
