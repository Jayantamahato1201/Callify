import api from './axios';

export const login = async (email: string, password: string) => {
  const { data } = await api.post('/auth/login', { email, password });
  return data;
};

export const register = async (username: string, email: string, password: string) => {
  const { data } = await api.post('/auth/register', { username, email, password });
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.user;
};

export const updateProfile = async (updates: { profilePicture?: string, username?: string }) => {
  const { data } = await api.put('/auth/update-profile', updates);
  return data.user;
};
