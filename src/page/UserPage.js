import axios from "axios";
import React, { useEffect, useState } from "react";

export default function UserPage() {
  const [user, setUser] = useState({});

  async function getUser() {
    try {
      const access_token = localStorage.getItem("access_token");
      const { data } = await axios(
        `${process.env.REACT_APP_SERVER_URL}/get-user`,
        {
          headers: {
            authorization: `Bearer ${access_token}`,
          },
        }
      );
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="container">
      <div className="d-flex flex-column align-items-center ">
        {user.role === "employer" ? (
          <img
            src={`${process.env.REACT_APP_SERVER_URL}/user_file/${user.file}`}
            alt="hlo"
            style={{ width: "300px", height: "200px" }}
          />
        ) : (
          <a
            href={`${process.env.REACT_APP_SERVER_URL}/user_file/${user.file}`}
            target="_blank"
            rel="noreferrer"
          >
            <h1>view cv</h1>
          </a>
        )}
        <h2>name : {user.name}</h2>
        <h3>email : {user.email}</h3>
        <h4>role : {user.role}</h4>
      </div>
    </div>
  );
}
