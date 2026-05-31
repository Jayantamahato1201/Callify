import api from './axios';

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const { data } = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return data.fileUrl; // e.g. /uploads/filename.png
};
