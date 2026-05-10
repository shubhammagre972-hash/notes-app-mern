import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import NoteModal from '../components/NoteModal';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../context/ContextProvider';
import API_BASE from '../config';
import { FiSearch } from 'react-icons/fi';

const Home = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(response.data.notes);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchNotes();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleEdit = (note) => {
    setNoteToEdit(note);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setNoteToEdit(null);
    setModalOpen(true);
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Navbar — no search bar here anymore, it's in the hero */}
      <Navbar />

      {/* Hero section */}
      <div
        className="relative bg-cover bg-center h-64 md:h-80"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-45" />

        {/* Hero card */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 w-full max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Notes</h1>
                <p className="text-sm text-gray-500 mt-1">
                  {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved
                </p>
              </div>

              {/* Search input */}
              <div className="flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 w-full md:w-64 shadow-sm">
                <FiSearch className="text-gray-400 flex-shrink-0" size={16} />
                <input
                  id="search-notes"
                  name="search"
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Add button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-medium"
          >
            <span className="text-lg leading-none">+</span>
            Add New Note
          </button>
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>

        ) : filteredNotes.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20 px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-6">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              {searchQuery ? 'No notes match your search.' : 'Write down your ideas'}
            </h2>
            <p className="text-gray-500 max-w-md mx-auto leading-relaxed">
              {searchQuery
                ? 'Try a different keyword.'
                : 'Capture your thoughts, grocery lists, books to read, or anything that inspires you. Your notes are safely stored in the cloud.'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddNew}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Create Your First Note
              </button>
            )}
          </div>

        ) : (
          /* Notes grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNotes.map((note, index) => (
              <NoteCard
                key={note._id}
                note={note}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setNoteToEdit(null);
        }}
        noteToEdit={noteToEdit}
        refreshNotes={fetchNotes}
      />
    </div>
  );
};

export default Home;
