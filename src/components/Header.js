import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearUser } from "../redux/reducer/userSlice";

export default function Header() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);

  let isLoggedIn = false;
  if (Object.keys(user).length !== 0) {
    isLoggedIn = true;
  }

  function handleLogout() {
    dispatch(clearUser());
    localStorage.removeItem("access_token");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Home
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user.role === "jobseeker" && (
              <li className="nav-item">
                <Link className="nav-link text-capitalize" to="/applied-jobs">
                  applied jobs
                </Link>
              </li>
            )}
            {user.role === "employer" && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-capitalize" to="/my-jobs">
                    myjobs
                  </Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      register
                    </Link>
                  </li>
                </>
              )}
              {isLoggedIn && (
                <>
                  <li>
                    <Link to="user" className="nav-link">
                      profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      style={{ border: "none", backgroundColor: "#f8f9fa" }}
                      type="button"
                      onClick={handleLogout}
                    >
                      logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
