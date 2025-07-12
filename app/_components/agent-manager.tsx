import AgentListSidebar from './agent-list-sidebar';
import AgentForm from './agent-form';

export default function AgentManager() {
  return (
    <div className="flex h-full">
      <AgentListSidebar />
      <div className="flex-1 p-4">
        <AgentForm />
      </div>
    </div>
  );
}
