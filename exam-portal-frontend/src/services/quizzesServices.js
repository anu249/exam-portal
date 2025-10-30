import axios from "axios";
const API_BASE_URL = "http://localhost:8081/api"; 
const fetchQuizzes = async ( catId) => {
  try {
   
    let quizzes = null;
    if (catId === null) {
      const { data } = await axios.get(`${API_BASE_URL}/quiz/`);
      quizzes = data;
    } else {
      const { data } = await axios.get(`${API_BASE_URL}/quiz/?catId=${catId}`);
      quizzes = data;
    }
    console.log("quizzesServices:fetchQuizzes() Success: ", quizzes);
    return quizzes;
  } catch (error) {
    console.error(
      "quizzesServices:fetchQuizzes() Error: ",
      error.response.statusText
    );
    return error.response.statusText;
  }
};

const addQuiz = async (quiz) => {
  try {
    
    const { data } = await axios.post(`${API_BASE_URL}/quiz/`, quiz);
    console.log("quizzesServices:addQuiz()  Success: ", data);
    return { data: data, isAdded: true, error: null };
  } catch (error) {
    console.error(
      "quizzesServices:addQuiz()  Error: ",
      error.response.statusText
    );
    return { data: null, isAdded: false, error: error.response.statusText };
  }
};

const deleteQuiz = async (quizId,) => {
  try {
    
    const { data } = await axios.delete(`${API_BASE_URL}/quiz/${quizId}/`);
    console.log("quizzesServices:deleteQuiz()  Success: ", data);
    return {
      isDeleted: true,
      error: null,
    };
  } catch (error) {
    console.error(
      "quizzesServices:deleteQuiz()  Error: ",
      error.response.statusText
    );
    return {
      isDeleted: false,
      error: error.response.statusText,
    };
  }
};

const updateQuiz = async (quiz) => {
  console.log(quiz);
  try {
    
    const { data } = await axios.put(`${API_BASE_URL}/quiz/${quiz.quizId}/`, quiz);
    console.log("quizzesServices:updateQuiz()  Success: ", data);
    return {
      data: data,
      isUpdated: true,
      error: null,
    };
  } catch (error) {
    console.error(
      "quizzesServices:updateQuiz()  Error: ",
      error.response.statusText
    );
    return {
      data: null,
      isUpdated: false,
      error: error.response.statusText,
    };
  }
};

const quizzesService = { fetchQuizzes, addQuiz, deleteQuiz, updateQuiz };
export default quizzesService;
