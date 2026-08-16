export interface Sprint {
  _id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'active' | 'completed';
  createdBy: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  sprint: string | { _id: string; name: string };
  assignedTo?: string | { _id: string; name: string; email: string };
  createdBy: string;
  createdAt: string;
}

export interface GitHubEvent {
  _id: string;
  eventType: string;
  repository: string;
  action: string;
  prNumber: number;
  prTitle: string;
  prUrl: string;
  prAuthor: string;
  isStale: boolean;
  priorityScore: number;
  createdAt: string;
}

export interface SourceCitation {
  document_name: string;
  chunk_text: string;
}

export interface QueryResponse {
  answer: string;
  sources: SourceCitation[];
}