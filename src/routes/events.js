import express from 'express';
import { upload } from '../middleware/upload.js';
import { authenticateToken } from '../middleware/auth.js';
import Event from '../models/Event.js';

const router = express.Router();

// Create event
router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, date, description } = req.body;

    const event = await Event.create({
      title,
      date: new Date(date),
      description,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({
      order: [['date', 'ASC']]
    });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error: error.message });
  }
});

// Update event
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const { title, date, description } = req.body;
    
    await event.update({
      title: title || event.title,
      date: date ? new Date(date) : event.date,
      description: description || event.description,
      image: req.file ? `/uploads/${req.file.filename}` : event.image
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// Delete event
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

export default router;