# AI Engineering Team Workplace

An internal platform for engineering teams that combines sprint/task management with AI-powered automation — an AI-prioritized GitHub PR review queue and a RAG-based docs search assistant.

**Live app:** [ai-eng-workplace.vercel.app](https://ai-eng-workplace.vercel.app)

---

## Features

### 1. Sprint & Task Management
Create sprints, add tasks, and track progress on a Kanban board (To Do / In Progress / Done). Full auth with JWT and role-based access control (admin/member).

### 2. AI-Prioritized Review Queue
GitHub webhooks stream pull request events (opened, closed, reopened) into the app in real time. A background worker scores each PR by age, number of changed files, and draft status, and flags PRs that have been idle for 3+ days as stale — so the most urgent reviews always surface first.

### 3. Docs & Incident Search (RAG)
Upload team documents, then ask questions in plain English. The app chunks and embeds the documents, retrieves the most relevant passages, and asks Google Gemini to answer using only that retrieved context — with every answer citing its source document.

---

## Architecture
<img width="850" height="307" alt="image" src="https://github.com/user-attachments/assets/4d087bc6-9b83-4382-b2b3-599c5f5542e0" />
- **Frontend:** React + TypeScript (Vite), Tailwind CSS v4, React Router
- **Backend:** Node.js + Express + TypeScript — auth, RBAC, CRUD, GitHub webhook receiver, BullMQ background jobs
- **AI Service:** FastAPI (Python) — document chunking, embeddings (`sentence-transformers`), vector search (ChromaDB), Gemini API calls
- **Database:** MongoDB Atlas
- **Cache/Queue:** Redis (Upstash) + BullMQ
- **Containerization:** Docker + Docker Compose (all 3 services run together with one command)
- **CI:** GitHub Actions — builds all 3 Docker images on every push to `main`
- **Deployment:** Frontend on Vercel, backend + AI service on Render

---

## Live Services

| Service | URL |
|---|---|
| Frontend | https://ai-eng-workplace.vercel.app |
| Node API | https://ai-eng-workplace-node.onrender.com |
| AI Service | https://ai-eng-workplace-python.onrender.com |

> Backend services run on Render's free tier and may take 30–60 seconds to wake up after a period of inactivity.

---

## Running Locally

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker Desktop
- MongoDB Atlas connection string
- Upstash Redis URL
- Google Gemini API key

### With Docker (recommended)

```bash
git clone https://github.com/Vaishnavi946/ai-eng-workplace.git
cd ai-eng-workplace
```

Add a `.env` file inside `backend-node/` and `
