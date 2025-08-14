module.exports.apiKeyAuth = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key) return res.status(401).json({ error: 'missing api key' });
  next();
};

module.exports.requireAuth = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'unauthenticated' });
  req.user = { id: String(userId) };
  next();
};

// Simulated manager auth (no relationship validation)
module.exports.requireManager = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) return res.status(401).json({ error: 'unauthenticated' });
  req.user = { id: String(userId), role: 'manager' };
  next();
};

