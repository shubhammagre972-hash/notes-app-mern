import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/ContextProvider'

const NoteModal = ({ isOpen, onClose, noteToEdit, refreshNotes }) => {
  const { user, token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setDescription(noteToEdit.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [noteToEdit]);

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!title) {
    setError("Title is required.");
    return;
  }

  // Use the token from auth context (already stored after login)
  console.log("🔑 Token from context:", token);
  if (!token) {
    setError("No authentication token. Please log in again.");
    return;
  }

  try {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (noteToEdit) {
      await axios.put(`http://localhost:5000/api/notes/${noteToEdit._id}`, { title, description }, config);
    } else {
      await axios.post('http://localhost:5000/api/notes/add', { title, description }, config);
    }

    onClose();
    refreshNotes();
  } catch (error) {
    setError("Something went wrong. Try again.");
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {noteToEdit ? 'Update Note' : 'Add New Note'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="note-title" className="block text-sm font-medium mb-1">Note Title</label>
            <input
              id="note-title"
              name="title"
              type="text"
              className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="note-description" className="block text-sm font-medium mb-1">Note Description</label>
            <textarea
              id="note-description"
              name="description"
              className="w-full border border-gray-300 p-2 rounded outline-none focus:border-blue-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Enter note description"
            />
          </div>

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {noteToEdit ? 'Update Note' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;