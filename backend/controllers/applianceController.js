import { Appliance } from '../models/Appliance.js';
import { Room } from '../models/Room.js';

function sanitizeApplianceUpdate(body) {
  const { user_id, room_id, _id, ...safeBody } = body;
  return safeBody;
}

export const applianceController = {
  // POST /api/rooms/:id/appliances
  async create(req, res, next) {
    try {
      const room = await Room.findOne({ _id: req.params.id, user_id: req.user._id });
      if (!room) return res.status(404).json({ error: 'Room not found' });

      const { name, wattage, quantity, daily_hours, standby, standby_hours, is_custom } = req.body;
      if (!name || !name.trim()) return res.status(400).json({ error: 'Appliance name is required' });
      if (wattage === undefined || wattage === null) return res.status(400).json({ error: 'Wattage is required' });

      const appliance = await Appliance.create({
        user_id: req.user._id,
        room_id: req.params.id,
        name: name.trim(),
        wattage,
        quantity:      quantity      ?? 1,
        daily_hours:   daily_hours   ?? 0,
        standby:       standby       ?? false,
        standby_hours: standby_hours ?? 0,
        is_custom:     is_custom     ?? false
      });

      res.status(201).json(appliance);
    } catch (err) { next(err); }
  },

  // PUT /api/appliances/:id
  async update(req, res, next) {
    try {
      const appliance = await Appliance.findOneAndUpdate(
        { _id: req.params.id, user_id: req.user._id },
        sanitizeApplianceUpdate(req.body),
        { returnDocument: 'after' }
      );
      if (!appliance) return res.status(404).json({ error: 'Appliance not found' });
      res.json(appliance);
    } catch (err) { next(err); }
  },

  // DELETE /api/appliances/:id
  async delete(req, res, next) {
    try {
      const appliance = await Appliance.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
      if (!appliance) return res.status(404).json({ error: 'Appliance not found' });
      res.json({ success: true, id: req.params.id });
    } catch (err) { next(err); }
  }
};
