# Drug Inventory and Supply Chain Tracking System

A real-time, perpetual drug inventory management system for hospitals and pharmacies. Built with React, Node.js, Express, and MongoDB.

**Project Guide:** Dr. Ajit  
**Student:** Ansh Kumar  
**Registration No:** 2427030307

---

## Features

- **Authentication:** JWT-based login with role-based access (Admin / Pharmacist)
- **Dashboard:** Total drugs, low stock alerts, expiring soon, inventory value, charts
- **Drug Management:** Add, edit, delete drugs; search and filter; barcode/QR placeholder
- **Inventory Logic:** Perpetual model, FEFO/FIFO toggle, automatic stock deduction on sale
- **Stock Tracking:** Real-time updates, low stock threshold, expiry tracking (red <30 days)
- **EOQ Calculator:** Economic Order Quantity with formula √((2DS)/H)
- **Counterfeit Detection:** QR verification simulation (Authentic / Suspicious)
- **Reports:** Stock by name, movement history, CSV export, printable format
- **Market Insights:** Market size, CAGR, key players, trends

---

## Tech Stack

- **Frontend:** React 18, Tailwind CSS, Recharts, Framer Motion, React Router
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Auth:** JWT

---

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

---

## Setup

### 1. Clone and install

```bash
cd drugssystem
npm run install:all
```

### 2. Environment

Copy `.env.example` to `.env` and update:

```bash
cp .env.example .env
```

Edit `.env`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/drug_inventory
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Seed database (optional)

```bash
npm run seed
```

This creates:
- **Admin:** admin@drugs.com / admin123
- **Pharmacist:** pharmacist@drugs.com / pharma123
- 10 sample drugs with batch numbers and expiry dates

### 4. Run the application

**Option A – Both servers (recommended):**

```bash
npm run dev
```

- Backend: http://localhost:5000
- Frontend: http://localhost:5173

**Option B – Separately:**

```bash
# Terminal 1 – backend
npm run server

# Terminal 2 – frontend
npm run client
```

### 5. Login

Open http://localhost:5173 and sign in with:

- Email: `admin@drugs.com`
- Password: `admin123`

---

## Project Structure

```
drugssystem/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/
│   ├── config/             # DB connection
│   ├── controllers/
│   ├── middleware/         # JWT auth
│   ├── models/             # Mongoose schemas
│   ├── routes/
│   ├── scripts/            # Seed script
│   └── index.js
├── .env.example
├── package.json
└── README.md
```

---

## API Endpoints

### Auth

- `POST /api/auth/login` – Login
- `GET /api/auth/profile` – Get profile (auth required)

### Drugs

- `GET /api/drugs` – List drugs (query: search, expiry, lowStock, manufacturer, batchNumber)
- `GET /api/drugs/:id` – Get drug by ID
- `POST /api/drugs` – Create drug
- `PUT /api/drugs/:id` – Update drug
- `DELETE /api/drugs/:id` – Delete drug
- `POST /api/drugs/sell` – Record sale (body: drugId, quantity, useFIFO)

### Dashboard

- `GET /api/dashboard` – Dashboard stats and charts

### Reports

- `GET /api/reports/stock` – Stock report
- `GET /api/reports/movements` – Movement history
- `GET /api/reports/export/csv` – Export CSV

### EOQ

- `POST /api/eoq/calculate` – EOQ calculation (body: annualDemand, orderingCost, holdingCost)

### QR

- `POST /api/qr/verify` – Verify barcode/QR (body: barcodeQR)

---

## License

MIT
