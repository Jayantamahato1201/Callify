import api from './axios';

export const getNotifications = async () => {
  const { data } = await api.get('/notifications');
  return data;
};

export const markAsRead = async (notificationId: string) => {
  const { data } = await api.put(`/notifications/${notificationId}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await api.put('/notifications/mark-all-read');
  return data;
};
