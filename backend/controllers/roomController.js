import { Room } from '../models/Room.js';
import { Appliance } from '../models/Appliance.js';

export const roomController = {
  // GET /api/rooms
  async getAll(req, res, next) {
    try {
      const rooms = await Room.find({ user_id: req.user._id }).sort({ createdAt: 1 });
      const appliances = await Appliance.find({ user_id: req.user._id }).sort({ createdAt: 1 });

      const result = rooms.map(room => ({
        ...room.toObject(),
        appliances: appliances.filter(appliance => appliance.room_id.toString() === room._id.toString())
      }));

      res.json(result);
    } catch (err) { next(err); }
  },

  // GET /api/rooms/:id
  async getById(req, res, next) {
    try {
      const room = await Room.findOne({ _id: req.params.id, user_id: req.user._id });
      if (!room) return res.status(404).json({ error: 'Room not found' });
      const appliances = await Appliance.find({ room_id: room._id, user_id: req.user._id });
      res.json({ ...room.toObject(), appliances });
    } catch (err) { next(err); }
  },

  // POST /api/rooms
  async create(req, res, next) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) return res.status(400).json({ error: 'Room name is required' });
      const room = await Room.create({ user_id: req.user._id, name: name.trim() });
      res.status(201).json({ ...room.toObject(), appliances: [] });
    } catch (err) { next(err); }
  },

  // PUT /api/rooms/:id
  async update(req, res, next) {
    try {
      const { name } = req.body;
      if (!name || !name.trim()) return res.status(400).json({ error: 'Room name is required' });
      const room = await Room.findOneAndUpdate(
        { _id: req.params.id, user_id: req.user._id },
        { name: name.trim() },
        { returnDocument: 'after' }
      );
      if (!room) return res.status(404).json({ error: 'Room not found' });
      res.json(room);
    } catch (err) { next(err); }
  },

  // DELETE /api/rooms/:id
  async delete(req, res, next) {
    try {
      const room = await Room.findOneAndDelete({ _id: req.params.id, user_id: req.user._id });
      if (!room) return res.status(404).json({ error: 'Room not found' });
      await Appliance.deleteMany({ room_id: req.params.id, user_id: req.user._id });
      res.json({ success: true, id: req.params.id });
    } catch (err) { next(err); }
  }
};
