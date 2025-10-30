import React, { useEffect, useRef, useState } from "react";
import "./UserQuestionsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, ProgressBar } from "react-bootstrap";
import { fetchQuestionsByQuiz } from "../../actions/questionsActions";
import Question from "../../components/Question";
import Loader from "../../components/Loader";
import swal from "sweetalert";
import * as quizResultConstants from "../../constants/quizResultConstants";
import { submitQuiz } from "../../actions/quizResultActions";
import { fetchQuizzes } from "../../actions/quizzesActions";

/** util: zeroPad without touching Number.prototype */
const zeroPad = (n) => String(n).padStart(2, "0");

const UserQuestionsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = urlParams.get("quizId");
  const quizTitle = urlParams.get("quizTitle");

  const quizzesReducer = useSelector((state) => state.quizzesReducer);
  const [quizzes, setQuizzes] = useState(quizzesReducer.quizzes || []);
  const [quiz, setQuiz] = useState(
    (quizzes || []).find((q) => String(q.quizId) === String(quizId)) || null
  );

  const questionsReducer = useSelector((state) => state.questionsReducer);
  const [questions, setQuestions] = useState(questionsReducer.questions || []);

  //const token = JSON.parse(localStorage.getItem("jwtToken"));
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user.userId : null;

  // timer state
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const intervalRef = useRef(null);

  // redirect to login if no token
  useEffect(() => {
    if (!localStorage.getItem("user")) navigate("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch quizzes if not present
  useEffect(() => {
    if (!quizzes || quizzes.length === 0) {
      fetchQuizzes(dispatch).then((data) => {
        const temp = data.payload || [];
        setQuizzes(temp);
        setQuiz(temp.find((q) => String(q.quizId) === String(quizId)) || null);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch questions for quiz
  useEffect(() => {
    fetchQuestionsByQuiz(dispatch, quizId).then((data) => {
      const payload = data.payload || [];
      setQuestions(payload);
      // default: 2 minutes per question
      setTimeRemaining(payload.length * 2 * 60);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  // start ticking once we know the duration
  useEffect(() => {
    if (timeRemaining <= 0 || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          // time's up -> auto-submit
          submitQuizHandler(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  const submitQuizHandler = (isTimesUp = false) => {
    const answers = JSON.parse(localStorage.getItem("answers"));

    const doSubmit = () =>
      submitQuiz(dispatch, userId, quizId, answers).then((data) => {
        if (data.type === quizResultConstants.ADD_QUIZ_RESULT_SUCCESS) {
          swal(
            "Quiz Submitted!",
            `You scored ${data.payload.totalObtainedMarks} marks in ${quizTitle} quiz.`,
            "success"
          );
        } else {
          swal(
            "Quiz not Submitted!",
            `${quizTitle} is still active. You can modify your answers`,
            "info"
          );
        }
        navigate("/quizResults");
      });

    if (isTimesUp) {
      // called by timer when it hits 0
      doSubmit();
    } else {
      swal({
        title: "Are you sure?",
        text: "Once submitted, you will not be able to modify your answers!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willSubmit) => {
        if (willSubmit) {
          // stop timer
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          doSubmit();
        }
      });
    }
  };

  // derived timer display
  const mins = Math.floor(timeRemaining / 60);
  const secs = timeRemaining % 60;

  // simple progress bar (optional): from full to zero
  const totalSeconds = Math.max(questions.length * 2 * 60, 1);
  const progressPct = Math.max(
    0,
    Math.min(100, Math.round((timeRemaining / totalSeconds) * 100))
  );

  return (
    <div className="userQuestionsPage__container">
      <div className="userQuestionsPage__content">
        <h2>{`Questions : ${quizTitle || ""}`}</h2>

        <div className="userQuestionsPage__content--options">
          <Button
            className="userQuestionsPage__content--button"
            onClick={() => submitQuizHandler(false)}
          >
            Submit Quiz
          </Button>

          <div className="userQuestionsPage__content--spinner" style={{ minWidth: 220 }}>
            {/* Bootstrap progress + plain time text */}
            <ProgressBar now={progressPct} label={`${progressPct}%`} />
            <h4 style={{ marginTop: 12 }}>
              {zeroPad(mins)} : {zeroPad(secs)}
            </h4>
            <div>Timer</div>
          </div>
        </div>

        {questions && questions.length > 0 ? (
          questions.map((q, index) => (
            <Question key={q.questionId || index} number={index + 1} question={q} />
          ))
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};

export default UserQuestionsPage;
