import Attendee from '../models/attendee.model.js';
import { errorHandler } from '../utils/error.js';

// Register for an event
export const registerForEvent = async (req, res, next) => {
  try {
    const newAttendee = await Attendee.create(req.body);
    res.status(201).json(newAttendee);
  } catch (error) {
    next(error);
  }
};

// Get all attendees for a specific event
export const getEventAttendees = async (req, res, next) => {
  try {
    const attendees = await Attendee.find({ event_id: req.params.eventId });
    res.status(200).json(attendees);
  } catch (error) {
    next(error);
  }
};

// Check if user is registered for an event
export const checkRegistration = async (req, res, next) => {
  try {
    const registration = await Attendee.findOne({
      event_id: req.params.eventId,
      user_id: req.params.userId
    });
    res.status(200).json({ isRegistered: !!registration });
  } catch (error) {
    next(error);
  }
};

// Cancel registration
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Attendee.findOneAndDelete({
      event_id: req.params.eventId,
      user_id: req.params.userId
    });
    if (!registration) {
      return next(errorHandler(404, 'Registration not found'));
    }
    res.status(200).json('Registration cancelled successfully');
  } catch (error) {
    next(error);
  }
};