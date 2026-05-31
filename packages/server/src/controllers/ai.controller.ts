import { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { env } from '../config/env';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';

const ai = new GoogleGenAI({ apiKey: env.geminiApiKey });

export const generateSmartReplies = async (req: any, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    // Verify conversation access
    const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    // Get last 5 messages to provide context
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('senderId', 'username');
    
    if (messages.length === 0) {
      res.json(['Hello!', 'How are you?', 'Hi there!']);
      return;
    }

    const contextMessages = messages.reverse().map(msg => 
      `${(msg.senderId as any).username}: ${msg.content}`
    ).join('\n');

    const prompt = `
You are an AI generating smart, brief, and contextual quick replies for a chat application.
Based on the following recent conversation history, generate exactly 3 short possible replies the current user can send.
Keep each reply under 10 words. 
Format the output as a strict JSON array of strings. Do not use markdown blocks or any other text.
Conversation:
${contextMessages}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const replyText = response.text || "[]";
    // Strip markdown formatting if any
    const cleanJson = replyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const replies = JSON.parse(cleanJson);

    res.json(replies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate smart replies' });
  }
};

export const summarizeConversation = async (req: any, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({ _id: conversationId, participants: userId });
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    // Get last 50 messages
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('senderId', 'username');

    if (messages.length === 0) {
      res.json({ summary: 'There are no messages in this conversation yet.' });
      return;
    }

    const contextMessages = messages.reverse().map(msg => 
      `${(msg.senderId as any).username}: ${msg.content}`
    ).join('\n');

    const prompt = `
You are an AI assistant in a chat application.
Please provide a concise, readable summary of the following conversation.
Capture the main topics discussed, any decisions made, and key context. Keep it under 100 words.

Conversation:
${contextMessages}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to summarize conversation' });
  }
};
