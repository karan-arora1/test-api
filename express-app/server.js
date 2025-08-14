const express = require('express');
const app = express();
app.use(express.json());

const { apiKeyAuth, requireAuth, requireManager } = require('./middleware/auth');

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

// Business logic flow: role change (intentionally flawed confirm step without role check)
app.post('/api/admin/users/:userId', apiKeyAuth, (req, res) => {
  res.json({ queued: true, target: req.params.userId });
});

app.post('/api/admin/users/confirmUpdate', (req, res) => {
  // Missing admin check: Business Logic BOLA
  res.json({ updated: true });
});

// Contextual BOLA demo: manager can view reviews but without verifying reporting relationship
app.get('/api/reviews/:employeeId', requireManager, (req, res) => {
  // Missing check: ensure employeeId belongs to req.user's direct reports
  res.json({ employeeId: req.params.employeeId, review: 'Exceeds expectations' });
});

// Group membership example: project docs access with stale membership
let projectMembers = new Set(['101','102']);
app.get('/api/projects/dragon/documents/:docId', requireAuth, (req, res) => {
  // Vulnerable: trusts membership from token (simulated); does not check live membership set
  res.json({ docId: req.params.docId, title: 'Dragon Spec' });
});
app.post('/api/projects/dragon/members/remove/:userId', apiKeyAuth, (req, res) => {
  projectMembers.delete(req.params.userId);
  res.json({ removed: req.params.userId });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`Sample Express app on :${PORT}`));

