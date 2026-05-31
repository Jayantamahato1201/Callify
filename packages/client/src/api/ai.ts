import api from './axios';

export const getSmartReplies = async (conversationId: string) => {
  const { data } = await api.get(`/ai/${conversationId}/smart-replies`);
  return data;
};

export const getConversationSummary = async (conversationId: string) => {
  const { data } = await api.get(`/ai/${conversationId}/summarize`);
  return data;
};
