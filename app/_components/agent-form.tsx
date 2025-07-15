'use client';

import { useEffect, useState } from 'react';
import { useAgentStore, Agent } from '@/app/_store/agent-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialState: Omit<Agent, 'id'> = {
  name: '',
  agent_type: 'sub',
  model: 'openai/gpt-4o-mini',
  temperature: 0.7,
  system_prompt: '',
};

export default function AgentForm() {
  const { selectedAgent, createAgent, updateAgent, deleteAgent, selectAgent } = useAgentStore();
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (selectedAgent) {
      setFormData(selectedAgent);
    } else {
      setFormData(initialState);
    }
  }, [selectedAgent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        ...formData,
        agent_type: formData.agent_type,
      };

      if (selectedAgent) {
        await updateAgent(selectedAgent.id, dataToSend);
        // After updating, keep the form populated with the new data
      } else {
        await createAgent(dataToSend);
        selectAgent(null); // Reset form only after successful creation
      }
    } catch (error) {
      console.error("Failed to save agent:", error);
      // Here you could add a toast notification to inform the user
    }
  };

  const handleDelete = () => {
    if (selectedAgent) {
      deleteAgent(selectedAgent.id);
      selectAgent(null);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{selectedAgent ? 'Edit Agent' : 'New Agent'}</h2>
      
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="agent_type">Agent Type</Label>
        <Select name="agent_type" value={formData.agent_type} onValueChange={(value) => handleSelectChange('agent_type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select agent type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">Main</SelectItem>
            <SelectItem value="sub">Sub</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model">Model</Label>
        <Select name="model" value={formData.model} onValueChange={(value) => handleSelectChange('model', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            {/* Add the current model value to the list if it's not already there */}
            {formData.model && !['google/gemini-2.5-pro-exp-03-25', 'google/gemma-3-27b-it:free', 'openai/gpt-4o-mini', 'openai/gpt-3.5-turbo-0613', 'anthropic/claude-3.5-sonnet'].includes(formData.model) && (
              <SelectItem value={formData.model}>{formData.model}</SelectItem>
            )}
            <SelectItem value="google/gemini-2.5-pro-exp-03-25">google/gemini-2.5-pro-exp-03-25</SelectItem>
            <SelectItem value="google/gemma-3-27b-it:free">google/gemma-3-27b-it:free</SelectItem>
            <SelectItem value="openai/gpt-4o-mini">openai/gpt-4o-mini</SelectItem>
            <SelectItem value="openai/gpt-3.5-turbo-0613">openai/gpt-3.5-turbo-0613</SelectItem>
            <SelectItem value="anthropic/claude-3.5-sonnet">anthropic/claude-3.5-sonnet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="system_prompt">System Prompt</Label>
        <Textarea id="system_prompt" name="system_prompt" value={formData.system_prompt} onChange={handleChange} rows={10} />
      </div>

      <div className="flex justify-end space-x-2">
        {selectedAgent && <Button variant="destructive" onClick={handleDelete}>Delete</Button>}
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
}
