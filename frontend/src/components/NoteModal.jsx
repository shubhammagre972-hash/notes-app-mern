import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/ContextProvider';
import { FiX, FiSave, FiEdit3 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import API_BASE from '../config';

const NoteModal = ({ isOpen, onClose, noteToEdit, refreshNotes }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  // Populate fields when editing an existing note
  useEffect(() => {
    if (noteToEdit) {
      setTitle(noteToEdit.title);
      setDescription(noteToEdit.description);
    }
  }, [noteToEdit]);

  // Clear fields when opening modal for a new note
  useEffect(() => {
    if (isOpen && !noteToEdit) {
      setTitle('');
      setDescription('');
      setError(null);
    }
  }, [isOpen, noteToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const payload = { title: title.trim(), description: description.trim() };

      if (noteToEdit) {
        await axios.put(`${API_BASE}/api/notes/${noteToEdit._id}`, payload, config);
        toast.success('Note updated!');
      } else {
        await axios.post(`${API_BASE}/api/notes/add`, payload, config);
        toast.success('Note added!');
      }

      onClose();
      refreshNotes();
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      setError(err?.response?.data?.message || 'Request failed');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Gradient header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="bg-white/20 p-2 rounded-lg">
                {noteToEdit
                  ? <FiEdit3 className="text-white text-lg" />
                  : <FiSave className="text-white text-lg" />}
              </span>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {noteToEdit ? 'Edit Note' : 'Create Note'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <FiX size={22} />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1 ml-12">
            {noteToEdit ? 'Modify your note details below.' : 'Capture your thoughts in a note.'}
          </p>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <div>
            <label htmlFor="note-title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              id="note-title"
              name="title"
              type="text"
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 placeholder-gray-400"
              placeholder="e.g., Project Review Prep"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="note-description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="note-description"
              name="description"
              rows="5"
              className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-700 placeholder-gray-400 resize-none"
              placeholder="Write your note details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              {noteToEdit ? 'Save Changes' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
