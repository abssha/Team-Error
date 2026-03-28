# ⚡ Phantom Load — Backend API

## Folder Structure
```
backend/
├── server.js                  ← Entry point — wires everything together
├── config/
│   └── anthropic.js           ← Anthropic client (singleton)
├── middleware/
│   ├── cors.js                ← CORS config + preflight handler
│   ├── validator.js           ← Request body validation
│   └── errorHandler.js        ← Global error handler
├── routes/
│   ├── health.js              ← GET /api/health
│   └── chat.js                ← POST /api/chat
├── controllers/
│   ├── healthController.js    ← Health check logic
│   └── chatController.js      ← AI chat logic
├── utils/
│   └── promptBuilder.js       ← Builds AI system prompt from inventory
├── .env.example               ← Copy to .env and fill in key
└── package.json
```

## Setup

```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
```

## Verify it's running

```bash
curl http://localhost:3001/api/health
# Expected: {"status":"ok","service":"phantom-load-api","timestamp":"..."}
```

## API Endpoints

### GET /api/health
Returns server status. Frontend pings this on load.

### POST /api/chat
**Body:**
```json
{
  "message": "How do I reduce my bill by 30%?",
  "inventory": [...rooms],
  "totalMonthlyCost": 3200,
  "totalCO2": 185.4,
  "topVampires": [...top3appliances],
  "ratePerUnit": 8
}
```
**Response:**
```json
{ "reply": "Your AC alone costs ₹2,100/month..." }
```