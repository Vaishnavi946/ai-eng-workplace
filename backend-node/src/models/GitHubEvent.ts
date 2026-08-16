import mongoose, { Document, Schema } from 'mongoose';

export interface IGitHubEvent extends Document {
  eventType: string; // e.g. 'pull_request', 'push'
  deliveryId: string; // unique ID GitHub sends - used to avoid duplicates
  repository: string;
  action?: string; // e.g. 'opened', 'closed', 'synchronize'
  prNumber?: number;
  prTitle?: string;
  prUrl?: string;
  prAuthor?: string;
  isStale: boolean;
  priorityScore?: number;
  payload: any; // the full raw data from GitHub, just in case we need it later
}

const githubEventSchema = new Schema<IGitHubEvent>(
  {
    eventType: { type: String, required: true },
    deliveryId: { type: String, required: true, unique: true },
    repository: { type: String, required: true },
    action: { type: String },
    prNumber: { type: Number },
    prTitle: { type: String },
    prUrl: { type: String },
    prAuthor: { type: String },
    isStale: { type: Boolean, default: false },
    priorityScore: { type: Number, default: 0 },
    payload: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<IGitHubEvent>('GitHubEvent', githubEventSchema);