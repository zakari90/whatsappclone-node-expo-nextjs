import Message from "../models/message.js";

export const getMessages = async (req, res) => {
  try {
    const senderId = req.userId;

    if (!senderId) {
      return res.status(400).json({
        success: false,
        message: "senderId required",
      });
    }
    const messages = await Message.find({
        $or: [
          { senderId: senderId },
          { receiverId: senderId },
        ],
    })

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message || "Unknown error",
    });
  }
}