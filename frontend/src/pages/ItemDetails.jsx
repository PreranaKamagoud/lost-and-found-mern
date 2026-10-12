import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import './ItemDetails.css'

function ItemDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await fetch(
          `http://localhost:5000/api/items/${id}`
        )

        const data = await response.json()

        if (response.ok) {
          setItem(data)
        } else {
          alert(data.message)
        }
      } catch (error) {
        alert('Cannot connect to backend')
      } finally {
        setLoading(false)
      }
    }

    fetchItem()
  }, [id])

  async function updateStatus(newStatus) {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login first')
      navigate('/login')
      return
    }

    try {
      setUpdating(true)

      const response = await fetch(
        `http://localhost:5000/api/items/${id}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            status: newStatus
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setItem(data.item)
        alert('Status updated successfully')
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert('Cannot connect to backend')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="item-details-page">
        <p>Loading item...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="item-details-page">
        <p>Item not found.</p>

        <Link to="/listings">
          Back to Listings
        </Link>
      </div>
    )
  }

  const currentStatus =
    item.status ||
    (item.type === 'lost' ? 'LOST' : 'FOUND')

  return (
    <div className="item-details-page">
      <div className="item-details-container">

        <Link
          to="/listings"
          className="back-link"
        >
          ← Back to Listings
        </Link>

        <div className="item-details-card">

          <div className="item-details-top">

            <span className={`item-type ${item.type}`}>
              {item.type.toUpperCase()}
            </span>

            <span className="item-status">
              {currentStatus}
            </span>

          </div>

          <h1>{item.title}</h1>

          <p className="item-category">
            Category: {item.category}
          </p>

          <div className="item-information">

            <div>
              <strong>Description</strong>
              <p>{item.description}</p>
            </div>

            <div>
              <strong>Location</strong>
              <p>{item.location}</p>
            </div>

            <div>
              <strong>Date</strong>
              <p>{item.date}</p>
            </div>

            <div>
              <strong>Contact</strong>
              <p>{item.contact}</p>
            </div>

          </div>

          <div className="status-section">

            <h2>Update Status</h2>

            <p className="current-status">
              Current Status:
              <strong> {currentStatus}</strong>
            </p>

            <div className="status-buttons">

              {currentStatus === 'LOST' && (
                <>
                  <button
                    type="button"
                    onClick={() => updateStatus('FOUND')}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Mark as Found'}
                  </button>

                  <button
                    type="button"
                    onClick={() => updateStatus('CLAIMED')}
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Mark as Claimed'}
                  </button>
                </>
              )}

              {currentStatus === 'FOUND' && (
                <button
                  type="button"
                  onClick={() => updateStatus('CLAIMED')}
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Mark as Claimed'}
                </button>
              )}

              {currentStatus === 'CLAIMED' && (
                <button
                  type="button"
                  onClick={() => updateStatus('CLOSED')}
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Close Item'}
                </button>
              )}

              {currentStatus === 'CLOSED' && (
                <p className="closed-message">
                  ✓ This item is closed.
                </p>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

export default ItemDetails