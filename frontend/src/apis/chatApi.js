import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

export const getChatHistory = async (sourceId) => {
  const token = localStorage.getItem("access_token");

  const response = await axios.get(`${API_BASE_URL}/chat/${sourceId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const askQuestion = async (sourceId, question) => {
  const token = localStorage.getItem("access_token");

  const response = await axios.post(
    `${API_BASE_URL}/chat`,
    {
      source_id: sourceId,
      question: question,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
