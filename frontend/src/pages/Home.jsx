import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import NoteModal from '../components/NoteModal';
import NoteCard from '../components/NoteCard';
import { useAuth } from '../context/ContextProvider';
import API_BASE from '../config';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900 relative overflow-hidden">

      {/* Dot texture overlay — same as login left panel */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Decorative circles — same as login page */}
      <div className="absolute top-0 right-0 w-64 h-64 border-2 border-white border-opacity-10 rounded-full translate-x-16 -translate-y-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 border-2 border-white border-opacity-10 rounded-full -translate-x-24 translate-y-24 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="max-w-6xl mx-auto px-6 py-8">

          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">My Notes</h1>
              <p className="text-blue-200 text-sm mt-1">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'} saved
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search bar — matches login input style */}
              <div className="flex items-center border border-gray-200 rounded-lg px-3 h-11 bg-white w-full sm:w-64">
                <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" viewBox="0 0 16 16" fill="none">
                  <path d="M11 11L15 15M13 7a6 6 0 11-12 0 6 6 0 0112 0z" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <input
                  id="search-notes"
                  name="search"
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
                />
              </div>

              {/* Add button */}
              <button
                onClick={handleAddNew}
                className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-md hover:shadow-lg whitespace-nowrap"
              >
                + Add New Note
              </button>
            </div>
          </div>

          {/* Loading spinner */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
            </div>

          ) : filteredNotes.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20 px-4">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-6">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                {searchQuery ? 'No notes match your search.' : 'Write down your ideas'}
              </h2>
              <p className="text-blue-200 max-w-md mx-auto leading-relaxed">
                {searchQuery
                  ? 'Try a different keyword.'
                  : 'Capture your thoughts, grocery lists, books to read, or anything that inspires you. Your notes are safely stored in the cloud.'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleAddNew}
                  className="mt-6 px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
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
