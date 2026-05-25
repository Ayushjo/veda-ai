# VedaAI — Backend

Node.js + Express + TypeScript API with BullMQ background jobs,
Socket.IO real-time updates, MongoDB storage, and Redis caching.

## Prerequisites

- Node.js 18+
- MongoDB instance (Atlas or local)
- Redis instance (Railway, Upstash, or local)
- Anthropic API key

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create .env file

```env
MONGODB_URI=your_mongodb_connection_string
REDIS_URL=your_redis_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
PORT=8000
CLIENT_URL=http://localhost:3000
```

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
node dist/index.js
```

## API Endpoints

| Method | Endpoint                        | Description                     |
|--------|---------------------------------|---------------------------------|
| GET    | /health                         | Health check                    |
| POST   | /api/assignments                | Create assignment + enqueue job |
| GET    | /api/assignments/:id            | Get assignment details          |
| GET    | /api/assignments/:id/status     | Get job status                  |
| POST   | /api/assignments/:id/regenerate | Re-queue generation             |
| GET    | /api/papers/:id                 | Get paper (cache-first)         |
| GET    | /api/papers/assignment/:id      | Get paper by assignment ID      |

## WebSocket Events

Server emits to the assignment room:

| Event          | Payload                 |
|----------------|-------------------------|
| job:queued     | { jobId, assignmentId } |
| job:processing | { jobId, progress }     |
| job:completed  | { jobId, paperId }      |
| job:failed     | { jobId, error }        |

Client subscribes with:

```js
socket.emit('subscribe', { assignmentId })
```

## Generation Flow

1. POST /api/assignments creates Assignment (status: pending)
2. Job added to generation-queue via BullMQ (3 attempts, exponential backoff)
3. Worker calls Claude API with a structured prompt
4. Response validated against Zod schema — never stored raw
5. Paper stored in MongoDB, cached in Redis (TTL 1hr)
6. Socket.IO emits job:completed with paperId
7. Assignment status updated to completed

## Environment Variables

| Variable          | Required | Description                       |
|-------------------|----------|-----------------------------------|
| MONGODB_URI       | Yes      | MongoDB connection string         |
| REDIS_URL         | Yes      | Redis connection string           |
| ANTHROPIC_API_KEY | Yes      | Anthropic API key                 |
| PORT              | No       | Server port (default: 8000)       |
| CLIENT_URL        | No       | Frontend URL for CORS             |
