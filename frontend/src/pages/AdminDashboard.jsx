import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()

  const [stats, setStats] = useState({
    totalItems: 0,
    lostItems: 0,
    foundItems: 0,
    claimedItems: 0,
    closedItems: 0
  })

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')

    if (!token || !savedUser) {
      navigate('/login')
      return
    }

    try {
      const user = JSON.parse(savedUser)

      if (user.role !== 'admin') {
        alert('Admin access required')
        navigate('/dashboard')
        return
      }

      fetchAdminData(token)
    } catch (error) {
      localStorage.removeItem('user')
      navigate('/login')
    }
  }, [navigate])

  async function fetchAdminData(token) {
    try {
      const [statsResponse, itemsResponse] = await Promise.all([
        fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }),
        fetch('http://localhost:5000/api/admin/items', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      ])

      const statsData = await statsResponse.json()
      const itemsData = await itemsResponse.json()

      console.log('ADMIN STATS:', statsData)
      console.log('ADMIN ITEMS:', itemsData)

      if (!statsResponse.ok) {
        alert(statsData.message)
        return
      }

      if (!itemsResponse.ok) {
        alert(itemsData.message)
        return
      }

      setStats(statsData)
      setItems(itemsData)
    } catch (error) {
      console.log('ADMIN DASHBOARD ERROR:', error)
      alert('Cannot connect to backend')
    } finally {
      setLoading(false)
    }
  }

  async function handleAction(id, action) {
    const token = localStorage.getItem('token')

    try {
      setActionLoading(id)

      let response

      if (action === 'delete') {
        response = await fetch(
          `http://localhost:5000/api/admin/items/${id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } else {
        response = await fetch(
          `http://localhost:5000/api/admin/items/${id}/${action}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }

      const data = await response.json()

      if (!response.ok) {
        alert(data.message)
        return
      }

      alert(data.message)

      await fetchAdminData(token)
    } catch (error) {
      console.log('ADMIN ACTION ERROR:', error)
      alert('Cannot connect to backend')
    } finally {
      setActionLoading(null)
    }
  }

  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <div className="admin-dashboard-container">
          <p className="admin-loading">
            Loading admin dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-container">

        <div className="admin-header">
          <div>
            <p className="admin-label">
              ADMIN PANEL
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Manage lost and found reports
            </p>
          </div>

          <div className="admin-header-actions">
            <Link
              to="/"
              className="admin-home-button"
            >
              Home
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="admin-logout-button"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="admin-stats">

          <div className="admin-stat-card">
            <span>Total Reports</span>
            <strong>{stats.totalItems}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Lost Items</span>
            <strong>{stats.lostItems}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Found Items</span>
            <strong>{stats.foundItems}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Claimed Items</span>
            <strong>{stats.claimedItems}</strong>
          </div>

          <div className="admin-stat-card">
            <span>Closed Items</span>
            <strong>{stats.closedItems}</strong>
          </div>

        </div>

        <section className="admin-section">

          <div className="admin-section-header">
            <div>
              <h2>
                All Reported Items
              </h2>

              <p>
                Review and manage submitted lost and found reports.
              </p>
            </div>

            <span className="admin-item-count">
              {items.length} Reports
            </span>
          </div>

          {items.length === 0 ? (

            <div className="admin-empty">
              <h3>
                No reports available
              </h3>

              <p>
                Submitted reports will appear here.
              </p>
            </div>

          ) : (

            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Type</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Submitted By</th>
                    <th>Approval</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {items.map((item) => {

                    const approvalStatus =
                      item.rejected
                        ? 'REJECTED'
                        : item.approved
                          ? 'APPROVED'
                          : 'PENDING'

                    return (
                      <tr key={item._id}>

                        <td>
                          <strong>
                            {item.title}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`admin-type ${item.type}`}
                          >
                            {item.type.toUpperCase()}
                          </span>
                        </td>

                        <td>
                          {item.category}
                        </td>

                        <td>
                          {item.location}
                        </td>

                        <td>
                          <span className="admin-status">
                            {item.status}
                          </span>
                        </td>

                        <td>
                          <div className="admin-user">
                            <strong>
                              {item.userId?.name || 'Unknown'}
                            </strong>

                            <span>
                              {item.userId?.email || 'N/A'}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`approval-status ${approvalStatus.toLowerCase()}`}
                          >
                            {approvalStatus}
                          </span>
                        </td>

                        <td>

                          <div className="admin-actions">

                            <Link
                              to={`/item/${item._id}`}
                              className="admin-view-button"
                            >
                              View
                            </Link>

                            {!item.approved && !item.rejected && (
                              <>
                                <button
                                  type="button"
                                  className="admin-approve-button"
                                  onClick={() =>
                                    handleAction(
                                      item._id,
                                      'approve'
                                    )
                                  }
                                  disabled={
                                    actionLoading === item._id
                                  }
                                >
                                  Approve
                                </button>

                                <button
                                  type="button"
                                  className="admin-reject-button"
                                  onClick={() =>
                                    handleAction(
                                      item._id,
                                      'reject'
                                    )
                                  }
                                  disabled={
                                    actionLoading === item._id
                                  }
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              className="admin-delete-button"
                              onClick={() =>
                                handleAction(
                                  item._id,
                                  'delete'
                                )
                              }
                              disabled={
                                actionLoading === item._id
                              }
                            >
                              Remove
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

        <section className="admin-section">

          <div className="admin-section-header">
            <div>
              <h2>
                Claimed & Closed Items
              </h2>

              <p>
                View items that have been claimed or closed.
              </p>
            </div>
          </div>

          <div className="admin-closed-summary">

            <div>
              <span>Claimed</span>
              <strong>
                {stats.claimedItems}
              </strong>
            </div>

            <div>
              <span>Closed</span>
              <strong>
                {stats.closedItems}
              </strong>
            </div>

          </div>

        </section>

      </div>
    </div>
  )
}

export default AdminDashboard