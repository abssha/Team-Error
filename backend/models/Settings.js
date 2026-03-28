import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  key:   { type: String, required: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

settingsSchema.index({ user_id: 1, key: 1 }, { unique: true });

export const Settings = mongoose.model('Settings', settingsSchema);
