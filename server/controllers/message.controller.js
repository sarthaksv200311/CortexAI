import imagekit from "../configs/imagekit.js";
import Chat from "../models/Chat.model.js";
import User from "../models/User.model.js";
import openai from "../configs/openai.config.js";
import axios from "axios";

// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    // Check Credits
    if (req.user.credits < 1) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }
    const { chatId, prompt } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });
    chat.messages.push({
      role: "user",
      content: prompt,
      timestamps: Date.now(),
      isImage: false,
    });

    const { choices } = await openai.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = {
      role: choices[0].message.role,
      content: choices[0].message.content,
      timestamps: Date.now(),
      isImage: false,
    };

    res.json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -1 } });

    res.json({ success: true, reply });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Image Generation Message Controller
export const imageMessageController = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.credits < 2) {
      return res.json({
        success: false,
        message: "You don't have enough credits to use this feature",
      });
    }

    const { prompt, chatId, isPublished } = req.body;

    const chat = await Chat.findOne({ userId, _id: chatId });

    chat.messages.push({
      role: "user",
      content: prompt,
      timestamps: Date.now(),
      isImage: false,
    });

    // Step 1: Construct ImageKit URL
    const encodePrompt = encodeURIComponent(prompt);
    const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodePrompt}/CortexAI/${Date.now()}.png?tr=w-800,h-800`;

    // Step 2: Fetch image from ImageKit
    const aiImageResponse = await axios.get(generatedImageUrl, {
      responseType: "arraybuffer",
    });

    // Step 3: Convert to Base64
    const rawBuffer = Buffer.from(aiImageResponse.data, "binary");

    const base64Image = `data:image/png;base64,${rawBuffer.toString("base64")}`;

    // Step 4: Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: base64Image,
      fileName: `${Date.now()}.png`,
      folder: "CortexAI",
    });

    const reply = {
      role: "assistant",
      content: uploadResponse.url,
      timestamps: Date.now(),
      isImage: true,
      isPublished,
    };

    res.json({ success: true, reply });

    chat.messages.push(reply);
    await chat.save();

    await User.updateOne({ _id: userId }, { $inc: { credits: -2 } });
  } catch (error) {
    if (error.response) {
      Buffer.isBuffer(error.response.data)
        ? error.response.data.toString("utf8")
        : error.response.data;
    }

    res.json({ success: false, message: error.message });
  }
};

// API to get published images
export const getPublishedImages = async (req, res) => {
  try {
    const publishedImageMessages = await Chat.aggregate([
      { $unwind: "$messages" },
      {
        $match: {
          "messages.isImage": true,
        },
      },
      { $sort: { "messages.timestamps": -1 } },
      { $limit: 20 },
      {
        $project: {
          _id: 0,
          imageUrl: "$messages.content",
          userName: "$userName",
        },
      },
    ]);

    res.json({ success: true, images: publishedImageMessages });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
