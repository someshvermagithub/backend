// backend/routes/chatRoutes.js
const express = require('express');
const { sendMessage, getUserStatus, updateUserStatus, sendMessageWithLLMIntegration } = require('../controllers/chatController');

const router = express.Router();

router.post('/send-message', sendMessage);
router.post('/send-message-with-llm', sendMessageWithLLMIntegration);
router.get('/user-status/:userId', getUserStatus);
router.put('/update-user-status/:userId', updateUserStatus);

module.exports = router;
