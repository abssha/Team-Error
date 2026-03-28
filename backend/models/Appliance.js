import mongoose from 'mongoose';

const applianceSchema = new mongoose.Schema({
  user_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  room_id:       { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  name:          { type: String, required: true, trim: true },
  wattage:       { type: Number, required: true },
  quantity:      { type: Number, default: 1 },
  daily_hours:   { type: Number, default: 0 },
  standby:       { type: Boolean, default: false },
  standby_hours: { type: Number, default: 0 },
  is_custom:     { type: Boolean, default: false }
}, { timestamps: true });

export const Appliance = mongoose.model('Appliance', applianceSchema);
