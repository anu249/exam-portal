import * as quizResultConstants from "../constants/quizResultConstants";
import quizResultServices from "../services/quizResultServices";

export const submitQuiz = async (dispatch, userId, quizId, answers) => {
  dispatch({ type: quizResultConstants.ADD_QUIZ_RESULT_REQUEST });
  const { data, isAdded, error } = await quizResultServices.submitQuiz(
    userId,
    quizId,
    answers,
    
  );
  if (isAdded) {
    return dispatch({
      type: quizResultConstants.ADD_QUIZ_RESULT_SUCCESS,
      payload: data,
    });
  } else {
    return dispatch({
      type: quizResultConstants.ADD_QUIZ_RESULT_FAILURE,
      payload: error,
    });
  }
};

export const fetchQuizResult = async (dispatch, userId) => {
  dispatch({ type: quizResultConstants.FETCH_QUIZ_RESULT_REQUEST });
  const data = await quizResultServices.fetchQuizResult(userId);
  if (data) {
    return dispatch({
      type: quizResultConstants.FETCH_QUIZ_RESULT_SUCCESS,
      payload: data,
    });
  } else {
    return dispatch({
      type: quizResultConstants.FETCH_QUIZ_RESULT_FAILURE,
      payload: data,
    });
  }
};

