import './ReportLost.css'

function ReportLost() {

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

            type: 'lost',
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

        alert('Lost item reported successfully!')

        form.reset()

        console.log('Saved item:', data.item)

      } else {

        alert(data.message)

      }


    } catch (error) {

      console.log(error)

      alert('Cannot connect to the backend')

    }

  }


  return (

    <div className="report-lost-page">

      <div className="report-lost-box">

        <h1>Report Lost Item</h1>

        <p className="report-lost-subtitle">
          Provide details about the item you lost
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


          <label>Location Lost</label>

          <input
            type="text"
            name="location"
            placeholder="Example: College Campus"
          />


          <label>Date Lost</label>

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
            Report Lost Item
          </button>

        </form>

      </div>

    </div>

  )
}

export default ReportLost