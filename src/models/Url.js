import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    originalUrl: { type: String, required: true, trim: true, maxlength: 2048 },
    shortId: { type: String, required: true, unique: true, index: true },
    clicks: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    redirectType: { type: Number, enum: [301, 302, 307, 308], default: 301 },
  },
  { timestamps: true }
);

export default mongoose.model('Url', urlSchema);
