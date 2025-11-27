# Product Management App (React + Express + MySQL)

This project is split into two parts:
- `src/` — React (Vite) frontend that lets you list, create, edit and delete products.
- `backend/` — Express API that persists products in a MySQL database.

## Prerequisites
- Node.js 18+
- MySQL server running locally (or reachable through the network)

## 1. Backend setup
```powershell
cd backend
npm install
copy env.example .env   # edit the file with your DB credentials
```

Create the database and table (one-time):
```powershell
mysql -u root -p < database.sql
# or run the SQL in your favorite GUI
```

Start the API (default port `3000`):
```powershell
npm run dev   # auto-reload
# or
npm start
```

Test it quickly:
- http://localhost:3000/api/test
- http://localhost:3000/api/produits

## 2. Frontend setup
In another terminal:
```powershell
npm install
npm run dev
```

The UI is served on http://localhost:5173 by default. It calls the backend at `http://localhost:3000`.  
If you deploy the backend elsewhere, create a `.env` at the project root with `VITE_API_URL=https://your-api`.

## Troubleshooting
- Ensure MySQL is running and the credentials in `backend/.env` are correct.
- If the frontend displays “Impossible de charger les produits”, confirm the backend is reachable at `/api/produits`.
- Your MySQL schema must be named `product_management` unless you override `DB_NAME` in `.env`.
