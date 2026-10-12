
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ReportFound.css'

function ReportFound() {
  const [matches, setMatches] = useState([])
  const [showMatches, setShowMatches] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.target

    const title = form.title.value
    const category = form.category.value
    const location = form.location.value
    const date = form.date.value
    const description = form.description.value
    const contact = form.contact.value

    if (
      title.trim() === '' ||
      category.trim() === '' ||
      location.trim() === '' ||
      date === '' ||
      description.trim() === '' ||
      contact.trim() === ''
    ) {
      alert('Please fill all fields')
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please login first')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/items',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },

          body: JSON.stringify({
            type: 'found',
            title: title,
            category: category,
            location: location,
            date: date,
            description: description,
            contact: contact
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        setMatches(data.matches || [])
        setShowMatches(true)

        alert('Found item reported successfully!')

        form.reset()

        console.log('Saved item:', data.item)
        console.log('Possible matches:', data.matches)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.log(error)
      alert('Cannot connect to the backend')
    }
  }

  return (
    <div className="report-found-page">

      <div className="report-found-box">

        <h1>Report Found Item</h1>

        <p className="report-found-subtitle">
          Provide details about the item you found
        </p>

        <form onSubmit={handleSubmit}>

          <label>Item Name</label>

          <input
            type="text"
            name="title"
            placeholder="Example: Black Wallet"
          />

          <label>Category</label>

          <select name="category">

            <option value="">
              Select category
            </option>

            <option value="Mobile">
              Mobile
            </option>

            <option value="Wallet">
              Wallet
            </option>

            <option value="Bag">
              Bag
            </option>

            <option value="Documents">
              Documents
            </option>

            <option value="Keys">
              Keys
            </option>

            <option value="Electronics">
              Electronics
            </option>

            <option value="Other">
              Other
            </option>

          </select>

          <label>Location Found</label>

          <input
            type="text"
            name="location"
            placeholder="Example: College Campus"
          />

          <label>Date Found</label>

          <input
            type="date"
            name="date"
          />

          <label>Description</label>

          <textarea
            name="description"
            placeholder="Describe the item..."
            rows="4"
          ></textarea>

          <label>Contact Information</label>

          <input
            type="text"
            name="contact"
            placeholder="Enter phone or email"
          />

          <button type="submit">
            Report Found Item
          </button>

        </form>

      </div>

      {showMatches && (
        <div className="found-matches-section">

          <h2>
            Possible Lost Item Matches
          </h2>

          {matches.length === 0 ? (

            <div className="no-matches">
              <h3>No matching lost items found</h3>

              <p>
                Your found item has been reported successfully.
              </p>
            </div>

          ) : (

            <div className="matches-list">

              {matches.map((match) => (

                <div
                  className="match-card"
                  key={match.item._id}
                >

                  <div className="match-header">

                    <h3>
                      {match.item.title}
                    </h3>

                    <span>
                      Match Score: {match.score}%
                    </span>

                  </div>

                  <p>
                    <strong>Category:</strong>{' '}
                    {match.item.category}
                  </p>

                  <p>
                    <strong>Location:</strong>{' '}
                    {match.item.location}
                  </p>

                  <p>
                    <strong>Date:</strong>{' '}
                    {match.item.date}
                  </p>

                  <p>
                    <strong>Description:</strong>{' '}
                    {match.item.description}
                  </p>

                  <Link
                    to={`/item/${match.item._id}`}
                    className="match-view-button"
                  >
                    View Lost Item
                  </Link>

                </div>

              ))}

            </div>

          )}

        </div>
      )}

    </div>
  )
}

export default ReportFound

