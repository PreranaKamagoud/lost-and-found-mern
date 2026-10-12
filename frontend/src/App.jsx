import './App.css'
import {
  BrowserRouter,
  Routes,
  Route,
  Link
} from 'react-router-dom'

import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ReportLost from './pages/ReportLost.jsx'
import ReportFound from './pages/ReportFound.jsx'
import Listings from './pages/Listings.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'

function Home() {
  return (
    <div className="app">

      <nav className="navbar">
        <h2>Lost & Found</h2>

        <div className="nav-links">
          <Link to="/">Home</Link>

          <Link to="/dashboard">
            Dashboard
          </Link>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Register
          </Link>

          <Link to="/report-lost">
            Report Lost
          </Link>

          <Link to="/report-found">
            Report Found
          </Link>

          <Link to="/listings">
            Listings
          </Link>
        </div>
      </nav>

      <main>

        <section className="hero">
          <h1>
            Find What You Lost.
          </h1>

          <p>
            A simple platform to report lost items
            and help return found items to their owners.
          </p>

          <div className="buttons">

            <Link to="/report-lost">
              Report Lost Item
            </Link>

            <Link to="/report-found">
              Report Found Item
            </Link>

          </div>
        </section>

        <section className="search-section">

          <h2>
            Search for an Item
          </h2>

          <div className="search-box">

            <input
              type="text"
              placeholder="Search phone, wallet, bag..."
            />

            <Link to="/listings">
              Search
            </Link>

            <Link to="/profile">Profile</Link>

          </div>

        </section>

      </main>

    </div>
  )
}

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/report-lost"
          element={<ReportLost />}
        />

        <Route
          path="/report-found"
          element={<ReportFound />}
        />

        <Route
          path="/listings"
          element={<Listings />}
        />

        <Route
          path="/item/:id"
          element={<ItemDetails />}
        />
        <Route 
        path="/profile" 
        element={<Profile />} />

        <Route 
        path="/admin" 
        element={<AdminDashboard />} />

      </Routes>

    </BrowserRouter>
  )
}

export default App