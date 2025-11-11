//produits.js
import axios from "axios";

export async function getProduits() {
  try {
    const response = await axios.get("http://localhost:3000/api/produits");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des produits:", error);
    throw error;
  }
}
