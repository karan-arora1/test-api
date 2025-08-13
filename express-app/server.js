const express = require('express');
const app = express();
app.use(express.json());

// Simulated auth middleware (weak)
const apiKeyAuth = (req, res, next) => {
  const key = req.headers['x-api-key'];
  if (!key) return res.status(401).json({ error: 'missing api key' });
  next();
};

// Intentionally missing ownership check
app.get('/api/users/:userId', (req, res) => {
  res.json({ userId: req.params.userId, profile: { name: 'Alice' } });
});

// Has auth but no ownership enforcement
app.put('/api/users/:userId', apiKeyAuth, (req, res) => {
  res.json({ updated: true, userId: req.params.userId });
});

// Nested resource without ownership
app.get('/api/accounts/:accountId/orders/:orderId', (req, res) => {
  res.json({ account: req.params.accountId, order: req.params.orderId, total: 123 });
});

// Admin action protected by API key only
app.delete('/api/admin/users/:userId', apiKeyAuth, (req, res) => {
  res.json({ deleted: true, userId: req.params.userId });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Sample Express app on :${PORT}`));

