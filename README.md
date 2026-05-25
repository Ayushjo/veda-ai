# VedaAI — AI Assessment Creator

An AI-powered question paper generator for teachers. Fill a form, get a
structured exam paper with sections, difficulty tags, marks, and answer keys
delivered in real time via WebSocket.

## Tech Stack

| Layer      | Technology                                                          |
|------------|---------------------------------------------------------------------|
| Frontend   | Next.js 14 App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand |
| Backend    | Node.js, Express, TypeScript                                        |
| Database   | MongoDB (Mongoose)                                                  |
| Cache      | Redis (ioredis)                                                     |
| Queue      | BullMQ                                                              |
| Realtime   | Socket.IO                                                           |
| AI         | Anthropic Claude (claude-sonnet-4-20250514)                         |

## Architecture
Teacher fills form (Next.js)
│
▼
POST /api/assignments (Express)
│
▼
BullMQ job added to generation-queue (Redis)
│
▼
Worker picks up job
├── Calls Claude API with structured prompt
├── Validates JSON response with Zod
├── Stores Paper in MongoDB
├── Caches Paper in Redis (TTL 1hr)
└── Emits job:completed via Socket.IO
│
▼
Frontend receives event
Redirects to /paper/:id
Fetches and renders structured paper

## Project Structure
veda-ai/
├── apps/
│   ├── frontend/          # Next.js 14 application
│   └── backend/           # Express API + BullMQ worker
└── README.md

## Quick Start

- [Frontend setup](apps/frontend/README.md)
- [Backend setup](apps/backend/README.md)
