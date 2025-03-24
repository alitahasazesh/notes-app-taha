const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: false,
  },
});

module.exports = mongoose.model("Note", NoteSchema);
