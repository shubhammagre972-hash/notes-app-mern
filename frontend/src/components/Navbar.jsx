import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/ContextProvider'

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div className="text-xl font-bold">
        <Link to="/">NoteApp</Link>
      </div>

      <input
        id="search-notes"
        name="search"
        type="text"
        placeholder="Search notes..."
        value={searchQuery || ''}
        onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
        className="bg-gray-600 px-4 py-2 rounded text-white placeholder-gray-300 outline-none"
      />

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="mr-2">{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-blue-500 px-4 py-2 rounded">Login</Link>
            <Link to="/signup" className="bg-green-500 px-4 py-2 rounded">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
