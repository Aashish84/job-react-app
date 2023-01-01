import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./page/home/Home";
import Login from "./page/Login";
import MyApplication from "./page/jobseeker/MyApplication";
import Register from "./page/Register";
import { setUser } from "./redux/reducer/userSlice";
import MyApplications from "./page/employer/MyApplication";
import MyJobs from "./page/employer/MyJobs";
import AddJob from "./page/employer/AddJob";
import UpdateJob from "./page/employer/UpdateJob";
import UserPage from "./page/UserPage";
import JobPage from "./page/JobPage";

export default function App() {
  const dispatch = useDispatch();

  async function getUserInitial(token) {
    try {
      const { data: userData } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/get-user`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(setUser(userData));
    } catch (error) {
      console.log(error);
      localStorage.removeItem("access_token");
    }
  }

  // if jwt token is in localstorage
  // then fetch user
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      getUserInitial(token);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user" element={<UserPage />} />

        <Route element={<ProtectedRoute role="jobseeker" />}>
          <Route path="/applied-jobs" element={<MyApplication />} />
        </Route>

        <Route element={<ProtectedRoute role="employer" />}>
          <Route path="/applications/:id" element={<MyApplications />} />
          <Route path="/my-jobs" element={<MyJobs />} />
          <Route path="/add-jobs" element={<AddJob />} />
          <Route path="/update-jobs/:id" element={<UpdateJob />} />
        </Route>

        <Route path="/job/:id" element={<JobPage />} />
        <Route
          path="*"
          element={<h1 className="text-center">404 page not found</h1>}
        />
      </Routes>
    </>
  );
}
