| 구분 | 내용 |
|:--|:--|
| 문서 버전 | v0.2.0 |
| 최종 수정일 | 2025년 7월 10일 |

# Logy-Desk 프론트엔드 UI 스캐폴딩 계획서 (Multi-Agent 기반)
## 1. 목표
> Multi-Agent 아키텍처를 기반으로, 상담사가 AI 상담 보조, 보조 Agent 관리, 지식 베이스 관리 기능을 원활하게 사용할 수 있는 프론트엔드 UI의 기본 구조를 완성하는 것을 목표로 합니다. AI 코딩 툴을 활용하여 신속하게 컴포넌트의 뼈대를 구축하고, 이후 백엔드 API와 연동할 수 있는 기반을 마련합니다.

## 2. 기술 스택 및 개발 환경
- **프레임워크:** Next.js (App Router)
- **상태 관리:** Zustand
- **스타일링:** Tailwind CSS
- **UI 컴포넌트:** shadcn/ui
- **개발 도구:** v0, Google AI Studio, Windsuf
- **패키지 매니저:** npm

## 3. 프로젝트 구조 설계
> 로그인 흐름과 메인 애플리케이션의 레이아웃을 분리하고, 새로운 '지식 베이스 관리' 기능을 추가하여 구조를 확장합니다.
```
/logy-desk-frontend
|-- /app
|   |-- /_components
|   |   |-- header.tsx                # 화면 전환 및 로그아웃을 위한 전역 헤더
|   |   |-- login-form.tsx            # 로그인 페이지 UI 컴포넌트
|   |   |-- chat-sidebar.tsx          # 채팅 기록 목록 사이드바
|   |   |-- chat-view.tsx             # 메시지 목록과 입력창을 포함하는 채팅 영역
|   |   |-- sub-agent-display.tsx     # (신규) 채팅창 상단 보조 Agent 목록
|   |   |-- message-list.tsx
|   |   |-- message-input.tsx
|   |   |-- agent-manager.tsx         # 보조 Agent 관리 페이지 전체 레이아웃
|   |   |-- agent-list-sidebar.tsx
|   |   |-- agent-form.tsx
|   |   |-- knowledge-manager.tsx     # (신규) 지식 베이스 관리 페이지 레이아웃
|   |   |-- document-uploader.tsx     # (신규) 파일 업로드 영역
|   |   |-- document-list.tsx         # (신규) 업로드된 파일 목록
|   |-- /_lib
|   |   |-- api.ts                    # 백엔드 API 호출 클라이언트
|   |-- /_store
|   |   |-- auth-store.ts
|   |   |-- chat-store.ts
|   |   |-- agent-store.ts
|   |   |-- document-store.ts         # (신규) 문서 관련 상태 관리
|   |-- /(main)
|   |   |-- /chat
|   |   |   |-- /[session_id]/page.tsx
|   |   |   |-- page.tsx
|   |   |-- /agents
|   |   |   |-- page.tsx
|   |   |-- /knowledge                # (신규) 지식 베이스 관리 페이지
|   |   |   |-- page.tsx
|   |   |-- layout.tsx                # 메인 앱 전역 레이아웃 (헤더 포함)
|   |-- page.tsx                      # 로그인 페이지 (루트 경로)
|   |-- layout.tsx
|-- /components/ui
|-- .env.local
|-- package.json
```

## 4. 컴포넌트 상세 설계
- ### `header.tsx`
  - **역할:** 모든 메인 페이지 상단에 위치하며, 핵심 기능 간 화면 전환 및 로그아웃 기능을 제공합니다.
  - **동작:** 'AI 상담 보조', 'Agent 관리', '지식 베이스 관리' 버튼과 '로그아웃' 버튼을 포함합니다.
- ### `chat-view.tsx`
  - **역할:** 메인 채팅 영역의 컨테이너. 최상단에는 `sub-agent-display`, 중앙에는 `message-list`, 하단에는 `message-input`을 배치합니다.
  - `sub-agent-display.tsx` **(신규):**
    - **역할:** 현재 시스템에 생성된 모든 전문 보조 Agent의 목록을 가로로 나열하여, 상담사가 어떤 전문가들이 있는지 시각적으로 인지할 수 있도록 돕습니다.
- ### `knowledge-manager.tsx` **(신규)**
  - **역할:** 지식 베이스 관리 페이지(`/knowledge`)의 전체 레이아웃을 구성합니다. 상단에는 `document-uploader`, 하단에는 `document-list`를 배치합니다.
  - `document-uploader.tsx`:
    - **역할:** 상담 매뉴얼, FAQ 등 비정형 데이터 파일(pdf, docx, txt 등)을 업로드할 수 있는 UI를 제공합니다.
    - **동작:** `POST /documents/upload` API를 호출하여 파일을 전송하고, 업로드 상태를 시각적으로 표시합니다.
  - `document-list.tsx`:
    - **역할:** 기존에 업로드된 파일 목록을 테이블 형태로 보여줍니다.
    - **동작:** `GET /documents` API를 호출하여 파일 목록을 가져오고, 각 파일에 대한 삭제(`DELETE /documents/{id}`) 기능을 제공합니다.
