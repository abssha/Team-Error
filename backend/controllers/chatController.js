import gemini from '../config/gemini.js';
import { buildSystemPrompt } from '../utils/promptBuilder.js';

export const chatController = {
  async chat(req, res, next) {
    try {
      const { message, history = [] } = req.body;

      const systemPrompt = await buildSystemPrompt(req.user._id);

      // Build Gemini-format history (excludes the latest message)
      const geminiHistory = history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      }));

      const chat = gemini.startChat({
        systemInstruction: {
          role: 'system',
          parts: [{ text: systemPrompt }]
        },
        history: geminiHistory
      });

      const result = await chat.sendMessage(message);
      const reply = result.response.text();

      res.json({ reply });
    } catch (err) {
      next(err);
    }
  }
};
