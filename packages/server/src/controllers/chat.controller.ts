import { Request, Response } from 'express';
import { Conversation } from '../models/Conversation';
import { Message } from '../models/Message';
import { getIO } from '../socket';

export const getConversations = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const conversations = await Conversation.find({ participants: userId })
      .populate('participants', 'username profilePicture status')
      .populate('lastMessageId')
      .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

export const getMessages = async (req: any, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    // Verify user is part of the conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: req.user.id
    });

    if (!conversation) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const messages = await Message.find({ conversationId })
      .populate('senderId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const sendMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { conversationId, content, type = 'text', fileUrl } = req.body;
    const senderId = req.user.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: senderId
    });

    if (!conversation) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
      type,
      fileUrl,
      readBy: [{ userId: senderId, readAt: new Date() }]
    });

    conversation.lastMessageId = message._id as any;
    conversation.updatedAt = new Date();
    await conversation.save();

    await message.populate('senderId', 'username profilePicture');

    // Broadcast message via Socket.IO
    const io = getIO();
    io.to(`conversation:${conversationId}`).emit('receive_message', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const createOrGetDirectConversation = async (req: any, res: Response): Promise<void> => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;

    let conversation = await Conversation.findOne({
      type: 'direct',
      participants: { $all: [userId, targetUserId] }
    }).populate('participants', 'username profilePicture status');

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        participants: [userId, targetUserId]
      });
      await conversation.populate('participants', 'username profilePicture status');
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get/create conversation' });
  }
};

export const createGroupConversation = async (req: any, res: Response): Promise<void> => {
  try {
    const { name, participantIds } = req.body; // participantIds should be an array of friend IDs
    const userId = req.user.id;

    if (!name || !participantIds || participantIds.length === 0) {
      res.status(400).json({ error: 'Name and participants are required' });
      return;
    }

    const participants = [userId, ...participantIds];
    
    const conversation = await Conversation.create({
      type: 'group',
      participants,
      groupMetadata: {
        name,
        adminIds: [userId]
      }
    });

    await conversation.populate('participants', 'username profilePicture status');
    
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create group conversation' });
  }
};

export const addGroupMember = async (req: any, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const { userIdToAdd } = req.body;
    const currentUserId = req.user.id;

    const conversation = await Conversation.findOne({ _id: conversationId, type: 'group' });
    
    if (!conversation) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    if (!conversation.groupMetadata?.adminIds.includes(currentUserId as any)) {
      res.status(403).json({ error: 'Only admins can add members' });
      return;
    }

    if (conversation.participants.includes(userIdToAdd as any)) {
      res.status(400).json({ error: 'User is already a member' });
      return;
    }

    conversation.participants.push(userIdToAdd as any);
    await conversation.save();
    
    res.json({ message: 'Member added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add member' });
  }
};

export const removeGroupMember = async (req: any, res: Response): Promise<void> => {
  try {
    const { conversationId } = req.params;
    const { userIdToRemove } = req.body;
    const currentUserId = req.user.id;

    const conversation = await Conversation.findOne({ _id: conversationId, type: 'group' });
    
    if (!conversation) {
      res.status(404).json({ error: 'Group not found' });
      return;
    }

    const isAdmin = conversation.groupMetadata?.adminIds.includes(currentUserId as any);
    const isSelf = currentUserId === userIdToRemove;

    if (!isAdmin && !isSelf) {
      res.status(403).json({ error: 'Only admins can remove other members' });
      return;
    }

    conversation.participants = conversation.participants.filter(p => p.toString() !== userIdToRemove);
    await conversation.save();

    res.json({ message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove member' });
  }
};
