# ⚡ Phantom Load

> A home energy audit web app that shows you exactly where your electricity is going — and uses AI to help you cut it down.

Built for a hackathon. Users map out their home room by room, add appliances with usage details, and instantly see their estimated energy consumption and monthly bill. An AI advisor (powered by Gemini) reads the actual inventory and gives personalized tips.

---

## 🚀 Features

- **Room-based inventory** — Organize appliances by room (Bedroom, Kitchen, Living Room, etc.)
- **Appliance tracking** — Log wattage, quantity, daily usage hours, and standby consumption
- **Live cost calculation** — Real-time kWh and monthly cost estimates per appliance, per room, and total
- **Configurable electricity rate** — Set your local rate per unit (₹/kWh) in settings
- **AI Energy Advisor** — Chat with Gemini 2.5 Flash, which knows your full home inventory and gives actionable advice

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Backend | Node.js, Express.js (ES Modules) |
| Database | MongoDB (local) + Mongoose ODM |
| AI | Google Gemini 2.5 Flash (`@google/generative-ai`) |
| Frontend | React + Vite |

---

## 📁 Project Structure

```
TeamError/
└── backend/
    ├── server.js                  ← Entry point
    ├── package.json
    ├── .env                       ← API keys and config
    ├── config/
    │   ├── gemini.js              ← Gemini client singleton
    │   └── database.js            ← MongoDB connection
    ├── middleware/
    │   ├── cors.js                ← Open CORS for local network
    │   ├── validator.js           ← Request body validation
    │   └── errorHandler.js        ← Global error handler
    ├── models/
    │   ├── Room.js
    │   ├── Appliance.js
    │   └── Settings.js
    ├── routes/
    │   ├── health.js
    │   ├── rooms.js
    │   ├── appliances.js
    │   ├── settings.js
    │   └── chat.js
    ├── controllers/
    │   ├── healthController.js
    │   ├── roomController.js
    │   ├── applianceController.js
    │   ├── settingsController.js
    │   └── chatController.js
    └── utils/
        ├── promptBuilder.js       ← Builds AI system prompt from live DB
        └── uuid.js
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js (v18+)
- MongoDB running locally
- Google Gemini API key

### 1. Start MongoDB

```bash
net start MongoDB
```

### 2. Configure Environment

Create a `.env` file inside `backend/`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGO_URI=mongodb://localhost:27017/phantomload
PORT=3001
```

### 3. Install Dependencies

```bash
cd TeamError/backend
npm install
```

### 4. Run the Backend

```bash
npm run dev
```

Expected output:

```
✅ MongoDB connected
🚀 Phantom Load API running on http://localhost:3001
```

---

## 🌐 API Reference

**Base URL:** `http://192.168.8.140:3001`

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Check if server is running |

### Rooms
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/rooms` | Get all rooms with appliances |
| POST | `/api/rooms` | Create a new room |
| PUT | `/api/rooms/:id` | Rename a room |
| DELETE | `/api/rooms/:id` | Delete room and all its appliances |

### Appliances
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/rooms/:id/appliances` | Add appliance to a room |
| PUT | `/api/appliances/:id` | Update an appliance |
| DELETE | `/api/appliances/:id` | Delete an appliance |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/settings` | Get all settings |
| GET | `/api/settings/:key` | Get a specific setting |
| PUT | `/api/settings/:key` | Update a setting |

**Example — update electricity rate:**
```http
PUT /api/settings/ratePerUnit
Content-Type: application/json

{ "value": 8.5 }
```

### AI Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send a message to the AI advisor |

**Request body:**
```json
{
  "message": "Which appliance is costing me the most?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{ "reply": "Based on your inventory, your 1.5-ton AC is running 8 hours a day..." }
```

> The AI is automatically given a system prompt built from your live DB — it knows every room, appliance, and usage pattern before you even ask.

---

## 🗄️ Data Models

### Room
```js
{
  _id: ObjectId,
  name: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Appliance
```js
{
  _id: ObjectId,
  room_id: ObjectId,       // ref: Room
  name: String,
  wattage: Number,
  quantity: Number,        // default: 1
  daily_hours: Number,     // default: 0
  standby: Boolean,        // default: false
  standby_hours: Number,   // default: 0
  is_custom: Boolean,      // default: false
  createdAt: Date,
  updatedAt: Date
}
```

### Settings
```js
{
  key: String,             // unique, e.g. "ratePerUnit"
  value: Mixed             // e.g. 8
}
```

---

## 🔌 Network Setup

The backend is hosted on a laptop and accessible to other devices on the same network.

- **Backend IP:** `192.168.8.140:3001`
- **CORS:** Open (`origin: '*'`) — any device on the network can connect
- Both devices must be on the **same WiFi or mobile hotspot**

> ⚠️ College WiFi may block local DNS. Use a **mobile hotspot** if connectivity issues arise.

---

## 📦 Dependencies

```json
{
  "dependencies": {
    "@google/generative-ai": "latest",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "mongoose": "latest"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

---

## ⚠️ Known Issues

- **College WiFi blocks MongoDB Atlas** SRV DNS — using local MongoDB as a workaround
- **ngrok is blocked** by Fortinet firewall on the college network
- `package.json` uses `"type": "module"` — always use `import/export`, never `require()`
- MongoDB `_id` field is used throughout — the frontend must reference `_id`, not `id`

---

## 🤝 Team

Built with ❤️ by **Team Error** for the hackathon.