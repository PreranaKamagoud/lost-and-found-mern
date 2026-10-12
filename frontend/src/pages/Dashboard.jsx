import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (!token || !savedUser) {
      alert('Please login first')
      navigate('/login')
      return
    }

    setUser(JSON.parse(savedUser))

    async function fetchMyItems() {
      try {
        const response = await fetch(
          'http://localhost:5000/api/items/user/items',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
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

    fetchMyItems()
  }, [navigate])

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    alert('Logged out successfully')

    navigate('/login')
  }

  const lostItems = items.filter(
    (item) => item.type === 'lost'
  )

  const foundItems = items.filter(
    (item) => item.type === 'found'
  )

  if (loading) {
    return (
      <div className="dashboard-page">
        <p className="dashboard-loading">
          Loading dashboard...
        </p>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        <div className="dashboard-header">
          <div>
            <p className="dashboard-label">
              MY ACCOUNT
            </p>

            <h1>
              Welcome, {user?.name}
            </h1>

            <p className="dashboard-email">
              {user?.email}
            </p>
          </div>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <div className="dashboard-actions">
          <Link
            to="/report-lost"
            className="dashboard-action"
          >
            Report Lost Item
          </Link>

          <Link
            to="/report-found"
            className="dashboard-action secondary"
          >
            Report Found Item
          </Link>

          <Link
            to="/listings"
            className="dashboard-action secondary"
          >
            Browse Listings
          </Link>
        </div>

        <div className="dashboard-stats">

          <div className="stat-card">
            <span>Total Reports</span>
            <strong>{items.length}</strong>
          </div>

          <div className="stat-card">
            <span>Lost Items</span>
            <strong>{lostItems.length}</strong>
          </div>

          <div className="stat-card">
            <span>Found Items</span>
            <strong>{foundItems.length}</strong>
          </div>

        </div>

        <section className="dashboard-section">
          <div className="section-heading">
            <h2>My Lost Items</h2>
            <span>{lostItems.length}</span>
          </div>

          {lostItems.length === 0 ? (
            <div className="dashboard-empty">
              <p>You have not reported any lost items.</p>

              <Link to="/report-lost">
                Report a Lost Item
              </Link>
            </div>
          ) : (
            <div className="dashboard-items">
              {lostItems.map((item) => (
                <div
                  className="dashboard-item"
                  key={item._id}
                >
                  <div>
                    <span className="dashboard-status lost">
                      LOST
                    </span>

                    <h3>{item.title}</h3>

                    <p>
                      {item.description}
                    </p>

                    <small>
                      Location: {item.location}
                    </small>
                  </div>

                  <Link
                    to={`/item/${item._id}`}
                    className="details-link"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <div className="section-heading">
            <h2>My Found Items</h2>
            <span>{foundItems.length}</span>
          </div>

          {foundItems.length === 0 ? (
            <div className="dashboard-empty">
              <p>You have not reported any found items.</p>

              <Link to="/report-found">
                Report a Found Item
              </Link>
            </div>
          ) : (
            <div className="dashboard-items">
              {foundItems.map((item) => (
                <div
                  className="dashboard-item"
                  key={item._id}
                >
                  <div>
                    <span className="dashboard-status found">
                      FOUND
                    </span>

                    <h3>{item.title}</h3>

                    <p>
                      {item.description}
                    </p>

                    <small>
                      Location: {item.location}
                    </small>
                  </div>

                  <Link
                    to={`/item/${item._id}`}
                    className="details-link"
                  >
                    View Details
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

export default Dashboard