# ShipTrack 📦

A full-stack shipment tracking web application with two roles: **Logistics Staff** and **Customer**.

---

## Tech Stack

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 18 + Vite                   |
| Backend  | Node.js + Express                 |
| Database | SQLite (via `better-sqlite3`)     |

---

## Project Structure

```
shiptrack/
├── backend/
│   ├── server.js          # Express app entry point
│   ├── database.js        # SQLite setup & schema
│   ├── package.json
│   └── routes/
│       ├── staff.js       # Staff routes (login, CRUD, status update)
│       └── customer.js    # Customer routes (login, read-only)
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── components/
│           ├── LandingPage.jsx
│           ├── StaffLogin.jsx
│           ├── CustomerLogin.jsx
│           ├── StaffDashboard.jsx
│           └── CustomerDashboard.jsx
└── README.md
```

---

## Prerequisites

- **Node.js** v22 or higher — [Download here](https://nodejs.org/) *(uses Node's built-in SQLite — no native compilation needed)*
- **npm** v8 or higher (comes with Node.js)

---

## Running Locally

You'll need **two terminal windows** — one for the backend, one for the frontend.

### Step 1 — Start the Backend

```bash
cd backend
npm install
npm start
```

The backend will start at **http://localhost:5000**

### Step 2 — Start the Frontend (new terminal)

```bash
cd frontend
npm install
npm run dev
```

The frontend will start at **http://localhost:3000**

Open **http://localhost:3000** in your browser.

---

## How to Use

### Staff Login
- Click **"Staff Login"** on the landing page
- Password: **`staff123`**
- You can:
  - Create new shipments (Item Name, Sender/Company Name, Source, Destination)
  - View all shipments in a dashboard with live stats
  - Advance shipment status: `Pending → In Transit → Out for Delivery → Delivered`

### Customer Portal
- Click **"Customer Portal"** on the landing page
- Enter your **company name** (must match the "Sender Name" used when creating a shipment)
- You can:
  - View all shipments belonging to your company
  - Search shipments by Tracking ID
  - Click any shipment to see full status history with timestamps and a progress tracker
  - **Cannot** see other companies' shipments or access staff features

---

## API Endpoints

### Staff
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/staff/login` | Login with password |
| GET | `/api/staff/shipments` | Get all shipments |
| POST | `/api/staff/shipments` | Create a new shipment |
| PATCH | `/api/staff/shipments/:tracking_id/status` | Advance shipment status |

### Customer
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/customer/login` | Login with company name |
| GET | `/api/customer/shipments?company_name=X` | Get shipments for company |
| GET | `/api/customer/shipments/:tracking_id?company_name=X` | Get shipment detail + history |

---

## Security Notes

- Customers can only see shipments where `sender_name` matches their company name (case-insensitive)
- All customer API calls verify ownership before returning data
- No cross-customer data leakage is possible via the API
- Staff password is hardcoded as `staff123` (for demo purposes)
- No real authentication is used — this is a simulated role system as per requirements
