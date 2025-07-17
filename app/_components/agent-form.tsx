'use client';

import { useEffect, useState } from 'react';
import { useAgentStore, Agent } from '@/app/_store/agent-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, Save, Trash2, Sparkles } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-primary/10 rounded-lg">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {selectedAgent ? '에이전트 편집' : '새 에이전트 생성'}
          </h1>
          <p className="text-muted-foreground mt-1">
            AI 에이전트의 설정을 구성하고 관리합니다
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* 기본 정보 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
            <CardDescription>
              에이전트의 이름과 타입을 설정합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">에이전트 이름</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                placeholder="예: 법률 전문가"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="agent_type">에이전트 타입</Label>
              <Select 
                name="agent_type" 
                value={formData.agent_type} 
                onValueChange={(value) => handleSelectChange('agent_type', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="에이전트 타입 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main">메인 에이전트</SelectItem>
                  <SelectItem value="sub">전문가 에이전트</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 모델 설정 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>모델 설정</CardTitle>
            <CardDescription>
              사용할 AI 모델과 생성 파라미터를 설정합니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model">AI 모델</Label>
              <Select 
                name="model" 
                value={formData.model} 
                onValueChange={(value) => handleSelectChange('model', value)}
              >
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="모델 선택" />
                </SelectTrigger>
                <SelectContent>
                  {/* Add the current model value to the list if it's not already there */}
                  {formData.model && !['google/gemini-2.5-pro-exp-03-25', 'google/gemma-3-27b-it:free', 'openai/gpt-4o-mini', 'openai/gpt-3.5-turbo-0613', 'anthropic/claude-3.5-sonnet'].includes(formData.model) && (
                    <SelectItem value={formData.model}>{formData.model}</SelectItem>
                  )}
                  <SelectItem value="google/gemini-2.5-pro-exp-03-25">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      <span>Gemini 2.5 Pro (실험적)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="google/gemma-3-27b-it:free">Gemma 3 27B (무료)</SelectItem>
                  <SelectItem value="openai/gpt-4o-mini">GPT-4o Mini</SelectItem>
                  <SelectItem value="openai/gpt-3.5-turbo-0613">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="text-sm font-medium text-primary">
                  {formData.temperature.toFixed(2)}
                </span>
              </div>
              <Slider
                id="temperature"
                name="temperature"
                min={0.0}
                max={2.0}
                step={0.05}
                value={[formData.temperature]}
                onValueChange={(value) => setFormData(prev => ({ ...prev, temperature: value[0] }))}
                className="py-4"
              />
              <p className="text-xs text-muted-foreground">
                낮은 값은 더 일관된 응답을, 높은 값은 더 창의적인 응답을 생성합니다
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 시스템 프롬프트 카드 */}
        <Card>
          <CardHeader>
            <CardTitle>시스템 프롬프트</CardTitle>
            <CardDescription>
              에이전트의 역할과 행동 방식을 정의합니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea 
              id="system_prompt" 
              name="system_prompt" 
              value={formData.system_prompt} 
              onChange={handleChange} 
              rows={10}
              placeholder="예: 당신은 법률 전문가입니다. 사용자의 법적 질문에 대해 정확하고 이해하기 쉬운 답변을 제공하세요..."
              className="font-mono text-sm"
            />
          </CardContent>
        </Card>

        {/* 액션 버튼 */}
        <div className="flex justify-end gap-3">
          {selectedAgent && (
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              삭제
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            className="gap-2"
            size="lg"
          >
            <Save className="h-4 w-4" />
            {selectedAgent ? '변경사항 저장' : '에이전트 생성'}
          </Button>
        </div>
      </div>
    </div>
  );
}
