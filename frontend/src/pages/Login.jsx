
import './Login.css'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  async function handleSubmit(event) {
    event.preventDefault()

    const form = event.target

    const email = form.email.value
    const password = form.password.value

    if (email.trim() === '') {
      alert('Please enter your email')
      return
    }

    if (password.trim() === '') {
      alert('Please enter your password')
      return
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify({
            email: email,
            password: password
          })
        }
      )

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)

        localStorage.setItem(
          'user',
          JSON.stringify(data.user)
        )

        alert('Login successful!')

        if (data.user.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.log(error)
      alert('Cannot connect to the backend')
    }
  }

  return (
    <div className="login-page">

      <div className="login-box">

        <h1>Login</h1>

        <p className="login-subtitle">
          Login to your Lost & Found account
        </p>

        <form onSubmit={handleSubmit}>

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
          />

          <button type="submit">
            Login
          </button>

        </form>

      </div>

    </div>
  )
}

export default Login

