import express from 'express';
import { 
  registerForEvent, 
  getEventAttendees, 
  checkRegistration,
  cancelRegistration 
} from '../controllers/attendee.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/register', registerForEvent);
router.get('/:eventId', getEventAttendees);
router.get('/check/:eventId/:userId', checkRegistration);
router.delete('/cancel/:eventId', cancelRegistration);

export default router;