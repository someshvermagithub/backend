// backend/controllers/chatController.js
const Message = require('../models/Message');
const User = require('../models/User');
const { getLLMResponse } = require('../utils/llmIntegration');

exports.sendMessage = async (req, res) => {
  try {
    const { userId, chatId, text } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const message = new Message({ text, userId, chatId });
    await message.save();
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ status: user.status });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.status = status;
    await user.save();
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessageWithLLMIntegration = async (req, res) => {
  try {
    const { userId, chatId, text } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const recipient = await User.findById(chatId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }
    if (recipient.status === 'BUSY') {
      const llmResponse = await getLLMResponse(text);
      return res.json({ message: llmResponse });
    }
    const message = new Message({ text, userId, chatId });
    await message.save();
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};