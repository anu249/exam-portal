import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import "./AdminProfilePage.css";
import Image from "react-bootstrap/Image";
import { fetchCategories } from "../../actions/categoriesActions";
import { fetchQuizzes } from "../../actions/quizzesActions";

const AdminProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ---- Default user data (fallback)
  const defaultUser = {
    firstName: "Admin",
    lastName: "User",
    username: "admin@example.com",
    phoneNumber: "(000) 000-0000",
    roles: [{ roleName: "ADMIN" }],
    active: true,
  };

  const loginReducer = useSelector((state) => state.loginReducer);
  const user = loginReducer.user || defaultUser;

  //const token = JSON.parse(localStorage.getItem("jwtToken"));

  const [categories, setCategories] = useState([
    { catId: 1, title: "Mathematics", description: "Basic Math Quizzes" },
    { catId: 2, title: "Science", description: "General Science Quizzes" },
  ]);

  const [quizzes, setQuizzes] = useState([
    { quizId: 1, title: "Math Basics", numOfQuestions: 10, isActive: true },
    { quizId: 2, title: "Science Trivia", numOfQuestions: 15, isActive: true },
  ]);

  useEffect(() => {
    if (!localStorage.getItem("user")) navigate("/");
  }, [navigate]);

  useEffect(() => {
    fetchCategories(dispatch).then((data) => {
      if (data?.payload?.length) setCategories(data.payload);
    });
  }, [dispatch]);

  useEffect(() => {
    fetchQuizzes(dispatch).then((data) => {
      if (data?.payload?.length) setQuizzes(data.payload);
    });
  }, [dispatch]);

  return (
    <div className="adminProfilePage__container">
      <div className="adminProfilePage__sidebar">
        <Sidebar />
      </div>

      <div className="adminProfilePage__content">
        <Image
          className="adminProfilePage__content--profilePic"
          width="20%"
          height="20%"
          roundedCircle
          src="images/user.png"
        />

        <Table bordered className="adminProfilePage__content--table">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
            </tr>
            <tr>
              <td>Username</td>
              <td>{user.username}</td>
            </tr>
            <tr>
              <td>Phone</td>
              <td>{user.phoneNumber}</td>
            </tr>
            <tr>
              <td>Role</td>
              <td>{user.roles[0]?.roleName || "N/A"}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>{user.active ? "Active" : "Inactive"}</td>
            </tr>
          </tbody>
        </Table>

        <div className="adminProfilePage__lists">
          <h4>Categories</h4>
          <ul>
            {categories.map((c) => (
              <li key={c.catId}>
                {c.title} – {c.description}
              </li>
            ))}
          </ul>

          <h4>Quizzes</h4>
          <ul>
            {quizzes.map((q) => (
              <li key={q.quizId}>
                {q.title} ({q.numOfQuestions} Questions)
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;
