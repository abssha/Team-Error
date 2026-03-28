function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validateChat(req, res, next) {
  const { message } = req.body;

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required and must be a non-empty string' });
  }

  next();
}

export function validateRegister(req, res, next) {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'name is required and must be a non-empty string' });
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'email is required and must be valid' });
  }

  if (!password || typeof password !== 'string' || password.length < 6 || !password.trim()) {
    return res.status(400).json({ error: 'password must be at least 6 characters long' });
  }

  next();
}

export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'email is required and must be valid' });
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return res.status(400).json({ error: 'password is required and must be a non-empty string' });
  }

  next();
}
