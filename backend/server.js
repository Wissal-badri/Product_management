/* global require, process */
require('dotenv').config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
 
const app = express();

// Configuration CORS plus permissive pour le développement
app.use(cors());

// Middleware pour parser JSON
app.use(express.json());

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connexion MySQL avec gestion d'erreur améliorée
const db = mysql.createConnection({ 
  host: process.env.DB_HOST || 'localhost', 
  user: process.env.DB_USER || 'root', 
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'gestion_produits'
}); 
 
db.connect((err) => { 
  if (err) {
    console.error('❌ Erreur de connexion MySQL:', err);
    console.error('Vérifiez votre fichier .env et que MySQL est démarré');
    process.exit(1);
  }
  console.log('✅ Connecté à MySQL'); 
  
  // Vérifier que la table existe
  db.query('SHOW TABLES LIKE "produits"', (err, results) => {
    if (err) {
      console.error('❌ Erreur lors de la vérification de la table:', err);
    } else if (results.length === 0) {
      console.warn('⚠️  La table "produits" n\'existe pas. Créez-la avec:');
      console.log(`
CREATE TABLE produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
      `);
    } else {
      console.log('✅ Table "produits" trouvée');
    }
  });
}); 
 
// Routes CRUD 
// GET tous les produits 
app.get('/api/produits', (req, res) => {
  console.log('📥 GET /api/produits - Requête reçue');
  
  db.query('SELECT * FROM produits ORDER BY id DESC', (err, results) => { 
    if (err) {
      console.error("❌ Erreur MySQL:", err);
      return res.status(500).json({ 
        error: "Erreur serveur", 
        details: err.message,
        sql: err.sql 
      });
    }
    console.log(`✅ ${results.length} produit(s) trouvé(s)`);
    res.json(results); 
  }); 
}); 

// POST nouveau produit 
app.post('/api/produits', (req, res) => {
  console.log('📥 POST /api/produits - Données reçues:', req.body);
  
  const { name, price, category } = req.body;
  
  // Validation
  if (!name || !price || !category) {
    return res.status(400).json({ 
      error: 'Données manquantes',
      details: 'name, price et category sont requis' 
    });
  }
  
  db.query( 
    'INSERT INTO produits (name, price, category) VALUES (?, ?, ?)', 
    [name, price, category], 
    (err, results) => { 
      if (err) {
        console.error("❌ Erreur MySQL:", err);
        return res.status(500).json({ 
          error: "Erreur serveur", 
          details: err.message 
        });
      }
      console.log('✅ Produit ajouté avec ID:', results.insertId);
      res.json({  
        id: results.insertId,  
        name,  
        price,  
        category  
      }); 
    } 
  ); 
}); 

// PUT modifier produit 
app.put('/api/produits/:id', (req, res) => {
  console.log(`📥 PUT /api/produits/${req.params.id} - Données:`, req.body);
  
  const { name, price, category } = req.body; 
  
  db.query( 
    'UPDATE produits SET name=?, price=?, category=? WHERE id=?', 
    [name, price, category, req.params.id], 
    (err, results) => { 
      if (err) {
        console.error("❌ Erreur MySQL:", err);
        return res.status(500).json({ 
          error: "Erreur serveur", 
          details: err.message 
        });
      }
      console.log('✅ Produit modifié, lignes affectées:', results.affectedRows);
      res.json({ 
        message: 'Produit modifié',
        affectedRows: results.affectedRows 
      }); 
    } 
  ); 
}); 

// DELETE produit 
app.delete('/api/produits/:id', (req, res) => {
  console.log(`📥 DELETE /api/produits/${req.params.id}`);
  
  db.query('DELETE FROM produits WHERE id=?', [req.params.id], (err, results) => { 
    if (err) {
      console.error("❌ Erreur MySQL:", err);
      return res.status(500).json({ 
        error: "Erreur serveur", 
        details: err.message 
      });
    }
    console.log('✅ Produit supprimé, lignes affectées:', results.affectedRows);
    res.json({ 
      message: 'Produit supprimé',
      affectedRows: results.affectedRows 
    }); 
  }); 
});

// Route de test
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API fonctionne!',
    timestamp: new Date().toISOString() 
  });
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📍 Testez l'API: http://localhost:${PORT}/api/test`);
});