// src/components/List_produits.jsx

import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api/produits'

export default function ListProduits() {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formValues, setFormValues] = useState({ name: '', price: '', category: '' })

  useEffect(() => {
    fetchProduits()
  }, [])

  const fetchProduits = async () => {
    try {
      const response = await axios.get(API_URL)
      setItems(response.data)
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formValues.name || !formValues.price || !formValues.category) return
    const parsedPrice = Number(formValues.price)
    if (Number.isNaN(parsedPrice)) return
    
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          name: formValues.name.trim(),
          price: parsedPrice,
          category: formValues.category.trim()
        })
      } else {
        await axios.post(API_URL, {
          name: formValues.name.trim(),
          price: parsedPrice,
          category: formValues.category.trim()
        })
      }
      fetchProduits()
      setFormValues({ name: '', price: '', category: '' })
      setEditingId(null)
      setIsOpen(false)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      fetchProduits()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  const handleEdit = (product) => {
    setFormValues({ name: product.name, price: product.price.toString(), category: product.category })
    setEditingId(product.id)
    setIsOpen(true)
  }

  const handleOpenAdd = () => {
    setFormValues({ name: '', price: '', category: '' })
    setEditingId(null)
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    setIsOpen(false)
    setEditingId(null)
    setFormValues({ name: '', price: '', category: '' })
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>Liste des produits</h2>
        <button onClick={handleOpenAdd} style={styles.primaryButton}>Nouveau produit</button>
      </div>

      <div style={styles.card}>
        <div style={styles.tableHeader}>
          <div style={{ flex: 2 }}>Nom</div>
          <div style={{ flex: 1 }}>Prix (MAD)</div>
          <div style={{ flex: 1 }}>Catégorie</div>
          <div style={{ flex: 1.5, textAlign: 'center' }}>Action</div>
        </div>
        {items.length === 0 ? (
          <div style={{ padding: 20, color: '#555', textAlign: 'center' }}>Aucun produit</div>
        ) : (
          items.map((p, idx) => (
            <div key={p.id} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <div style={{ flex: 2 }}>{p.name}</div>
              <div style={{ flex: 1 }}>{Number(p.price).toFixed(2)}</div>
              <div style={{ flex: 1 }}>{p.category}</div>
              <div style={{ flex: 1.5, display: 'flex', gap: 8, justifyContent: 'center' }}>
                <button onClick={() => handleEdit(p)} style={styles.editButton}>Modifier</button>
                <button onClick={() => handleDelete(p.id)} style={styles.deleteButton}>Supprimer</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isOpen && (
        <div style={styles.modalBackdrop} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingId ? 'Modifier le produit' : 'Nouveau produit'}</h3>
              <button aria-label="Fermer" onClick={handleCloseModal} style={styles.iconButton}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Nom</label>
                <input
                  name="name"
                  value={formValues.name}
                  onChange={handleChange}
                  placeholder="Ex: Souris sans fil"
                  style={styles.input}
                />
              </div>
              <div style={styles.fieldRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Prix (MAD)</label>
                  <input
                    name="price"
                    type="number"
                    value={formValues.price}
                    onChange={handleChange}
                    placeholder="Ex: 199"
                    style={styles.input}
                  />
                </div>
                <div style={{ width: 12 }} />
                <div style={{ flex: 1 }}>
                  <label style={styles.label}>Catégorie</label>
                  <input
                    name="category"
                    value={formValues.category}
                    onChange={handleChange}
                    placeholder="Ex: Accessoires"
                    style={styles.input}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                <button type="button" onClick={handleCloseModal} style={styles.secondaryButton}>Annuler</button>
                <button type="submit" style={styles.primaryButton}>{editingId ? 'Modifier' : 'Ajouter'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    maxWidth: 960,
    margin: '40px auto',
    padding: 16,
    color: '#000'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  title: {
    margin: 0,
    color: '#000',
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 0.3
  },
  card: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    color: '#000',
    boxShadow: '0 10px 25px rgba(0,0,0,0.12)'
  },
  tableHeader: {
    display: 'flex',
    gap: 12,
    padding: 16,
    background: '#f3f4f6',
    fontWeight: 600,
    borderBottom: '1px solid #e5e7eb',
    color: '#000'
  },
  tableRow: {
    display: 'flex',
    gap: 12,
    padding: 16,
    borderTop: '1px solid #f2f2f2',
    background: '#fff',
    color: '#000'
  },
  tableRowAlt: {
    display: 'flex',
    gap: 12,
    padding: 16,
    borderTop: '1px solid #f2f2f2',
    background: '#fafafa',
    color: '#000'
  },
  modalBackdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backdropFilter: 'blur(2px)'
  },
  modal: {
    width: '100%',
    maxWidth: 480,
    background: 'white',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
    border: '1px solid #e5e7eb'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: {
    margin: 0,
    color: '#000'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginTop: 8
  },
  fieldRow: {
    display: 'flex',
    gap: 12,
    marginTop: 8
  },
  label: {
    fontSize: 12,
    color: '#000'
  },
  input: {
    border: '1px solid #9ca3af',
    borderRadius: 6,
    padding: '10px 12px',
    outline: 'none',
    color: '#000',
    width: '100%',
    background: '#fff',
    boxShadow: '0 0 0 0 rgba(37,99,235,0)',
    transition: 'box-shadow .15s ease, border-color .15s ease'
  },
  primaryButton: {
    background: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    padding: '10px 14px',
    cursor: 'pointer',
    boxShadow: '0 8px 18px rgba(37,99,235,0.35)',
    transition: 'transform .06s ease, box-shadow .2s ease'
  },
  secondaryButton: {
    background: 'white',
    color: '#000',
    border: '1px solid #9ca3af',
    borderRadius: 8,
    padding: '10px 14px',
    cursor: 'pointer'
  },
  iconButton: {
    background: 'transparent',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    lineHeight: 1
  },
  editButton: {
    background: '#10b981',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    transition: 'background .2s ease'
  },
  deleteButton: {
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 500,
    transition: 'background .2s ease'
  }
}

