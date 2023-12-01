import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import "./scss/app.scss";

import Registration from "components/authentication/Registration";
import Authorization from "components/authentication/Authorization";
import TestEditBlock from "components/testEditBlock";
import Account from "pages/Account";
import TeachersRoom from "pages/TeachersRoom";
import TasksForTeacher from "components/tasksBlock/TasksForTeacher";
import TasksForStudent from "components/tasksBlock/TasksForStudent";
import Rating from "components/teachersRoomComponents/rating";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Authorization />} />
      <Route path="/account" element={<Account />} />
      <Route path="/teachersRoom" element={<TeachersRoom />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/raiting" element={<Rating />} />
      <Route path="/tasks_for_teacher" element={<TasksForTeacher />} />
      <Route path="/tasks_for_student" element={<TasksForStudent />} />
      <Route path="/topic/:topicId" element={<TestEditBlock />} />
      <Route path="/" element={<MainLayout />}>
        <Route path="/react-learning" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
// idTopic
