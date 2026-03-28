import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true }
}, { timestamps: true });

export const Room = mongoose.model('Room', roomSchema);
