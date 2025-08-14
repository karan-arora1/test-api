### Sample API Repository (Test Fixture)

This repository contains minimal Express (Node.js) and FastAPI (Python) apps with intentionally weak object-level authorization patterns for testing ingestion, API extraction, and RAG-based BOLA analysis.

## Layout
- `express-app/`: Express server with example routes
- `fastapi-app/`: FastAPI server with example routes

## Express (Node.js)
```bash
cd express-app
npm install
npm start
# Server on http://localhost:4001
```

## FastAPI (Python)
```bash
cd fastapi-app
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 4002
# Server on http://localhost:4002
```

## Intentional BOLA-like Endpoints
- Express:
  - `GET /api/users/:userId` (no ownership check)
  - `PUT /api/users/:userId` (API-key auth, no ownership)
  - `GET /api/accounts/:accountId/orders/:orderId` (no ownership)
  - `DELETE /api/admin/users/:userId` (API-key only)
  - Library domain:
    - `GET /api/books` (public list)
    - `GET /api/users/:userId/checkouts/:checkoutId` (auth but no ownership)
    - `PATCH /api/users/:userId/checkouts/:checkoutId` (auth but no ownership)
    - `GET /api/admin/checkouts/:userId` (API-key only)
  - Business logic:
    - `POST /api/orders/:orderId/confirm` (no auth/ownership)
    - `POST /api/checkout/:checkoutId/finalize` (no explicit authorization)
- FastAPI:
  - `GET /profiles/{user_id}` (no auth)
  - `GET /documents/{doc_id}` (API-key only)
  - Business logic:
    - `POST /orders/{order_id}/confirm` (no auth/ownership)
    - `POST /checkout/{checkout_id}/finalize` (API-key only, no ownership)

Use this repo to validate repository ingestion, API function extraction, and RAG analysis.

