import { Settings } from '../models/Settings.js';

export const settingsController = {
  // GET /api/settings
  async getAll(req, res, next) {
    try {
      const settings = await Settings.find();
      const result = settings.reduce((acc, s) => ({ ...acc, [s.key]: s.value }), { ratePerUnit: 8 });
      res.json(result);
    } catch (err) { next(err); }
  },

  // GET /api/settings/:key
  async getOne(req, res, next) {
    try {
      const setting = await Settings.findOne({ key: req.params.key });
      if (!setting) return res.status(404).json({ error: 'Setting not found' });
      res.json({ key: setting.key, value: setting.value });
    } catch (err) { next(err); }
  },

  // PUT /api/settings/:key
  async update(req, res, next) {
    try {
      const { value } = req.body;
      if (value === undefined) return res.status(400).json({ error: 'value is required' });
      const setting = await Settings.findOneAndUpdate(
        { key: req.params.key },
        { value },
        { new: true, upsert: true }
      );
      res.json({ key: setting.key, value: setting.value });
    } catch (err) { next(err); }
  }
};