import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token");

  return {
    Authorization: `Bearer ${token}`,
  };
};
export const UploadPdf = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post(`${API_BASE_URL}/source/pdf`, formData, {
    headers: {
      ...getAuthHeaders(),
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getSources = async () => {
  const response = await axios.get(`${API_BASE_URL}/source/`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};
