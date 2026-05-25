# VedaAI — Frontend

Next.js 14 App Router frontend with real-time WebSocket updates,
Zustand state management, and a structured question paper viewer.

## Prerequisites

- Node.js 18+
- Backend server running (see backend README)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create .env.local file

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=http://localhost:8000
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Production build

```bash
npm run build
npm run start
```

## Pages

| Route        | Description                    |
|--------------|--------------------------------|
| /            | Redirects to /create           |
| /create      | Assignment creation form       |
| /paper/:id   | Generated question paper viewer|

## State Management

**assignmentStore** — tracks form data, job status, and IDs

```ts
{ assignmentId, paperId, jobStatus, setAssignment, setJobStatus, setPaperId }
```

**paperStore** — holds the fetched paper document

```ts
{ paper, isLoading, error, setPaper, setLoading, setError }
```

## Real-time Flow

1. Form submits → POST /api/assignments → receives assignmentId
2. useGenerationStatus(assignmentId) subscribes via Socket.IO
3. Backend emits job:queued → job:processing → job:completed
4. On job:completed, stores paperId and redirects to /paper/:id

## Key Components
src/
├── app/
│   ├── create/page.tsx           Assignment form page
│   └── paper/[id]/page.tsx       Paper viewer page
├── components/
│   ├── create/                   Form components
│   └── paper/                    Paper viewer components
├── store/
│   ├── assignmentStore.ts        Assignment + job state
│   └── paperStore.ts             Generated paper state
└── hooks/
├── useSocket.ts              Socket.IO singleton
└── useGenerationStatus.ts    Job event subscriber

## Environment Variables

| Variable            | Required | Description              |
|---------------------|----------|--------------------------|
| NEXT_PUBLIC_API_URL | Yes      | Backend API base URL     |
| NEXT_PUBLIC_WS_URL  | Yes      | Backend WebSocket URL    |
