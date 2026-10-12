import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Listings.css'

function Listings() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    try {
      const response = await fetch(
        'http://localhost:5000/api/items'
      )

      const data = await response.json()

      if (response.ok) {
        setItems(data)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.log(error)
      alert('Cannot connect to backend')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items.filter((item) => {
    const searchText = search.toLowerCase()

    const title = item.title || ''
    const description = item.description || ''
    const category = item.category || ''
    const location = item.location || ''

    const matchesSearch =
      title.toLowerCase().includes(searchText) ||
      description.toLowerCase().includes(searchText) ||
      category.toLowerCase().includes(searchText) ||
      location.toLowerCase().includes(searchText)

    const matchesType =
      type === 'all' || item.type === type

    const itemStatus = item.status || (
      item.type === 'lost' ? 'LOST' : 'FOUND'
    )

    const matchesStatus =
      status === 'all' || itemStatus === status

    return (
      matchesSearch &&
      matchesType &&
      matchesStatus
    )
  })

  if (loading) {
    return (
      <div className="listings-page">
        <div className="listings-container">
          <h1>Lost & Found Listings</h1>
          <p>Loading items...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="listings-page">

      <div className="listings-container">

        <h1>Lost & Found Listings</h1>

        <p className="listings-subtitle">
          Browse reported lost and found items
        </p>

        {/* Search and Filters */}
        <div className="search-filter-section">

          <input
            type="text"
            placeholder="Search phone, wallet, bag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All Items</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="LOST">Lost</option>
            <option value="FOUND">Found</option>
            <option value="CLAIMED">Claimed</option>
            <option value="CLOSED">Closed</option>
          </select>

        </div>

        <p className="results-count">
          {filteredItems.length} item(s) found
        </p>

        {/* Listings */}
        {filteredItems.length === 0 ? (

          <div className="no-items">
            <h2>No items found</h2>
            <p>
              Try another search or filter.
            </p>
          </div>

        ) : (

          <div className="listings-grid">

            {filteredItems.map((item) => {

              // If old database item has no status,
              // automatically display status based on type.
              const currentStatus =
                item.status ||
                (item.type === 'lost' ? 'LOST' : 'FOUND')

              return (

                <div
                  className="listing-card"
                  key={item._id}
                >

                  {/* Type and Status */}
                  <div className="listing-top">

                    <span
                      className={`item-type ${item.type}`}
                    >
                      {item.type.toUpperCase()}
                    </span>

                    <span
                      className={`item-status ${currentStatus}`}
                    >
                      {currentStatus}
                    </span>

                  </div>

                  {/* Title */}
                  <h2>{item.title}</h2>

                  {/* Category */}
                  <p>
                    <strong>Category:</strong>{' '}
                    {item.category}
                  </p>

                  {/* Location */}
                  <p>
                    <strong>Location:</strong>{' '}
                    {item.location}
                  </p>

                  {/* Date */}
                  <p>
                    <strong>Date:</strong>{' '}
                    {item.date}
                  </p>

                  {/* Description */}
                  <p className="listing-description">
                    {item.description}
                  </p>

                  {/* View Details */}
                  <Link
                    to={`/item/${item._id}`}
                    className="view-details-button"
                  >
                    View Details
                  </Link>

                  {/* Update Status */}
                  <div className="listing-status-section">

                    <h3>Update Status</h3>

                    <p>
                      Current Status:{' '}
                      <strong>
                        {currentStatus}
                      </strong>
                    </p>

                    <Link
                      to={`/item/${item._id}`}
                      className="update-status-button"
                    >
                      Update Status
                    </Link>

                  </div>

                </div>

              )
            })}

          </div>

        )}

      </div>

    </div>
  )
}

export default Listings