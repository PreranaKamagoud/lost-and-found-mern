
import './Register.css'

function Register() {
  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.target

    const fullName = form.fullName.value.trim()
    const email = form.email.value.trim()
    const phone = form.phone.value.trim()
    const password = form.password.value
    const confirmPassword = form.confirmPassword.value

    if (fullName === '') {
      alert('Please enter your full name')
      return
    }

    if (email === '') {
      alert('Please enter your email')
      return
    }

    if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email address')
      return
    }

    if (phone === '') {
      alert('Please enter your phone number')
      return
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number')
      return
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }

    if (confirmPassword === '') {
      alert('Please confirm your password')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: fullName,
            email: email,
            password: password
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        alert('Registration successful!')
        form.reset()
      } else {
        alert(data.message || 'Registration failed')
      }
    } catch (error) {
      console.log(error)
      alert('Cannot connect to the backend')
    }
  }

  return (
    <div className="register-page">

      <div className="register-box">

        <h1>Create Account</h1>

        <p className="register-subtitle">
          Create your Lost & Found account
        </p>

        <form onSubmit={handleSubmit}>

          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
          />

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
          />

          <label>Phone Number</label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
          />

          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
          />

          <button type="submit">
            Register
          </button>

        </form>

        <p className="login-text">
          Already have an account? Login
        </p>

      </div>

    </div>
  )
}

export default Register

