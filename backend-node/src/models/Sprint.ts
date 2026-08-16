import mongoose, { Document, Schema } from 'mongoose';

export interface ISprint extends Document {
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed';
  createdBy: mongoose.Types.ObjectId;
}

const sprintSchema = new Schema<ISprint>(
  {
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['planned', 'active', 'completed'],
      default: 'planned',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISprint>('Sprint', sprintSchema);