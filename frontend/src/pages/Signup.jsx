import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name, email, password,
      });
      console.log("Signup success:", response.data);
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Try again.");
      }
    }
  }

  return (
    <div className="flex h-screen">
      {/* Left blue panel */}
      <div className="hidden md:flex w-1/2 bg-blue-600 flex-col items-center justify-center relative overflow-hidden px-10">
        <div className="absolute bottom-0 right-0 w-64 h-64 border-2 border-white border-opacity-10 rounded-full translate-x-16 translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 border-2 border-white border-opacity-10 rounded-full translate-x-24 translate-y-24"></div>
        <div className="mb-8">
          <svg width="180" height="140" viewBox="0 0 180 140" fill="none">
            <rect x="20" y="15" width="140" height="90" rx="8" fill="rgba(255,255,255,0.15)"/>
            <rect x="32" y="26" width="116" height="60" rx="5" fill="rgba(255,255,255,0.2)"/>
            <rect x="44" y="36" width="40" height="5" rx="2" fill="rgba(255,255,255,0.7)"/>
            <rect x="44" y="46" width="65" height="4" rx="2" fill="rgba(255,255,255,0.45)"/>
            <rect x="44" y="55" width="50" height="4" rx="2" fill="rgba(255,255,255,0.45)"/>
            <rect x="44" y="67" width="72" height="12" rx="4" fill="rgba(255,255,255,0.55)"/>
            <circle cx="90" cy="120" r="14" fill="rgba(255,255,255,0.2)"/>
            <rect x="80" y="115" width="20" height="10" rx="3" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">Hello!</h2>
        <p className="text-blue-100 text-sm text-center">Create an account and start organizing your notes today.</p>
      </div>

      {/* Right form panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white px-8">
        <div className="w-full max-w-sm">
          <div className="flex gap-6 border-b border-gray-200 mb-7">
            <Link to="/login" className="text-gray-400 font-medium pb-3 text-sm">Login</Link>
            <span className="text-blue-600 font-semibold pb-3 border-b-2 border-blue-600 text-sm cursor-pointer">Register</span>
          </div>

          <form onSubmit={handleSignUp}>
            <div className="mb-4">
              <label htmlFor="signup-name" className="text-xs text-gray-500 mb-1 block">Full name</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 h-11">
                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="3" stroke="#9ca3af" strokeWidth="1.2"/>
                  <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="#9ca3af" strokeWidth="1.2"/>
                </svg>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="signup-email" className="text-xs text-gray-500 mb-1 block">Email address</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 h-11">
                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="#9ca3af" strokeWidth="1.2"/>
                  <path d="M1 5l7 5 7-5" stroke="#9ca3af" strokeWidth="1.2"/>
                </svg>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="signup-password" className="text-xs text-gray-500 mb-1 block">Password</label>
              <div className="flex items-center border border-gray-200 rounded-lg px-3 h-11">
                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="7" width="10" height="8" rx="2" stroke="#9ca3af" strokeWidth="1.2"/>
                  <path d="M5 7V5a3 3 0 016 0v2" stroke="#9ca3af" strokeWidth="1.2"/>
                  <circle cx="8" cy="11" r="1.2" fill="#9ca3af"/>
                </svg>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="Enter password"
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition">
              Create account
            </button>

            <p className="text-xs text-center mt-4 text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup