import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

export const getNotifications = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ recipientId: userId })
      .populate('senderId', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: any, res: Response): Promise<void> => {
  try {
    const { notificationId } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};

export const markAllAsRead = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    await Notification.updateMany(
      { recipientId: userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
};
