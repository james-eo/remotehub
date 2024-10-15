import Conversation from "../models/conversationModel.js";
import ErrorResponse from "../utils/errorResponse.js";

export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ participants: req.user.id })
      .populate("participants", "firstName lastName")
      .sort({ lastMessageTimestamp: -1 });
    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return next(new ErrorResponse("Conversation not found", 404));
    }
    if (!conversation.participants.includes(req.user.id)) {
      return next(
        new ErrorResponse("Not authorized to view this conversation", 403)
      );
    }
    res.status(200).json({
      success: true,
      data: conversation.messages,
    });
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return next(new ErrorResponse("Conversation not found", 404));
    }
    if (!conversation.participants.includes(req.user.id)) {
      return next(
        new ErrorResponse(
          "Not authorized to send messages in this conversation",
          403
        )
      );
    }
    const newMessage = {
      senderId: req.user.id,
      content: req.body.content,
    };
    conversation.messages.push(newMessage);
    conversation.lastMessage = req.body.content;
    conversation.lastMessageTimestamp = Date.now();
    await conversation.save();
    res.status(201).json({
      success: true,
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};
