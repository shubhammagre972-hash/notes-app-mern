import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { FiSearch, FiLogOut } from 'react-icons/fi';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        NoteApp
      </Link>

      {/* Search bar */}
      <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2 w-72">
        <FiSearch className="text-gray-400 flex-shrink-0" size={16} />
        <input
          id="search-notes"
          name="search"
          type="text"
          placeholder="Search notes..."
          value={searchQuery || ''}
          onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
          className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {/* Avatar + name */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
            >
              <FiLogOut size={15} />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all">
              Login
            </Link>
            <Link to="/signup"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
