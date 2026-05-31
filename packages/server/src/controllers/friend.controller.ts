import { Request, Response } from 'express';
import { User } from '../models/User';
import { FriendRequest } from '../models/FriendRequest';
import { Friendship } from '../models/Friendship';
import { Notification } from '../models/Notification';
import { getIO } from '../socket';

// Helper to consistently order user IDs for friendships
const getFriendshipIds = (id1: string, id2: string) => {
  return id1 < id2 ? { user1Id: id1, user2Id: id2 } : { user1Id: id2, user2Id: id1 };
};

export const searchUsers = async (req: any, res: Response): Promise<void> => {
  try {
    const { q } = req.query;
    if (!q) {
      res.json([]);
      return;
    }
    
    // Search by username, exclude self
    const users = await User.find({
      username: { $regex: q as string, $options: 'i' },
      _id: { $ne: req.user.id }
    }).select('username profilePicture status');
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
};

export const sendFriendRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { targetUserId } = req.body;
    const userId = req.user.id;

    if (targetUserId === userId) {
      res.status(400).json({ error: 'Cannot send request to yourself' });
      return;
    }

    const { user1Id, user2Id } = getFriendshipIds(userId, targetUserId);
    const existingFriendship = await Friendship.findOne({ user1Id, user2Id });
    if (existingFriendship) {
      res.status(400).json({ error: 'Already friends' });
      return;
    }

    const existingRequest = await FriendRequest.findOne({
      $or: [
        { senderId: userId, receiverId: targetUserId },
        { senderId: targetUserId, receiverId: userId }
      ]
    });

    if (existingRequest) {
      res.status(400).json({ error: 'Friend request already exists' });
      return;
    }

    const friendRequest = await FriendRequest.create({
      senderId: userId,
      receiverId: targetUserId
    });

    const notification = await Notification.create({
      recipientId: targetUserId,
      senderId: userId,
      type: 'friend_request',
      content: 'sent you a friend request',
      relatedEntityId: friendRequest._id as any
    });

    await notification.populate('senderId', 'username profilePicture');
    const io = getIO();
    io.to(`user:${targetUserId}`).emit('new_notification', notification);

    res.status(201).json(friendRequest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send request' });
  }
};

export const acceptFriendRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const receiverId = req.user.id;

    const request = await FriendRequest.findOne({ _id: requestId, receiverId, status: 'pending' });
    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    request.status = 'accepted';
    await request.save();

    const { user1Id, user2Id } = getFriendshipIds(request.senderId.toString(), receiverId);
    await Friendship.create({ user1Id, user2Id });

    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
};

export const rejectFriendRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const receiverId = req.user.id;

    const request = await FriendRequest.findOneAndUpdate(
      { _id: requestId, receiverId, status: 'pending' },
      { status: 'rejected' },
      { new: true }
    );

    if (!request) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject request' });
  }
};

export const getPendingRequests = async (req: any, res: Response): Promise<void> => {
  try {
    const requests = await FriendRequest.find({ receiverId: req.user.id, status: 'pending' })
      .populate('senderId', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
};

export const getFriends = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const friendships = await Friendship.find({
      $or: [{ user1Id: userId }, { user2Id: userId }]
    })
      .populate('user1Id', 'username profilePicture status')
      .populate('user2Id', 'username profilePicture status');

    const friends = friendships.map((f) => {
      // Return the other user
      if (f.user1Id._id.toString() === userId) return f.user2Id;
      return f.user1Id;
    });

    res.json(friends);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
};
