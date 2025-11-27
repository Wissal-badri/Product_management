-- Création de la base de données
CREATE DATABASE IF NOT EXISTS product_management;
USE product_management;

-- Création de la table produits
CREATE TABLE IF NOT EXISTS produits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion de données initiales (optionnel)
INSERT INTO produits (name, price, category) VALUES
('Ordinateur Portable', 899.00, 'Informatique'),
('Smartphone', 499.00, 'Téléphonie'),
('Casque Audio', 79.00, 'Accessoires');


