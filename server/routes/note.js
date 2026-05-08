import express from 'express';
import Note from '../models/Note.js';
import authMiddleware from '../middleware/middleware.js';

const router = express.Router();

// CREATE a note
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newNote = new Note({
      title,
      description,
      userId: req.userId   // from auth middleware
    });
    await newNote.save();
    res.status(201).json({ success: true, note: newNote, message: 'Note created' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// READ all notes for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// UPDATE a note
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { title, description },
      { new: true }
    );
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, note, message: 'Note updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE a note
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }
    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;