import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../redux/reducer/userSlice";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login() {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialLoginData = {
    email: "j@j.com",
    password: "12345678",
  };
  const [loginData, setLoginData] = useState(initialLoginData);
  const [apiError, setAPIError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // check if already login
  if (Object.keys(user).length !== 0) {
    return <Navigate to="/" />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    // console.log("clicked");
    try {
      // call login api
      // get token if sucessful
      const { data: tokenData } = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/login`,
        loginData
      );

      // call get-user api
      // get user of provided token (above token)
      const { data: userData } = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/get-user`,
        {
          headers: {
            authorization: `Bearer ${tokenData.token}`,
          },
        }
      );

      // add user to redux state
      dispatch(setUser(userData));
      localStorage.setItem("access_token", tokenData.token);
      // return to previous route
      return navigate(-1);

      // console.log(userData);
    } catch (error) {
      // console.log(error.response.data);

      setAPIError(error.response.data?.msg);
    }
    setIsLoading(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setLoginData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    // console.log(e.target.value);
  }

  return (
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone_image"
              loading="lazy"
            />
          </div>
          <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
            <form onSubmit={handleSubmit}>
              {/* <!-- Email input --> */}
              <div className="form-outline mb-4">
                <input
                  type="email"
                  id="form1Example13"
                  className="form-control form-control-lg"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                />
                <label className="form-label" htmlFor="form1Example13">
                  Email address
                </label>
              </div>

              {/* <!-- Password input --> */}
              <div className="form-outline mb-4">
                <input
                  type="password"
                  id="form1Example23"
                  className="form-control form-control-lg"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                />
                <label className="form-label" htmlFor="form1Example23">
                  Password
                </label>
              </div>

              <div className="d-flex justify-content-around align-items-center mb-4">
                <a href="#!">Forgot password?</a>
              </div>

              {/* <!-- Submit button --> */}
              <button
                type="submit"
                className="btn btn-primary btn-lg btn-block"
                style={{ backgroundColor: "#3b5998" }}
              >
                login in
              </button>
              <span className="text-danger mx-2">{apiError}</span>
              {isLoading && <span className="spinner-border "></span>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
