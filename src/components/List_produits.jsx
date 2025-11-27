
import { useState, useEffect } from 'react'
import axios from 'axios'
import './List_produits.css'

export default function ListProduits() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formValues, setFormValues] = useState({ name: '', price: '', category: '' })
  const [error, setError] = useState(null)
  const [errorAlert, setErrorAlert] = useState(null)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await axios.get(`${API_BASE}/api/produits`)
        setItems(res.data || [])
      } catch (err) {
        console.error('Erreur fetchProducts', err)
        setError('Impossible de charger les produits — vérifiez le backend.')
      } finally {
        setLoading(false)
      }
    })()
  }, [API_BASE])


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError(null)
    if (!formValues.name || !formValues.price || !formValues.category) {
      setError('Tous les champs sont obligatoires.')
      return
    }
    const parsedPrice = Number(formValues.price)
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Le prix doit être un nombre positif.')
      return
    }

    // Sauvegarde via API
    ;(async () => {
      setSaving(true)
      try {
        if (editingId !== null) {
          await axios.put(`${API_BASE}/api/produits/${editingId}`, {
            name: formValues.name.trim(),
            price: parsedPrice,
            category: formValues.category.trim()
          })
          setItems((prev) => prev.map(item => item.id === editingId ? ({
            ...item,
            name: formValues.name.trim(),
            price: parsedPrice,
            category: formValues.category.trim()
          }) : item))
        } else {
          const res = await axios.post(`${API_BASE}/api/produits`, {
            name: formValues.name.trim(),
            price: parsedPrice,
            category: formValues.category.trim()
          })
          // API returns the created product (with id)
          setItems((prev) => [res.data, ...prev])
        }

        setFormValues({ name: '', price: '', category: '' })
        setEditingId(null)
        setIsOpen(false)
      } catch (err) {
        console.error('Erreur save product', err)
        
        // Construire un message d'erreur détaillé
        let errorMessage = 'Erreur lors de la sauvegarde du produit.'
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error
          if (err.response.data.details) {
            errorMessage += ' — ' + err.response.data.details
          }
        } else if (err.response?.status === 0 || err.message === 'Network Error') {
          errorMessage = '⚠️ Impossible de contacter le serveur. Vérifiez que le backend (npm run dev) est démarré sur http://localhost:3000'
        } else if (err.message) {
          errorMessage = err.message
        }
        
        setError(errorMessage)
        setErrorAlert(errorMessage)
      } finally {
        setSaving(false)
      }
    })()
  }

  const handleDelete = (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return

    ;(async () => {
      setError(null)
      try {
        await axios.delete(`${API_BASE}/api/produits/${id}`)
        setItems((prev) => prev.filter(item => item.id !== id))
      } catch (err) {
        console.error('Erreur delete', err)
        
        // Construire un message d'erreur détaillé
        let errorMessage = 'Impossible de supprimer le produit.'
        if (err.response?.data?.error) {
          errorMessage = err.response.data.error
          if (err.response.data.details) {
            errorMessage += ' — ' + err.response.data.details
          }
        } else if (err.response?.status === 0 || err.message === 'Network Error') {
          errorMessage = '⚠️ Impossible de contacter le serveur. Vérifiez que le backend est démarré.'
        } else if (err.message) {
          errorMessage = err.message
        }
        
        setError(errorMessage)
        setErrorAlert(errorMessage)
      }
    })()
  }

  const handleEdit = (product) => {
    setFormValues({
      name: product.name,
      price: product.price.toString(),
      category: product.category
    })
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
    setError(null)
  }

  return (
    <div className="list-container">
      <div className="header-section">
        <div className="header-content">
          <h1 className="page-title">Gestion des Produits</h1>
          <p className="page-subtitle">Gérez votre inventaire de manière efficace</p>
        </div>
        <button className="btn-primary" onClick={handleOpenAdd}>
          <span>➕</span> Nouveau Produit
        </button>
      </div>

      {error && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #fca5a5',
          color: '#991b1b',
          padding: '1rem',
          borderRadius: '6px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <div className="card">
        {loading ? (
          <div className="empty-state">
            <div className="empty-state-icon">⏳</div>
            <p className="empty-state-text">Chargement des produits...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <p className="empty-state-text">Aucun produit trouvé. Commencez par en ajouter un !</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <div className="table-header">
              <div>Nom du Produit</div>
              <div>Prix (MAD)</div>
              <div>Catégorie</div>
              <div>Actions</div>
            </div>
            {items.map((product, idx) => (
              <div key={product.id} className={`table-row ${idx % 2 === 1 ? 'alt' : ''}`}>
                <div className="table-cell">
                  <span className="table-cell-label">{product.name}</span>
                </div>
                <div className="table-cell">
                  <span className="price">{Number(product.price).toFixed(2)} MAD</span>
                </div>
                <div className="table-cell">
                  <span className="category">{product.category}</span>
                </div>
                <div className="table-cell">
                  <div className="table-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                      title="Modifier ce produit"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(product.id)}
                      title="Supprimer ce produit"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingId ? '✏️ Modifier le Produit' : '➕ Nouveau Produit'}
              </h2>
              <button
                className="modal-close-btn"
                onClick={handleCloseModal}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Nom du Produit</label>
                  <input
                    className="form-input"
                    type="text"
                    name="name"
                    value={formValues.name}
                    onChange={handleChange}
                    placeholder="Ex: Souris sans fil"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Prix (MAD)</label>
                    <input
                      className="form-input"
                      type="number"
                      name="price"
                      value={formValues.price}
                      onChange={handleChange}
                      placeholder="Ex: 199.99"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Catégorie</label>
                    <input
                      className="form-input"
                      type="text"
                      name="category"
                      value={formValues.category}
                      onChange={handleChange}
                      placeholder="Ex: Accessoires"
                      required
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Annuler
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving ? 'Enregistrement...' : (editingId ? 'Modifier' : 'Ajouter')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Modal */}
      {errorAlert && (
        <div className="modal-backdrop" onClick={() => setErrorAlert(null)}>
          <div className="error-alert-content" onClick={(e) => e.stopPropagation()}>
            <div className="error-alert-header">
              <span className="error-alert-icon">⚠️</span>
              <h3 className="error-alert-title">Erreur</h3>
              <button
                className="error-alert-close"
                onClick={() => setErrorAlert(null)}
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
            <div className="error-alert-body">
              <p className="error-alert-message">{errorAlert}</p>
            </div>
            <div className="error-alert-footer">
              <button
                className="btn-primary"
                onClick={() => setErrorAlert(null)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
