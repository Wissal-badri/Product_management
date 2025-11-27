# Backend (Express + MySQL) — Product Management

This folder contains a small Express API that connects to MySQL and exposes CRUD endpoints for products.

## Quick setup

1. Copy the example env and set your MySQL credentials:

   ```powershell
   cd backend
   copy env.example .env
   ```

2. Install dependencies:

   ```powershell
   npm install
   ```

3. Initialize the database (one of these options):

   - Using the MySQL CLI:

     ```powershell
     mysql -u root -p < database.sql
     # enter password when prompted
     ```

   - Or run the SQL script from a GUI tool (MySQL Workbench, phpMyAdmin, etc.) — open `database.sql` and execute.

4. Start the server (default port `3000`):

   ```powershell
   # dev mode (restarts on file change, Node 18+)
   npm run dev

   # or production start
   npm start
   ```

5. Test the API:

   - Health: http://localhost:3000/api/test
   - Products list: http://localhost:3000/api/produits

Notes
- The server uses `dotenv`. Keep your real `.env` out of version control.
- CORS is enabled for development. If you deploy, tighten the origin policy.
- If you see MySQL connection errors, ensure MySQL is running and the credentials in `.env` are correct.
# Backend API - Product Management

API REST pour la gestion des produits.

## Installation

```bash
npm install
```

## Démarrage

```bash
npm start
```

Pour le mode développement avec rechargement automatique :

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## Endpoints

- `GET /api/produits` - Récupérer tous les produits
- `GET /api/produits/:id` - Récupérer un produit par ID
- `POST /api/produits` - Créer un nouveau produit
- `PUT /api/produits/:id` - Modifier un produit
- `DELETE /api/produits/:id` - Supprimer un produit

