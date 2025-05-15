import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema(
  {
    event_id: {
      type: String,
      required: true,
      ref: 'Listing'
    },
    user_id: {
      type: String,
      required: true,
      ref: 'User'
    },
    username: {
      type: String,
      required: true,
    },
    user_email: {
      type: String,
      required: true,
    },
    user_avatar: {
      type: String,
      required: true,
    },
    user_phone: {
      type: String,
      required: true,
    },
    college_id: {
      type: String,
      required: true,
    },
    college_name: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
    batch_passing: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

const Attendee = mongoose.model('Attendee', attendeeSchema);

export default Attendee;