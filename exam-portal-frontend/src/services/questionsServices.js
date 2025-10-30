// src/services/questionsServices.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

// Single axios instance for this service
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// ---- GET /api/question/?quizId=123
export const fetchQuestionsByQuiz = async (quizId) => {
  // Guard against null/undefined/NaN
  if (quizId == null || quizId === "" || Number.isNaN(Number(quizId))) {
    console.warn("fetchQuestionsByQuiz blocked, bad quizId:", quizId);
    return []; // always return an array for callers that iterate
  }

  try {
    const { data } = await api.get("/question/", { params: { quizId } });
    console.log("questionsServices:fetchQuestionsByQuiz() Success:", data);
    return data ?? [];
  } catch (err) {
    const msg = err.response?.statusText || err.message || "Request failed";
    console.error("questionsServices:fetchQuestionsByQuiz() Error:", msg);
    return []; // keep type stable
  }
};

// ---- POST /api/question/
const addQuestion = async (question) => {
  try {
    const { data } = await api.post("/question/", question);
    console.log("questionsServices:addQuestion() Success:", data);
    return { data, isAdded: true, error: null };
  } catch (err) {
    const msg = err.response?.statusText || err.message || "Request failed";
    console.error("questionsServices:addQuestion() Error:", msg);
    return { data: null, isAdded: false, error: msg };
  }
};

// ---- DELETE /api/question/{quesId}
const deleteQuestion = async (quesId) => {
  try {
    await api.delete(`/question/${quesId}`);
    console.log("questionsServices:deleteQuestion() Success:", quesId);
    return { isDeleted: true, error: null };
  } catch (err) {
    const msg = err.response?.statusText || err.message || "Request failed";
    console.error("questionsServices:deleteQuestion() Error:", msg);
    return { isDeleted: false, error: msg };
  }
};

// ---- PUT /api/question/{quesId}
const updateQuestion = async (question) => {
  try {
    const { data } = await api.put(`/question/${question.quesId}`, question);
    console.log("questionsServices:updateQuestion() Success:", data);
    return { data, isUpdated: true, error: null };
  } catch (err) {
    const msg = err.response?.statusText || err.message || "Request failed";
    console.error("questionsServices:updateQuestion() Error:", msg);
    return { data: null, isUpdated: false, error: msg };
  }
};

const questionsServices = {
  fetchQuestionsByQuiz,
  addQuestion,
  deleteQuestion,
  updateQuestion,
};

export default questionsServices;