- ### `login-form.tsx`
  - **역할:** 로그인 페이지(`/`)에 표시될 UI를 제공합니다. 이메일, 비밀번호 입력 필드와 로그인 버튼을 포함합니다.
  - **동작:** MVP 단계에서는 실제 인증을 수행하지 않습니다. '로그인' 버튼 클릭 시, `/chat` 경로로 리디렉션합니다.
- ### `agent-manager.tsx`
  - **역할:** Agent 관리 페이지(`/agents`)의 전체 레이아웃을 구성합니다. 좌측에는 `AgentListSidebar`, 우측에는 `AgentForm`을 배치합니다.
  - `agent-list-sidebar.tsx`:
    - **역할:** 생성된 보조 Agent 목록을 표시하고, 새 Agent를 생성하는 기능을 제공합니다.
    - **동작:** `GET /agents?type=sub` API를 호출하여 목록을 가져오고, 특정 Agent 클릭 시 해당 Agent의 정보를 `AgentForm`에 표시합니다.
  - ### `agent-form.tsx`:
    - **역할:** 새 Agent를 생성하거나 기존 Agent의 정보(이름, 모델, 시스템 프롬프트 등)를 수정하는 폼을 제공합니다. 
    - **동작:** '저장' 버튼 클릭 시, `POST /agents` 또는 `PUT /agents/{agent_id}` API를 호출합니다.

## 5. 상태 관리 및 API 연동 계획
- ### **Zustand 스토어:**
  - `document-store.ts` **(신규):**
    - **역할:** 지식 베이스 문서 관련 상태를 관리합니다.
    - **상태:** `documents`(파일 목록), `uploadStatus`(업로드 상태)
    - **동작:** `fetchDocuments`, `uploadDocument`, `deleteDocument 등의 액션을 통해 상태를 변경합니다.
  - auth-store.ts`:
    - **역할:** 사용자의 로그인 상태를 (가상으로) 관리합니다. 
    - **상태:** `isLoggedIn (boolean)
    - **동작:** `login()`과 `logout() 액션을 통해 상태를 변경합니다.
  - `chat-store.ts`:
    - **역할:** 채팅 관련 상태를 관리합니다. 
    - **상태:** `sessions`(상담 세션 목록), `currentSessionId`(현재 세션 ID), `messages`(현재 세션의 대화 기록), `isLoading`(AI 응답 대기 상태)
    - **동작:** `fetchSessions`, `fetchMessages`, `addMessage`, `sendMessage` 등의 액션을 통해 상태를 변경합니다. 
  - `agent-store.ts`:
    - **역할:** Agent 관리 관련 상태를 관리합니다. 
    - **상태:** `agents`(Agent 목록), `selectedAgent`(선택된 Agent 정보), `isLoading`
    - **동작:** `fetchAgents`, `createAgent`, `updateAgent`, `deleteAgent` 등의 액션을 통해 상태를 변경합니다.

- ### API 클라이언트 (api.ts)
- `API 명세서(v0.2.1)`에 정의된 모든 함수를 구현합니다.

## 6. 단계별 구현 계획
### 1. 프로젝트 초기화 및 라우트 구조 설정:
  - Next.js 프로젝트를 생성하고, `(main)` 라우트 그룹과 `/knowledge 경로를 포함한 전체 디렉토리 구조를 설정합니다. 
  - `header.tsx`에 '지식 베이스 관리' 내비게이션을 추가합니다.
### 2. Agent 및 지식 베이스 관리 기능 구현:
  - `agent-store.ts`, `document-store.ts`와 `Mock API`를 구현합니다. 
  - `agent-manager.tsx`와 `knowledge-manager.tsx` 및 하위 컴포넌트들의 UI를 스캐폴딩하고, 각 스토어와 연동하여 UI 로직을 완성합니다.
### 3. AI 상담 보조 기능 구현:
  - `chat-store.ts`와 `Mock API`를 구현합니다.
  - `chat-sidebar.tsx`와 `chat-view.tsx` 등 채팅 관련 컴포넌트의 UI를 완성합니다. 
  - `chat-view.tsx` 최상단에 `sub-agent-display.tsx`를 구현하고, `agent-store의 데이터를 연동하여 현재 생성된 전문 보조 Agent 목록을 가로로 노출합니다.
### 4.백엔드 API 연동:`
  - `_lib/api.ts의 Mock 함수들을 실제 `fetch` 호출로 전환합니다. 
  - Agent 및 문서 관리 CRUD API를 먼저 연동하고, 이후 채팅 API를 연동합니다.
### 5. 전체 통합 및 테스트:
- 로그인 -> 헤더를 통한 화면 전환 -> Agent/문서 관리 -> 채팅 시작 -> 로그아웃으로 이어지는 전체 사용자 시나리오를 테스트하고, Windsuf를 활용하여 코드 품질을 개선합니다.