const express = require('express');
const app = express();
app.use(express.json());

const { apiKeyAuth, requireAuth } = require('./middleware/auth');

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

// Library domain
app.get('/api/books', (req, res) => {
  res.json([{ id: '1', title: '1984' }, { id: '2', title: 'Dune' }]);
});

// Checkout endpoints lacking proper ownership checks
app.get('/api/users/:userId/checkouts/:checkoutId', requireAuth, (req, res) => {
  res.json({ checkoutId: req.params.checkoutId, userId: req.params.userId, bookId: '2' });
});

app.patch('/api/users/:userId/checkouts/:checkoutId', requireAuth, (req, res) => {
  res.json({ updated: true, checkoutId: req.params.checkoutId });
});

app.get('/api/admin/checkouts/:userId', apiKeyAuth, (req, res) => {
  res.json([{ checkoutId: '10', userId: req.params.userId, bookId: '1' }]);
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Sample Express app on :${PORT}`));

