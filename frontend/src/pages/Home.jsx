import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import NoteModal from '../components/NoteModal';
import { useAuth } from '../context/ContextProvider';
import API_BASE from '../config';

const Home = () => {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all notes for the logged-in user
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

  // Delete a note
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

  // Open modal for editing
  const handleEdit = (note) => {
    setNoteToEdit(note);
    setModalOpen(true);
  };

  // Open modal for adding
  const handleAddNew = () => {
    setNoteToEdit(null);
    setModalOpen(true);
  };

  // Filter notes by search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="p-6">
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-6"
        >
          Add New Note
        </button>

        {loading ? (
          <p className="text-gray-500">Loading notes...</p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-gray-500">
            {searchQuery ? 'No notes match your search.' : 'No notes yet. Add your first one!'}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <div
                key={note._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{note.title}</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.description}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(note)}
                    className="text-sm px-3 py-1 bg-yellow-400 hover:bg-yellow-500 rounded text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="text-sm px-3 py-1 bg-red-500 hover:bg-red-600 rounded text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
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
