import api from './axios';

export const getConversations = async () => {
  const { data } = await api.get('/chat/conversations');
  return data;
};

export const getMessages = async (conversationId: string) => {
  const { data } = await api.get(`/chat/conversations/${conversationId}/messages`);
  return data;
};

export const sendMessage = async (conversationId: string, content: string, type: string = 'text', fileUrl?: string) => {
  const { data } = await api.post('/chat/messages', { conversationId, content, type, fileUrl });
  return data;
};

export const createOrGetDirectConversation = async (targetUserId: string) => {
  const { data } = await api.post('/chat/conversations/direct', { targetUserId });
  return data;
};

export const createGroupConversation = async (name: string, participantIds: string[]) => {
  const { data } = await api.post('/chat/conversations/group', { name, participantIds });
  return data;
};
