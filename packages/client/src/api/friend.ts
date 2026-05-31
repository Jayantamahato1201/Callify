import api from './axios';

export const searchUsers = async (query: string) => {
  const { data } = await api.get(`/friends/search?q=${query}`);
  return data;
};

export const getFriends = async () => {
  const { data } = await api.get('/friends');
  return data;
};

export const getPendingRequests = async () => {
  const { data } = await api.get('/friends/requests/pending');
  return data;
};

export const sendFriendRequest = async (targetUserId: string) => {
  const { data } = await api.post('/friends/requests', { targetUserId });
  return data;
};

export const acceptFriendRequest = async (requestId: string) => {
  const { data } = await api.put(`/friends/requests/${requestId}/accept`);
  return data;
};

export const rejectFriendRequest = async (requestId: string) => {
  const { data } = await api.put(`/friends/requests/${requestId}/reject`);
  return data;
};
