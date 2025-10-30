import axios from "axios";
const API_BASE_URL = "http://localhost:8081/api"; 

const api = axios.create({ baseURL: API_BASE_URL, timeout: 10000 });

export const submitQuiz = async (userId, quizId, answers) => {
  try {
  
    const { data } = await api.post(
      "/quizResult/submit",          // <-- no trailing slash
      answers,                       // body (JSON)
      { params: { userId, quizId } } // query params
    );

    console.log("quizResultServices:submitQuiz() Success:", data);
    return { data, isAdded: true, error: null };
  } catch (err) {
    const msg = err.response?.statusText || err.message || "Request failed";
    console.error("quizResultServices:submitQuiz() Error:", msg);
    return { data: null, isAdded: false, error: msg };
  }
};

const fetchQuizResult = async (userId) => {
  try {
   
    let data = null;
    if (userId) {
      data = await axios.get(
        `${API_BASE_URL}/quizResult/?userId=${userId}`
      );
    }
    else {
      data = await axios.get(
        `${API_BASE_URL}/quizResult/all`
      );
    }
    console.log("quizResultServices:fetchQuizResult() Success: ", data);
    return data.data;
  } catch (error) {
    console.error(
      "quizResultServices:fetchQuizResult() Error: ",
      error.response.statusText
    );
    return null;
  }
};


const quizResultServices = { submitQuiz, fetchQuizResult };

export default quizResultServices;
