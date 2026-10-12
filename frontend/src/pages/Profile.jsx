import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Profile.css'

function Profile() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (!token || !savedUser) {
      navigate('/login')
      return
    }

    try {
      setUser(JSON.parse(savedUser))
    } catch (error) {
      localStorage.removeItem('user')
      navigate('/login')
      return
    }

    fetchItems(token)
  }, [navigate])

  async function fetchItems(token) {
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
      alert('Cannot connect to backend')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <p>Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <Link
          to="/"
          className="profile-back-link"
        >
          ← Back to Home
        </Link>

        <div className="profile-card">

          <div className="profile-header">

            <div className="profile-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1>{user?.name}</h1>
              <p>{user?.email}</p>
            </div>

          </div>

          <div className="profile-information">

            <div className="profile-info-box">
              <span>Name</span>
              <strong>{user?.name}</strong>
            </div>

            <div className="profile-info-box">
              <span>Email</span>
              <strong>{user?.email}</strong>
            </div>

          </div>

          <button
            type="button"
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </div>

        <div className="my-items-section">

          <div className="my-items-header">

            <div>
              <h2>My Reported Items</h2>
              <p>
                Items reported using your account
              </p>
            </div>

            <span className="items-count">
              {items.length} Item{items.length !== 1 ? 's' : ''}
            </span>

          </div>

          {items.length === 0 ? (

            <div className="empty-items">

              <h3>No items reported yet</h3>

              <p>
                Your reported lost and found items will appear here.
              </p>

              <div className="profile-actions">

                <Link to="/report-lost">
                  Report Lost Item
                </Link>

                <Link to="/report-found">
                  Report Found Item
                </Link>

              </div>

            </div>

          ) : (

            <div className="profile-items-grid">

              {items.map((item) => {

                const currentStatus =
                  item.status ||
                  (item.type === 'lost'
                    ? 'LOST'
                    : 'FOUND')

                return (

                  <div
                    className="profile-item-card"
                    key={item._id}
                  >

                    <div className="profile-item-top">

                      <span
                        className={`profile-item-type ${item.type}`}
                      >
                        {item.type.toUpperCase()}
                      </span>

                      <span className="profile-item-status">
                        {currentStatus}
                      </span>

                    </div>

                    <h3>{item.title}</h3>

                    <p>
                      <strong>Category:</strong>{' '}
                      {item.category}
                    </p>

                    <p>
                      <strong>Location:</strong>{' '}
                      {item.location}
                    </p>

                    <p>
                      <strong>Date:</strong>{' '}
                      {item.date}
                    </p>

                    <Link
                      to={`/item/${item._id}`}
                      className="profile-view-button"
                    >
                      View Details
                    </Link>

                  </div>

                )
              })}

            </div>

          )}

        </div>

      </div>
    </div>
  )
}

export default Profile