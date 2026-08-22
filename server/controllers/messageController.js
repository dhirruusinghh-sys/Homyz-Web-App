import Message from '../models/Message.js';
import User from '../models/User.js';
import { getIO } from '../socket.js';

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  if (!content || !receiverId) {
    return res.status(400).json({ message: "Invalid data passed into request" });
  }

  const newMessage = {
    sender: req.user._id,
    receiver: receiverId,
    content: content,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name avatar");
    message = await message.populate("receiver", "name avatar");

    // Emit the socket event to the receiver
    try {
      const io = getIO();
      // Emitting to the specific user's room using their ID
      io.to(receiverId.toString()).emit("messageReceived", message);
    } catch (socketErr) {
      console.error("Socket error on send message:", socketErr);
    }

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all messages for a user
// @route   GET /api/messages
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { receiver: req.user._id }],
    })
      .populate("sender", "name email avatar")
      .populate("receiver", "name email avatar")
      .sort({ createdAt: 1 }); // Sort by chronological order

    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
