import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const { user } = useSelector((store) => store.user);

  if (Object.keys(user).length !== 0 && role === user.role) {
    return <Outlet />;
  }

  if (Object.keys(user).length !== 0 && role !== user.role) {
    return (
      <div className="d-flex flex-column align-items-center">
        <h1>forbidden</h1>
        <h4>login as {role}</h4>
      </div>
    );
  }

  return <Navigate to="/login" />;
}
